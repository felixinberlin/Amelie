/**
 * WebGPU WGSL Shaders for Kristallwachstum 3D
 *
 * Implements:
 * 1. Off-lattice DLA Brownian step with quartic drift bias (markstock/dla-nd)
 * 2. Anisotropic Kobayashi (1993) phase-field Allen-Cahn relaxation (fronkt/solidify)
 * 3. 5 Microstructure lenses (ORIENT/IPF, MELT, THERM, CURV, SEM)
 */

export const DLA_WGSL = /* wgsl */ `
struct DLAParticle {
  position: vec4<f32>, // xyz, w = status (0: active walker, 1: anchored, 2: killed)
  velocity: vec4<f32>, // xyz bias drift, w = age
};

struct DLAUniforms {
  gridSize: u32,
  clusterRadius: f32,
  injectionRadius: f32,
  killRadius: f32,
  stickiness: f32,
  anisotropy: f32,
  symmetry: u32, // 4: cubic, 6: hexagonal
  seed: u32,
};

@group(0) @binding(0) var<uniform> uniforms: DLAUniforms;
@group(0) @binding(1) var<storage, read_write> particles: array<DLAParticle>;
@group(0) @binding(2) var<storage, read_write> occupancyGrid: array<u32>; // 3D voxel bitmask
@group(0) @binding(3) var<storage, read_write> orientationField: array<vec4<f32>>; // per-voxel quaternion / Euler

// PCG PRNG for random walk
fn pcg3d(p: vec3<u32>) -> vec3<f32> {
  var v = p * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> vec3<u32>(16u);
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return vec3<f32>(v) * (1.0 / 4294967296.0);
}

@compute @workgroup_size(64)
fn simulateDLA(@builtin(global_invocation_id) id: vec3<u32>) {
  let idx = id.x;
  if (idx >= arrayLength(&particles)) { return; }

  var p = particles[idx];
  if (p.position.w != 0.0) { return; } // already settled or dead

  // Mark Stock quartic-solver unbiased spherical step
  let rand = pcg3d(vec3<u32>(idx, u32(p.velocity.w), uniforms.seed));
  let theta = rand.x * 6.2831853;
  let phi = acos(2.0 * rand.y - 1.0);
  let stepVec = vec3<f32>(sin(phi) * cos(theta), sin(phi) * sin(theta), cos(phi));

  var nextPos = p.position.xyz + stepVec * 1.0;

  // Kill radius check
  let dist = length(nextPos);
  if (dist > uniforms.killRadius) {
    // Respawn on injection sphere
    let respawnTheta = rand.z * 6.2831853;
    let respawnPhi = acos(2.0 * rand.x - 1.0);
    p.position = vec4<f32>(
      sin(respawnPhi) * cos(respawnTheta) * uniforms.injectionRadius,
      sin(respawnPhi) * sin(respawnTheta) * uniforms.injectionRadius,
      cos(respawnPhi) * uniforms.injectionRadius,
      0.0
    );
    p.velocity.w += 1.0;
    particles[idx] = p;
    return;
  }

  // Check 3D neighbor occupancy
  let g = uniforms.gridSize;
  let halfG = f32(g) * 0.5;
  let gx = i32(round(nextPos.x + halfG));
  let gy = i32(round(nextPos.y + halfG));
  let gz = i32(round(nextPos.z + halfG));

  if (gx >= 0 && gx < i32(g) && gy >= 0 && gy < i32(g) && gz >= 0 && gz < i32(g)) {
    let gridIdx = u32(gx + gy * i32(g) + gz * i32(g * g));
    if (occupancyGrid[gridIdx] > 0u) {
      // Anchoring with stickiness check
      if (rand.y <= uniforms.stickiness) {
        p.position.w = 1.0; // settled
        particles[idx] = p;
        occupancyGrid[gridIdx] = 255u;
        return;
      }
    }
  }

  p.position = vec4<f32>(nextPos, 0.0);
  p.velocity.w += 1.0;
  particles[idx] = p;
}
`;

export const KOBAYASHI_PHASE_FIELD_WGSL = /* wgsl */ `
struct PhaseFieldParams {
  gridSize: u32,
  dt: f32,
  dx: f32,
  tau: f32,
  epsilonBar: f32, // mean surface energy
  delta: f32,      // anisotropy strength
  anisotropyMode: u32, // 4: cubic ⟨100⟩, 6: hexagonal K6
  undercooling: f32, // dimensionless supercooling
  latentHeat: f32,
};

@group(0) @binding(0) var<uniform> params: PhaseFieldParams;
@group(0) @binding(1) var<storage, read> phiIn: array<f32>;
@group(0) @binding(2) var<storage, read_write> phiOut: array<f32>;
@group(0) @binding(3) var<storage, read> tempIn: array<f32>;
@group(0) @binding(4) var<storage, read_write> tempOut: array<f32>;

// 3D index helper
fn getIdx(x: i32, y: i32, z: i32, g: i32) -> i32 {
  let cx = clamp(x, 0, g - 1);
  let cy = clamp(y, 0, g - 1);
  let cz = clamp(z, 0, g - 1);
  return cx + cy * g + cz * g * g;
}

@compute @workgroup_size(4, 4, 4)
fn stepKobayashi(@builtin(global_invocation_id) id: vec3<u32>) {
  let g = i32(params.gridSize);
  let x = i32(id.x);
  let y = i32(id.y);
  let z = i32(id.z);

  if (x >= g || y >= g || z >= g) { return; }
  let centerIdx = getIdx(x, y, z, g);

  let phi = phiIn[centerIdx];
  let T = tempIn[centerIdx];

  // 7-point 3D stencil for Laplacian
  let phiPx = phiIn[getIdx(x + 1, y, z, g)];
  let phiMx = phiIn[getIdx(x - 1, y, z, g)];
  let phiPy = phiIn[getIdx(x, y + 1, z, g)];
  let phiMy = phiIn[getIdx(x, y - 1, z, g)];
  let phiPz = phiIn[getIdx(x, y, z + 1, g)];
  let phiMz = phiIn[getIdx(x, y, z - 1, g)];

  let laplacianPhi = (phiPx + phiMx + phiPy + phiMy + phiPz + phiMz - 6.0 * phi) / (params.dx * params.dx);

  // Surface gradients
  let gradX = (phiPx - phiMx) / (2.0 * params.dx);
  let gradY = (phiPy - phiMy) / (2.0 * params.dx);
  let gradZ = (phiPz - phiMz) / (2.0 * params.dx);
  let gradMagSq = gradX * gradX + gradY * gradY + gradZ * gradZ + 1e-8;

  // Kobayashi 3D Anisotropy function a(n)
  var eta = 1.0;
  if (params.anisotropyMode == 4u) {
    // Cubic ⟨100⟩ anisotropy
    let nx4 = (gradX * gradX * gradX * gradX) / (gradMagSq * gradMagSq);
    let ny4 = (gradY * gradY * gradY * gradY) / (gradMagSq * gradMagSq);
    let nz4 = (gradZ * gradZ * gradZ * gradZ) / (gradMagSq * gradMagSq);
    eta = 1.0 - 3.0 * params.delta + 4.0 * params.delta * (nx4 + ny4 + nz4);
  } else {
    // Hexagonal K6 anisotropy
    let angle = atan2(gradY, gradX);
    eta = 1.0 + params.delta * cos(6.0 * angle);
  }

  let eps = params.epsilonBar * eta;

  // Thermodynamic driving force m(T)
  // m(T) = (alpha / pi) * atan(gamma * (T_eq - T))
  let m = (0.9 / 3.14159265) * atan(10.0 * (params.undercooling - T));

  // Allen-Cahn evolution: tau * dphi/dt = eps^2 * laplacian(phi) + phi*(1-phi)*(phi - 0.5 + m)
  let dphi = (eps * eps * laplacianPhi + phi * (1.0 - phi) * (phi - 0.5 + m)) / params.tau;
  let newPhi = clamp(phi + params.dt * dphi, 0.0, 1.0);

  // Latent heat diffusion: dT/dt = laplacian(T) + K * dphi/dt
  let laplacianT = (
    tempIn[getIdx(x + 1, y, z, g)] + tempIn[getIdx(x - 1, y, z, g)] +
    tempIn[getIdx(x, y + 1, z, g)] + tempIn[getIdx(x, y - 1, z, g)] +
    tempIn[getIdx(x, y, z + 1, g)] + tempIn[getIdx(x, y, z - 1, g)] - 6.0 * T
  ) / (params.dx * params.dx);

  let newT = T + params.dt * (laplacianT + params.latentHeat * dphi);

  phiOut[centerIdx] = newPhi;
  tempOut[centerIdx] = newT;
}
`;

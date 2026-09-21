/**
 * WebGL2 Fragment Shaders for the "Wet Ink" Continuum Mechanics Engine.
 *
 * Implements:
 * 1. Navier-Stokes Eulerian Grid & Shallow Water Equations (Semi-Lagrangian Advection)
 * 2. Darcy's Law & Washburn's Capillary Flow across Porous Cellulose Paper
 * 3. Directional Fiber Anisotropy Tensor & Fractional Brownian Motion (fBm) Tooth
 * 4. Robert Deegan (1997) "Coffee-Ring" Evaporative Contact-Line Rim Darkening
 * 5. Kubelka-Munk Physical Optical Glaze & Pigment Glazing Theory
 *
 * Open-Source References & Benchmarks:
 * - amandaghassaei/FluidSimulation
 * - bienehito/fluid-dynamics
 * - PavelDoGreat/WebGL-Fluid-Simulation
 */

export const VERTEX_SHADER_QUAD = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Pass 1: Semi-Lagrangian Advection of Velocity Field & Surface Fluid
 * Solves the inertial advection term in Navier-Stokes: du/dt + (u . grad)u = -grad(p)/rho + nu*laplacian(u)
 */
export const FRAGMENT_SHADER_ADVECT = `#version 300 es
precision highp float;

uniform sampler2D u_fluidState; // RGBA: (velX, velY, waterFilm_h, fiberMoisture_s)
uniform sampler2D u_paperTexture; // RGBA: (height, fiberAngle, fiberStrength, capacity)
uniform vec2 u_texelSize;
uniform float u_dt;
uniform vec2 u_tiltGravity;
uniform float u_roughnessDrag;

in vec2 v_uv;
out vec4 fragColor;

void main() {
  vec4 state = texture(u_fluidState, v_uv);
  vec2 vel = state.xy;
  float water = state.z;
  float moisture = state.w;
  
  if (water < 0.0005) {
    fragColor = vec4(0.0, 0.0, 0.0, moisture);
    return;
  }
  
  // Semi-Lagrangian Backtrace: x_prev = x - u * dt
  vec2 backtraceUV = v_uv - vel * u_texelSize * u_dt * 60.0;
  backtraceUV = clamp(backtraceUV, u_texelSize, 1.0 - u_texelSize);
  
  vec4 advectedState = texture(u_fluidState, backtraceUV);
  
  // Pressure gradient from water height differences (Shallow Water Equation)
  float hL = texture(u_fluidState, v_uv - vec2(u_texelSize.x, 0.0)).z;
  float hR = texture(u_fluidState, v_uv + vec2(u_texelSize.x, 0.0)).z;
  float hD = texture(u_fluidState, v_uv - vec2(0.0, u_texelSize.y)).z;
  float hU = texture(u_fluidState, v_uv + vec2(0.0, u_texelSize.y)).z;
  
  vec2 pressureGrad = vec2(hR - hL, hU - hD) * 1.4;
  
  // Paper roughness friction drag
  float paperHeight = texture(u_paperTexture, v_uv).r;
  float friction = clamp(1.0 - paperHeight * u_roughnessDrag * 0.45, 0.5, 0.98);
  
  // Net acceleration: Pressure Gradient + Easel Tilt Gravity
  vec2 accel = -pressureGrad + u_tiltGravity * 1.5;
  vec2 newVel = (advectedState.xy + accel * u_dt * 5.0) * friction;
  
  // CFL Stability condition: clamp velocity magnitude
  float speed = length(newVel);
  if (speed > 1.8) {
    newVel = (newVel / speed) * 1.8;
  }
  
  fragColor = vec4(newVel, advectedState.z, moisture);
}
`;

/**
 * Pass 2: Darcy's Law & Washburn's Capillary Flow along Anisotropic Fiber Tensors
 * q = -(k / mu) * grad(P)
 * Velocity is directed along the fiber angle theta with weight (1 - sigma) + sigma * cos^2(angle - theta).
 */
export const FRAGMENT_SHADER_CAPILLARY = `#version 300 es
precision highp float;

uniform sampler2D u_fluidState;   // (velX, velY, waterFilm_h, fiberMoisture_s)
uniform sampler2D u_pigmentState; // (susp1, dep1, susp2, dep2)
uniform sampler2D u_paperTexture; // (height, fiberAngle, fiberStrength, capacity)
uniform vec2 u_texelSize;
uniform float u_capillarySpeed;
uniform float u_capillaryThreshold;
uniform bool u_enableThreshold;
uniform float u_dt;

in vec2 v_uv;
layout(location = 0) out vec4 outFluid;
layout(location = 1) out vec4 outPigment;

void main() {
  vec4 fluid = texture(u_fluidState, v_uv);
  vec4 pigment = texture(u_pigmentState, v_uv);
  vec4 paper = texture(u_paperTexture, v_uv);
  
  float water = fluid.z;
  float moisture = fluid.w;
  float capacity = paper.a;
  float fiberAngle = paper.g;
  float fiberStrength = paper.b;
  
  // Check moisture threshold: prevents non-physical infinite "smoke blur"
  float effThreshold = u_enableThreshold ? u_capillaryThreshold : 0.001;
  
  // Soak surface water into porous fibers (Washburn penetration)
  if (water > 0.0001 && moisture < capacity) {
    float soak = min(water, (capacity - moisture) * 0.06);
    water -= soak;
    moisture += soak;
  }
  
  // Capillary percolation across 4 orthogonal neighbors
  if (moisture > effThreshold) {
    vec2 offsets[4] = vec2[](
      vec2(u_texelSize.x, 0.0),
      vec2(-u_texelSize.x, 0.0),
      vec2(0.0, u_texelSize.y),
      vec2(0.0, -u_texelSize.y)
    );
    float angles[4] = float[](0.0, 3.14159265, 1.5707963, -1.5707963);
    
    for (int i = 0; i < 4; i++) {
      vec2 nUV = v_uv + offsets[i];
      vec4 nFluid = texture(u_fluidState, nUV);
      vec4 nPaper = texture(u_paperTexture, nUV);
      float nMoist = nFluid.w;
      float nCap = nPaper.a;
      
      if (nMoist < moisture && nMoist < nCap) {
        // Anisotropic Permeability Tensor projection
        float dTheta = angles[i] - fiberAngle;
        float cosT = cos(dTheta);
        float tensorWeight = (1.0 - fiberStrength) + fiberStrength * (cosT * cosT);
        
        float flux = (moisture - nMoist) * u_capillarySpeed * tensorWeight * 0.08 * u_dt * 60.0;
        moisture -= flux * 0.25;
      }
    }
  }
  
  outFluid = vec4(fluid.xy, water, moisture);
  outPigment = pigment;
}
`;

/**
 * Pass 3: Robert Deegan (1997) "Coffee-Ring" Evaporative Rim Darkening & Pigment Fixation
 * At the pinned contact line, evaporative loss J(r) diverges as (R - r)^(-lambda).
 * Fluid continuity rushes suspended pigment to the boundary, depositing edge darkening.
 * In shader space, this is evaluated via the pigment gradient |grad(rho)|.
 */
export const FRAGMENT_SHADER_COFFEE_RING = `#version 300 es
precision highp float;

uniform sampler2D u_fluidState;   // (velX, velY, waterFilm_h, fiberMoisture_s)
uniform sampler2D u_pigmentState; // (susp1, dep1, susp2, dep2)
uniform sampler2D u_paperTexture; // (height, fiberAngle, fiberStrength, capacity)
uniform vec2 u_texelSize;
uniform float u_evaporationRate;
uniform float u_edgeDarkening;
uniform float u_granulationStrength;
uniform float u_dt;

in vec2 v_uv;
layout(location = 0) out vec4 outFluid;
layout(location = 1) out vec4 outPigment;

void main() {
  vec4 fluid = texture(u_fluidState, v_uv);
  vec4 pigment = texture(u_pigmentState, v_uv);
  vec4 paper = texture(u_paperTexture, v_uv);
  
  float water = fluid.z;
  float moisture = fluid.w;
  float susp = pigment.r;
  float dep = pigment.g;
  
  // Calculate local gradient of pigment / water boundary |grad(rho)|
  float wL = texture(u_fluidState, v_uv - vec2(u_texelSize.x, 0.0)).z;
  float wR = texture(u_fluidState, v_uv + vec2(u_texelSize.x, 0.0)).z;
  float wD = texture(u_fluidState, v_uv - vec2(0.0, u_texelSize.y)).z;
  float wU = texture(u_fluidState, v_uv + vec2(0.0, u_texelSize.y)).z;
  
  vec2 waterGrad = vec2(wR - wL, wU - wD);
  float gradMag = length(waterGrad);
  bool isContactLine = (wL < 0.02 || wR < 0.02 || wD < 0.02 || wU < 0.02) && (water > 0.001);
  
  // Edge evaporates faster (Robert Deegan 1997 evaporative singularity)
  float evap = isContactLine ? u_evaporationRate * 2.4 : u_evaporationRate;
  water = max(0.0, water - evap * 0.003 * u_dt * 60.0);
  moisture = max(0.0, moisture - evap * 0.001 * u_dt * 60.0);
  
  // Coffee-Ring pigment deposition: multiplier proportional to (1 + c * |grad(rho)|)
  if (isContactLine && susp > 0.005) {
    float ringDeposit = susp * (0.04 * u_edgeDarkening * (1.0 + 3.0 * gradMag));
    susp -= ringDeposit;
    dep += ringDeposit * 1.5;
  }
  
  // Paper tooth granulation: pigment settles into paper valleys (1.0 - height)
  float paperToothValley = 1.0 - paper.r;
  float valleyDep = susp * 0.015 * u_granulationStrength * (0.5 + paperToothValley * 1.5);
  susp = max(0.0, susp - valleyDep);
  dep += valleyDep;
  
  outFluid = vec4(fluid.xy, water, moisture);
  outPigment = vec4(susp, dep, pigment.b, pigment.a);
}
`;

/**
 * Pass 4: Kubelka-Munk Optical Glazing & Grazing Raking Light Composite
 * Implements physical absorption (K) and scattering (S) spectra.
 * Layering yellow over blue physically yields vibrant emerald green, not muddy brown.
 */
export const FRAGMENT_SHADER_KUBELKA_MUNK = `#version 300 es
precision highp float;

uniform sampler2D u_fluidState;
uniform sampler2D u_pigmentState;
uniform sampler2D u_paperTexture;
uniform vec2 u_texelSize;

uniform vec3 u_pigment1_K;
uniform vec3 u_pigment1_S;
uniform vec3 u_pigment2_K;
uniform vec3 u_pigment2_S;

uniform float u_rakingAngle;
uniform float u_rakingIntensity;
uniform int u_viewLayer; // 0 = composite, 1 = moisture, 2 = paper, 3 = pigment, 4 = vectorField

in vec2 v_uv;
out vec4 fragColor;

float coth(float z) {
  float ez = exp(clamp(2.0 * z, -30.0, 30.0));
  return (ez + 1.0) / max(0.00001, ez - 1.0);
}

float kmReflectance(float K, float S, float thickness, float Rg) {
  if (thickness < 0.0001 || (K < 0.0001 && S < 0.0001)) return Rg;
  float safeS = max(0.001, S);
  float a = 1.0 + K / safeS;
  float b = sqrt(max(0.00001, a * a - 1.0));
  float bSx = b * safeS * thickness;
  if (bSx > 12.0) return a - b;
  float c = coth(bSx);
  float num = 1.0 - Rg * (a - b * c);
  float den = a - Rg + b * c;
  return clamp(num / max(0.0001, den), 0.0, 1.0);
}

void main() {
  vec4 fluid = texture(u_fluidState, v_uv);
  vec4 pigment = texture(u_pigmentState, v_uv);
  vec4 paper = texture(u_paperTexture, v_uv);
  
  float water = fluid.z;
  float moisture = fluid.w;
  float p1_susp = pigment.r;
  float p1_dep = pigment.g;
  float p2_susp = pigment.b;
  float p2_dep = pigment.a;
  
  // Debug / Inspection Views
  if (u_viewLayer == 1) {
    // Moisture Front
    if (moisture > 0.001 || water > 0.001) {
      fragColor = vec4(0.1, 0.5 + moisture * 0.5, 0.7 + water * 0.3, 1.0);
    } else {
      fragColor = vec4(0.97, 0.96, 0.94, 1.0);
    }
    return;
  } else if (u_viewLayer == 2) {
    // Paper Tooth & Fiber Normals
    vec2 lightDir = vec2(cos(u_rakingAngle), sin(u_rakingAngle));
    float hL = texture(u_paperTexture, v_uv - vec2(u_texelSize.x, 0.0)).r;
    float hR = texture(u_paperTexture, v_uv + vec2(u_texelSize.x, 0.0)).r;
    float hD = texture(u_paperTexture, v_uv - vec2(0.0, u_texelSize.y)).r;
    float hU = texture(u_paperTexture, v_uv + vec2(0.0, u_texelSize.y)).r;
    float slope = (hR - hL) * lightDir.x + (hU - hD) * lightDir.y;
    float shade = clamp(0.9 + slope * 2.2 * u_rakingIntensity, 0.1, 1.0);
    fragColor = vec4(shade, shade * 0.98, shade * 0.92, 1.0);
    return;
  } else if (u_viewLayer == 3) {
    // Isolated Pigment Density (Coffee-ring & Granulation)
    float totalP = (p1_dep + p1_susp) + (p2_dep + p2_susp);
    float val = clamp(1.0 - totalP * 0.9, 0.0, 1.0);
    fragColor = vec4(val, val, val, 1.0);
    return;
  } else if (u_viewLayer == 4) {
    // Navier-Stokes Fluid Velocity Field (Normalized Color Map)
    vec2 vel = fluid.xy;
    float spd = length(vel);
    fragColor = vec4(0.5 + vel.x * 0.5, 0.5 + vel.y * 0.5, min(1.0, spd), 1.0);
    return;
  }
  
  // Composite View:
  // 1. Raking Light Relief on Paper Substrate
  vec2 lightDir = vec2(cos(u_rakingAngle), sin(u_rakingAngle));
  float hL = texture(u_paperTexture, v_uv - vec2(u_texelSize.x, 0.0)).r;
  float hR = texture(u_paperTexture, v_uv + vec2(u_texelSize.x, 0.0)).r;
  float hD = texture(u_paperTexture, v_uv - vec2(0.0, u_texelSize.y)).r;
  float hU = texture(u_paperTexture, v_uv + vec2(0.0, u_texelSize.y)).r;
  float slope = (hR - hL) * lightDir.x + (hU - hD) * lightDir.y;
  float relief = 1.0 + slope * 0.5;
  
  // Archival rag paper base reflectance
  vec3 Rg = vec3(0.97, 0.955, 0.92) * relief;
  
  // 2. Kubelka-Munk Spectral Combination of Pigment 1 & Pigment 2
  float c1 = p1_dep * 1.1 + p1_susp * 0.85;
  float c2 = p2_dep * 1.1 + p2_susp * 0.85;
  
  vec3 K_mix = u_pigment1_K * c1 + u_pigment2_K * c2;
  vec3 S_mix = u_pigment1_S * c1 + u_pigment2_S * c2;
  float thickness = max(0.0001, c1 + c2);
  
  vec3 color = vec3(
    kmReflectance(K_mix.r, S_mix.r, thickness, Rg.r),
    kmReflectance(K_mix.g, S_mix.g, thickness, Rg.g),
    kmReflectance(K_mix.b, S_mix.b, thickness, Rg.b)
  );
  
  // 3. Specular Sheen on Wet Ink Puddles
  if (water > 0.03) {
    float glint = min(0.18, water * 0.15);
    color += vec3(glint);
  }
  
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

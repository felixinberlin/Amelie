import {
  VERTEX_SHADER_QUAD,
  FRAGMENT_SHADER_ADVECT,
  FRAGMENT_SHADER_CAPILLARY,
  FRAGMENT_SHADER_COFFEE_RING,
  FRAGMENT_SHADER_KUBELKA_MUNK,
} from './shaders';
import { PaperMaps } from './paper';
import {
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
  SimulationLayer,
} from './types';

interface FBO {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
}

export class WebGL2WetInkEngine {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly width: number;
  readonly height: number;
  readonly isSupported: boolean;

  private quadVao: WebGLVertexArrayObject | null = null;
  private quadVbo: WebGLBuffer | null = null;

  // Shader Programs
  private advectProgram: WebGLProgram | null = null;
  private capillaryProgram: WebGLProgram | null = null;
  private coffeeRingProgram: WebGLProgram | null = null;
  private renderProgram: WebGLProgram | null = null;

  // Ping-Pong FBOs
  private fluidFboA: FBO | null = null;
  private fluidFboB: FBO | null = null;
  private pigmentFboA: FBO | null = null;
  private pigmentFboB: FBO | null = null;

  // Paper Texture
  private paperTexture: WebGLTexture | null = null;

  // Active configurations
  private paperConfig: WetInkPaperConfig;
  private pigment1: WetInkPigmentConfig;
  private pigment2: WetInkPigmentConfig | null = null;
  private params: WetInkSimParams;

  // Simulation Metrics
  activeCells: number = 0;
  totalWater: number = 0;
  gpuTimeMs: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    paper: PaperMaps,
    paperConfig: WetInkPaperConfig,
    pigment: WetInkPigmentConfig,
    params: WetInkSimParams
  ) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.paperConfig = paperConfig;
    this.pigment1 = pigment;
    this.params = params;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      this.isSupported = false;
      this.gl = null as unknown as WebGL2RenderingContext;
      return;
    }

    this.gl = gl;
    this.isSupported = true;

    // Enable float texture extensions if available
    gl.getExtension('EXT_color_buffer_float');

    this.initQuad();
    this.initShaders();
    this.initFbos();
    this.uploadPaperTexture(paper);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram | null {
    const gl = this.gl;
    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  private initQuad() {
    const gl = this.gl;
    this.quadVao = gl.createVertexArray();
    gl.bindVertexArray(this.quadVao);

    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    this.quadVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }

  private initShaders() {
    this.advectProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_ADVECT);
    this.capillaryProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_CAPILLARY);
    this.coffeeRingProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_COFFEE_RING);
    this.renderProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_KUBELKA_MUNK);
  }

  private createFbo(width: number, height: number): FBO {
    const gl = this.gl;
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Use RGBA16F or RGBA32F for precision, fallback to RGBA
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      width,
      height,
      0,
      gl.RGBA,
      gl.FLOAT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );

    // Clear to zero
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: fb, texture: tex };
  }

  private initFbos() {
    this.fluidFboA = this.createFbo(this.width, this.height);
    this.fluidFboB = this.createFbo(this.width, this.height);
    this.pigmentFboA = this.createFbo(this.width, this.height);
    this.pigmentFboB = this.createFbo(this.width, this.height);
  }

  uploadPaperTexture(paper: PaperMaps) {
    const gl = this.gl;
    if (!this.paperTexture) {
      this.paperTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);

    const size = this.width * this.height;
    const data = new Float32Array(size * 4);
    for (let i = 0; i < size; i++) {
      const idx = i * 4;
      data[idx + 0] = paper.heightMap[i];
      data[idx + 1] = paper.fiberAngleMap[i];
      data[idx + 2] = paper.fiberStrengthMap[i];
      data[idx + 3] = paper.capacityMap[i];
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.FLOAT,
      data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  setPaper(paper: PaperMaps, config: WetInkPaperConfig) {
    this.paperConfig = config;
    this.uploadPaperTexture(paper);
  }

  setPigment(pigment: WetInkPigmentConfig, slot: 1 | 2 = 1) {
    if (slot === 1) {
      this.pigment1 = pigment;
    } else {
      this.pigment2 = pigment;
    }
  }

  setParams(params: WetInkSimParams) {
    this.params = params;
  }

  clear() {
    const gl = this.gl;
    if (!gl) return;
    [this.fluidFboA, this.fluidFboB, this.pigmentFboA, this.pigmentFboB].forEach((fbo) => {
      if (!fbo) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.totalWater = 0;
    this.activeCells = 0;
  }

  injectInk(
    x: number,
    y: number,
    radius: number,
    waterAmount: number,
    pigmentAmount: number,
    pigmentSlot: 1 | 2 = 1
  ) {
    const gl = this.gl;
    if (!gl || !this.fluidFboA || !this.pigmentFboA) return;

    // CPU-side stamp to texture buffer or read-modify-write on subregion
    const minX = Math.max(0, Math.floor(x - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(x + radius));
    const minY = Math.max(0, Math.floor(y - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(y + radius));
    const subW = maxX - minX + 1;
    const subH = maxY - minY + 1;

    if (subW <= 0 || subH <= 0) return;

    const fluidData = new Float32Array(subW * subH * 4);
    const pigmentData = new Float32Array(subW * subH * 4);

    // Read current subregion from fluidFboA
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboA.framebuffer);
    gl.readPixels(minX, minY, subW, subH, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pigmentFboA.framebuffer);
    gl.readPixels(minX, minY, subW, subH, gl.RGBA, gl.FLOAT, pigmentData);

    const rSq = radius * radius;
    for (let sy = 0; sy < subH; sy++) {
      const curY = minY + sy;
      const dy = curY - y;
      for (let sx = 0; sx < subW; sx++) {
        const curX = minX + sx;
        const dx = curX - x;
        const distSq = dx * dx + dy * dy;
        if (distSq <= rSq) {
          const falloff = Math.max(0, 1 - Math.sqrt(distSq) / radius);
          const pIdx = (sy * subW + sx) * 4;

          // Add surface water
          fluidData[pIdx + 2] = Math.min(2.5, fluidData[pIdx + 2] + waterAmount * falloff);

          // Add pigment to slot 1 (RGBA: r=susp1, g=dep1) or slot 2 (b=susp2, a=dep2)
          if (pigmentSlot === 1) {
            pigmentData[pIdx + 0] = Math.min(3.0, pigmentData[pIdx + 0] + pigmentAmount * falloff);
          } else {
            pigmentData[pIdx + 2] = Math.min(3.0, pigmentData[pIdx + 2] + pigmentAmount * falloff);
          }
        }
      }
    }

    // Write back to fluidFboA & pigmentFboA
    gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, minX, minY, subW, subH, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, minX, minY, subW, subH, gl.RGBA, gl.FLOAT, pigmentData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.totalWater += waterAmount * 1.5;
    this.activeCells = Math.min(this.width * this.height, this.activeCells + subW * subH);
  }

  injectSeal(centerX: number, centerY: number, size: number = 32) {
    const half = Math.floor(size / 2);
    const minX = Math.max(0, Math.floor(centerX - half));
    const maxX = Math.min(this.width - 1, Math.ceil(centerX + half));
    const minY = Math.max(0, Math.floor(centerY - half));
    const maxY = Math.min(this.height - 1, Math.ceil(centerY + half));
    const subW = maxX - minX + 1;
    const subH = maxY - minY + 1;

    if (subW <= 0 || subH <= 0) return;

    const gl = this.gl;
    const fluidData = new Float32Array(subW * subH * 4);
    const pigmentData = new Float32Array(subW * subH * 4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboA!.framebuffer);
    gl.readPixels(minX, minY, subW, subH, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pigmentFboA!.framebuffer);
    gl.readPixels(minX, minY, subW, subH, gl.RGBA, gl.FLOAT, pigmentData);

    for (let sy = 0; sy < subH; sy++) {
      const cy = minY + sy;
      const dy = Math.abs(cy - centerY);
      for (let sx = 0; sx < subW; sx++) {
        const cx = minX + sx;
        const dx = Math.abs(cx - centerX);

        const isBorder = (dx >= half - 3 && dx <= half && dy <= half) || (dy >= half - 3 && dy <= half && dx <= half);
        const isInnerCross = (dx <= 2 && dy <= half - 6) || (dy <= 2 && dx <= half - 6);
        const isInnerDot = (dx >= 5 && dx <= 8 && dy >= 5 && dy <= 8);

        if (isBorder || isInnerCross || isInnerDot) {
          const idx = (sy * subW + sx) * 4;
          fluidData[idx + 2] = Math.min(2.2, fluidData[idx + 2] + 0.9);
          pigmentData[idx + 0] = Math.min(3.0, pigmentData[idx + 0] + 1.8);
        }
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA!.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, minX, minY, subW, subH, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA!.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, minX, minY, subW, subH, gl.RGBA, gl.FLOAT, pigmentData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.totalWater += 15.0;
  }

  forceDry() {
    const gl = this.gl;
    if (!gl || !this.fluidFboA || !this.pigmentFboA) return;

    // Read pigment and fluid, zero out water and convert suspended to deposited
    const size = this.width * this.height;
    const fluidData = new Float32Array(size * 4);
    const pigmentData = new Float32Array(size * 4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboA.framebuffer);
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pigmentFboA.framebuffer);
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.FLOAT, pigmentData);

    for (let i = 0; i < size; i++) {
      const idx = i * 4;
      fluidData[idx + 0] = 0; // velX
      fluidData[idx + 1] = 0; // velY
      fluidData[idx + 2] = 0; // water
      fluidData[idx + 3] = 0; // moisture

      // Deposit pigment 1
      pigmentData[idx + 1] += pigmentData[idx + 0];
      pigmentData[idx + 0] = 0;

      // Deposit pigment 2
      pigmentData[idx + 3] += pigmentData[idx + 2];
      pigmentData[idx + 2] = 0;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.FLOAT, fluidData);

    gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.FLOAT, pigmentData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.totalWater = 0;
    this.activeCells = 0;
  }

  /**
   * Advances the physical continuum mechanics passes:
   * Pass 1: Semi-Lagrangian Advection
   * Pass 2: Darcy-Washburn Capillary Flow
   * Pass 3: Deegan Coffee-Ring Evaporation
   */
  step(dt: number = 0.016) {
    const gl = this.gl;
    if (!gl || !this.quadVao) return;

    const t0 = performance.now();
    gl.viewport(0, 0, this.width, this.height);
    gl.bindVertexArray(this.quadVao);

    const texelSizeX = 1.0 / this.width;
    const texelSizeY = 1.0 / this.height;

    // --- PASS 1: Advection (Fluid FBO A -> Fluid FBO B) ---
    if (this.advectProgram && this.fluidFboA && this.fluidFboB) {
      gl.useProgram(this.advectProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboB.framebuffer);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
      gl.uniform1i(gl.getUniformLocation(this.advectProgram, 'u_fluidState'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(gl.getUniformLocation(this.advectProgram, 'u_paperTexture'), 1);

      gl.uniform2f(gl.getUniformLocation(this.advectProgram, 'u_texelSize'), texelSizeX, texelSizeY);
      gl.uniform1f(gl.getUniformLocation(this.advectProgram, 'u_dt'), dt);
      gl.uniform2f(
        gl.getUniformLocation(this.advectProgram, 'u_tiltGravity'),
        (this.params.tiltX || 0) * 1.5,
        (this.params.tiltY || 0) * 1.5
      );
      gl.uniform1f(gl.getUniformLocation(this.advectProgram, 'u_roughnessDrag'), this.paperConfig.roughness);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Swap fluid FBOs
      const tmp = this.fluidFboA;
      this.fluidFboA = this.fluidFboB;
      this.fluidFboB = tmp;
    }

    // --- PASS 2: Capillary Flow (Darcy & Washburn) ---
    if (this.capillaryProgram && this.fluidFboA && this.fluidFboB && this.pigmentFboA && this.pigmentFboB) {
      gl.useProgram(this.capillaryProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboB.framebuffer);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
      gl.uniform1i(gl.getUniformLocation(this.capillaryProgram, 'u_fluidState'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA.texture);
      gl.uniform1i(gl.getUniformLocation(this.capillaryProgram, 'u_pigmentState'), 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(gl.getUniformLocation(this.capillaryProgram, 'u_paperTexture'), 2);

      gl.uniform2f(gl.getUniformLocation(this.capillaryProgram, 'u_texelSize'), texelSizeX, texelSizeY);
      gl.uniform1f(gl.getUniformLocation(this.capillaryProgram, 'u_capillarySpeed'), this.params.capillarySpeed * this.pigment1.bleedSpeed);
      gl.uniform1f(gl.getUniformLocation(this.capillaryProgram, 'u_capillaryThreshold'), this.params.capillaryThreshold);
      gl.uniform1i(gl.getUniformLocation(this.capillaryProgram, 'u_enableThreshold'), this.params.enableCapillaryThreshold ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(this.capillaryProgram, 'u_dt'), dt);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const tmp = this.fluidFboA;
      this.fluidFboA = this.fluidFboB;
      this.fluidFboB = tmp;
    }

    // --- PASS 3: Deegan (1997) Coffee-Ring Evaporation & Granulation ---
    if (this.coffeeRingProgram && this.fluidFboA && this.fluidFboB && this.pigmentFboA && this.pigmentFboB) {
      gl.useProgram(this.coffeeRingProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fluidFboB.framebuffer);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
      gl.uniform1i(gl.getUniformLocation(this.coffeeRingProgram, 'u_fluidState'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA.texture);
      gl.uniform1i(gl.getUniformLocation(this.coffeeRingProgram, 'u_pigmentState'), 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(gl.getUniformLocation(this.coffeeRingProgram, 'u_paperTexture'), 2);

      gl.uniform2f(gl.getUniformLocation(this.coffeeRingProgram, 'u_texelSize'), texelSizeX, texelSizeY);
      gl.uniform1f(gl.getUniformLocation(this.coffeeRingProgram, 'u_evaporationRate'), this.params.evaporationRate * this.paperConfig.evaporationMult);
      gl.uniform1f(gl.getUniformLocation(this.coffeeRingProgram, 'u_edgeDarkening'), this.params.edgeDarkeningStrength * this.pigment1.edgeDarkening);
      gl.uniform1f(gl.getUniformLocation(this.coffeeRingProgram, 'u_granulationStrength'), this.params.granulationStrength * this.pigment1.granulationFactor);
      gl.uniform1f(gl.getUniformLocation(this.coffeeRingProgram, 'u_dt'), dt);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const tmpF = this.fluidFboA;
      this.fluidFboA = this.fluidFboB;
      this.fluidFboB = tmpF;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);

    this.gpuTimeMs = performance.now() - t0;
  }

  /**
   * Renders the final optical glaze onto the screen canvas via Kubelka-Munk theory.
   */
  render(layer: SimulationLayer, rakingAngle: number = 2.4, rakingIntensity: number = 0.65) {
    const gl = this.gl;
    if (!gl || !this.renderProgram || !this.quadVao || !this.fluidFboA || !this.pigmentFboA) return;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(this.renderProgram);
    gl.bindVertexArray(this.quadVao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fluidFboA.texture);
    gl.uniform1i(gl.getUniformLocation(this.renderProgram, 'u_fluidState'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.pigmentFboA.texture);
    gl.uniform1i(gl.getUniformLocation(this.renderProgram, 'u_pigmentState'), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
    gl.uniform1i(gl.getUniformLocation(this.renderProgram, 'u_paperTexture'), 2);

    gl.uniform2f(gl.getUniformLocation(this.renderProgram, 'u_texelSize'), 1.0 / this.width, 1.0 / this.height);

    // Kubelka-Munk Pigment 1 coefficients
    const km1 = this.pigment1.km || { K: [2.5, 2.5, 2.5], S: [0.2, 0.2, 0.2] };
    gl.uniform3f(gl.getUniformLocation(this.renderProgram, 'u_pigment1_K'), km1.K[0], km1.K[1], km1.K[2]);
    gl.uniform3f(gl.getUniformLocation(this.renderProgram, 'u_pigment1_S'), km1.S[0], km1.S[1], km1.S[2]);

    // Kubelka-Munk Pigment 2 coefficients (default to yellow if null for layering)
    const km2 = this.pigment2?.km || { K: [0.12, 0.35, 4.2], S: [0.85, 0.78, 0.20] };
    gl.uniform3f(gl.getUniformLocation(this.renderProgram, 'u_pigment2_K'), km2.K[0], km2.K[1], km2.K[2]);
    gl.uniform3f(gl.getUniformLocation(this.renderProgram, 'u_pigment2_S'), km2.S[0], km2.S[1], km2.S[2]);

    gl.uniform1f(gl.getUniformLocation(this.renderProgram, 'u_rakingAngle'), rakingAngle);
    gl.uniform1f(gl.getUniformLocation(this.renderProgram, 'u_rakingIntensity'), rakingIntensity);

    // Map layer name to integer
    let layerCode = 0;
    if (layer === 'moisture') layerCode = 1;
    else if (layer === 'paper') layerCode = 2;
    else if (layer === 'pigment') layerCode = 3;
    else if (layer === 'vectorField') layerCode = 4;

    gl.uniform1i(gl.getUniformLocation(this.renderProgram, 'u_viewLayer'), layerCode);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    if (!gl) return;
    if (this.quadVao) gl.deleteVertexArray(this.quadVao);
    if (this.quadVbo) gl.deleteBuffer(this.quadVbo);
    [this.advectProgram, this.capillaryProgram, this.coffeeRingProgram, this.renderProgram].forEach((p) => {
      if (p) gl.deleteProgram(p);
    });
    [this.fluidFboA, this.fluidFboB, this.pigmentFboA, this.pigmentFboB].forEach((fbo) => {
      if (!fbo) return;
      gl.deleteFramebuffer(fbo.framebuffer);
      gl.deleteTexture(fbo.texture);
    });
    if (this.paperTexture) gl.deleteTexture(this.paperTexture);
  }
}

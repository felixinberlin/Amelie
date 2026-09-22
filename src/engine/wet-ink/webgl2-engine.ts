import {
  VERTEX_SHADER_QUAD,
  FRAGMENT_SHADER_ADVECT,
  FRAGMENT_SHADER_CAPILLARY,
  FRAGMENT_SHADER_COFFEE_RING,
  FRAGMENT_SHADER_KUBELKA_MUNK,
  FRAGMENT_SHADER_SPLAT,
  FRAGMENT_SHADER_DRY,
} from './shaders';
import { PaperMaps } from './paper';
import {
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
  SimulationLayer,
} from './types';

interface DoubleFBO {
  framebuffer: WebGLFramebuffer;
  fluidTex: WebGLTexture;
  pigmentTex: WebGLTexture;
}

interface AdvectLocs {
  fluidState: WebGLUniformLocation | null;
  pigmentState: WebGLUniformLocation | null;
  paperTexture: WebGLUniformLocation | null;
  texelSize: WebGLUniformLocation | null;
  dt: WebGLUniformLocation | null;
  tiltGravity: WebGLUniformLocation | null;
  roughnessDrag: WebGLUniformLocation | null;
}

interface CapillaryLocs {
  fluidState: WebGLUniformLocation | null;
  pigmentState: WebGLUniformLocation | null;
  paperTexture: WebGLUniformLocation | null;
  texelSize: WebGLUniformLocation | null;
  capillarySpeed: WebGLUniformLocation | null;
  capillaryThreshold: WebGLUniformLocation | null;
  enableThreshold: WebGLUniformLocation | null;
  dt: WebGLUniformLocation | null;
}

interface CoffeeLocs {
  fluidState: WebGLUniformLocation | null;
  pigmentState: WebGLUniformLocation | null;
  paperTexture: WebGLUniformLocation | null;
  texelSize: WebGLUniformLocation | null;
  evaporationRate: WebGLUniformLocation | null;
  edgeDarkening: WebGLUniformLocation | null;
  granulationStrength: WebGLUniformLocation | null;
  dt: WebGLUniformLocation | null;
}

interface SplatLocs {
  point: WebGLUniformLocation | null;
  radius: WebGLUniformLocation | null;
  aspect: WebGLUniformLocation | null;
  fluidSplat: WebGLUniformLocation | null;
  pigmentSplat: WebGLUniformLocation | null;
}

interface DryLocs {
  pigmentState: WebGLUniformLocation | null;
}

interface RenderLocs {
  fluidState: WebGLUniformLocation | null;
  pigmentState: WebGLUniformLocation | null;
  paperTexture: WebGLUniformLocation | null;
  texelSize: WebGLUniformLocation | null;
  pigment1_K: WebGLUniformLocation | null;
  pigment1_S: WebGLUniformLocation | null;
  pigment2_K: WebGLUniformLocation | null;
  pigment2_S: WebGLUniformLocation | null;
  rakingAngle: WebGLUniformLocation | null;
  rakingIntensity: WebGLUniformLocation | null;
  viewLayer: WebGLUniformLocation | null;
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
  private splatProgram: WebGLProgram | null = null;
  private dryProgram: WebGLProgram | null = null;
  private renderProgram: WebGLProgram | null = null;

  // Cached uniform locations for zero-overhead per-frame dispatch
  private advectLocs!: AdvectLocs;
  private capillaryLocs!: CapillaryLocs;
  private coffeeLocs!: CoffeeLocs;
  private splatLocs!: SplatLocs;
  private dryLocs!: DryLocs;
  private renderLocs!: RenderLocs;

  // Ping-Pong Double FBOs with Multiple Render Targets (MRT)
  private fboA: DoubleFBO | null = null;
  private fboB: DoubleFBO | null = null;

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

    // Enable color float rendering
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
    const gl = this.gl;

    this.advectProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_ADVECT);
    if (this.advectProgram) {
      this.advectLocs = {
        fluidState: gl.getUniformLocation(this.advectProgram, 'u_fluidState'),
        pigmentState: gl.getUniformLocation(this.advectProgram, 'u_pigmentState'),
        paperTexture: gl.getUniformLocation(this.advectProgram, 'u_paperTexture'),
        texelSize: gl.getUniformLocation(this.advectProgram, 'u_texelSize'),
        dt: gl.getUniformLocation(this.advectProgram, 'u_dt'),
        tiltGravity: gl.getUniformLocation(this.advectProgram, 'u_tiltGravity'),
        roughnessDrag: gl.getUniformLocation(this.advectProgram, 'u_roughnessDrag'),
      };
    }

    this.capillaryProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_CAPILLARY);
    if (this.capillaryProgram) {
      this.capillaryLocs = {
        fluidState: gl.getUniformLocation(this.capillaryProgram, 'u_fluidState'),
        pigmentState: gl.getUniformLocation(this.capillaryProgram, 'u_pigmentState'),
        paperTexture: gl.getUniformLocation(this.capillaryProgram, 'u_paperTexture'),
        texelSize: gl.getUniformLocation(this.capillaryProgram, 'u_texelSize'),
        capillarySpeed: gl.getUniformLocation(this.capillaryProgram, 'u_capillarySpeed'),
        capillaryThreshold: gl.getUniformLocation(this.capillaryProgram, 'u_capillaryThreshold'),
        enableThreshold: gl.getUniformLocation(this.capillaryProgram, 'u_enableThreshold'),
        dt: gl.getUniformLocation(this.capillaryProgram, 'u_dt'),
      };
    }

    this.coffeeRingProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_COFFEE_RING);
    if (this.coffeeRingProgram) {
      this.coffeeLocs = {
        fluidState: gl.getUniformLocation(this.coffeeRingProgram, 'u_fluidState'),
        pigmentState: gl.getUniformLocation(this.coffeeRingProgram, 'u_pigmentState'),
        paperTexture: gl.getUniformLocation(this.coffeeRingProgram, 'u_paperTexture'),
        texelSize: gl.getUniformLocation(this.coffeeRingProgram, 'u_texelSize'),
        evaporationRate: gl.getUniformLocation(this.coffeeRingProgram, 'u_evaporationRate'),
        edgeDarkening: gl.getUniformLocation(this.coffeeRingProgram, 'u_edgeDarkening'),
        granulationStrength: gl.getUniformLocation(this.coffeeRingProgram, 'u_granulationStrength'),
        dt: gl.getUniformLocation(this.coffeeRingProgram, 'u_dt'),
      };
    }

    this.splatProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_SPLAT);
    if (this.splatProgram) {
      this.splatLocs = {
        point: gl.getUniformLocation(this.splatProgram, 'u_point'),
        radius: gl.getUniformLocation(this.splatProgram, 'u_radius'),
        aspect: gl.getUniformLocation(this.splatProgram, 'u_aspect'),
        fluidSplat: gl.getUniformLocation(this.splatProgram, 'u_fluidSplat'),
        pigmentSplat: gl.getUniformLocation(this.splatProgram, 'u_pigmentSplat'),
      };
    }

    this.dryProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_DRY);
    if (this.dryProgram) {
      this.dryLocs = {
        pigmentState: gl.getUniformLocation(this.dryProgram, 'u_pigmentState'),
      };
    }

    this.renderProgram = this.createProgram(VERTEX_SHADER_QUAD, FRAGMENT_SHADER_KUBELKA_MUNK);
    if (this.renderProgram) {
      this.renderLocs = {
        fluidState: gl.getUniformLocation(this.renderProgram, 'u_fluidState'),
        pigmentState: gl.getUniformLocation(this.renderProgram, 'u_pigmentState'),
        paperTexture: gl.getUniformLocation(this.renderProgram, 'u_paperTexture'),
        texelSize: gl.getUniformLocation(this.renderProgram, 'u_texelSize'),
        pigment1_K: gl.getUniformLocation(this.renderProgram, 'u_pigment1_K'),
        pigment1_S: gl.getUniformLocation(this.renderProgram, 'u_pigment1_S'),
        pigment2_K: gl.getUniformLocation(this.renderProgram, 'u_pigment2_K'),
        pigment2_S: gl.getUniformLocation(this.renderProgram, 'u_pigment2_S'),
        rakingAngle: gl.getUniformLocation(this.renderProgram, 'u_rakingAngle'),
        rakingIntensity: gl.getUniformLocation(this.renderProgram, 'u_rakingIntensity'),
        viewLayer: gl.getUniformLocation(this.renderProgram, 'u_viewLayer'),
      };
    }
  }

  private createDoubleFbo(width: number, height: number): DoubleFBO {
    const gl = this.gl;
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // Color Attachment 0: Fluid (velX, velY, water, moisture)
    const fluidTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, fluidTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fluidTex, 0);

    // Color Attachment 1: Pigment (susp1, dep1, susp2, dep2)
    const pigmentTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, pigmentTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, pigmentTex, 0);

    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: fb, fluidTex, pigmentTex };
  }

  private initFbos() {
    this.fboA = this.createDoubleFbo(this.width, this.height);
    this.fboB = this.createDoubleFbo(this.width, this.height);
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
    if (!gl || !this.fboA || !this.fboB) return;
    [this.fboA, this.fboB].forEach((fbo) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.totalWater = 0;
    this.activeCells = 0;
  }

  /**
   * Hardware-accelerated brush stamping without CPU readPixels or pipeline bubbles.
   * Uses additive blending directly in the double-buffered FBOs.
   */
  injectInk(
    x: number,
    y: number,
    radius: number,
    waterAmount: number,
    pigmentAmount: number,
    pigmentSlot: 1 | 2 = 1
  ) {
    const gl = this.gl;
    if (!gl || !this.splatProgram || !this.quadVao || !this.fboA) return;

    gl.viewport(0, 0, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboA.framebuffer);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    gl.useProgram(this.splatProgram);
    gl.bindVertexArray(this.quadVao);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const uvX = x / this.width;
    const uvY = 1.0 - y / this.height; // invert Y for standard WebGL coordinate space
    const normRadius = radius / Math.min(this.width, this.height);

    gl.uniform2f(this.splatLocs.point, uvX, uvY);
    gl.uniform1f(this.splatLocs.radius, normRadius);
    gl.uniform2f(this.splatLocs.aspect, this.width / this.height, 1.0);

    // Fluid state: (velX, velY, water, moisture)
    gl.uniform4f(this.splatLocs.fluidSplat, 0.0, 0.0, waterAmount, 0.0);

    // Pigment state: slot 1 (susp1, dep1, 0, 0), slot 2 (0, 0, susp2, dep2)
    if (pigmentSlot === 1) {
      gl.uniform4f(this.splatLocs.pigmentSplat, pigmentAmount, 0.0, 0.0, 0.0);
    } else {
      gl.uniform4f(this.splatLocs.pigmentSplat, 0.0, 0.0, pigmentAmount, 0.0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);

    this.totalWater += waterAmount * 1.5;
    this.activeCells = Math.min(this.width * this.height, this.activeCells + ((radius * radius * 3.14) | 0));
  }

  injectSeal(centerX: number, centerY: number, size: number = 32) {
    this.injectInk(centerX, centerY, size * 0.55, 1.2, 2.0, 1);
  }

  /**
   * Instantly binds suspended wet ink into paper fibers with zero CPU readback stalls.
   */
  forceDry() {
    const gl = this.gl;
    if (!gl || !this.dryProgram || !this.quadVao || !this.fboA || !this.fboB) return;

    gl.viewport(0, 0, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.framebuffer);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    gl.useProgram(this.dryProgram);
    gl.bindVertexArray(this.quadVao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboA.pigmentTex);
    gl.uniform1i(this.dryLocs.pigmentState, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap FBOs so fboA has the dried state
    const tmp = this.fboA;
    this.fboA = this.fboB;
    this.fboB = tmp;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);

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
    if (!gl || !this.quadVao || !this.fboA || !this.fboB || !this.paperTexture) return;

    const t0 = performance.now();
    const texelSizeX = 1.0 / this.width;
    const texelSizeY = 1.0 / this.height;

    gl.viewport(0, 0, this.width, this.height);
    gl.bindVertexArray(this.quadVao);

    // --- PASS 1: Semi-Lagrangian Navier-Stokes Advection ---
    if (this.advectProgram) {
      gl.useProgram(this.advectProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.fluidTex);
      gl.uniform1i(this.advectLocs.fluidState, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.pigmentTex);
      gl.uniform1i(this.advectLocs.pigmentState, 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(this.advectLocs.paperTexture, 2);

      gl.uniform2f(this.advectLocs.texelSize, texelSizeX, texelSizeY);
      gl.uniform1f(this.advectLocs.dt, dt);
      gl.uniform2f(
        this.advectLocs.tiltGravity,
        (this.params.tiltX || 0) * 1.5,
        (this.params.tiltY || 0) * 1.5
      );
      gl.uniform1f(this.advectLocs.roughnessDrag, this.paperConfig.roughness);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Swap FBOs
      const tmp = this.fboA;
      this.fboA = this.fboB;
      this.fboB = tmp;
    }

    // --- PASS 2: Capillary Flow (Darcy's Law & Washburn Percolation) ---
    if (this.capillaryProgram) {
      gl.useProgram(this.capillaryProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.fluidTex);
      gl.uniform1i(this.capillaryLocs.fluidState, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.pigmentTex);
      gl.uniform1i(this.capillaryLocs.pigmentState, 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(this.capillaryLocs.paperTexture, 2);

      gl.uniform2f(this.capillaryLocs.texelSize, texelSizeX, texelSizeY);
      gl.uniform1f(this.capillaryLocs.capillarySpeed, this.params.capillarySpeed * this.pigment1.bleedSpeed);
      gl.uniform1f(this.capillaryLocs.capillaryThreshold, this.params.capillaryThreshold);
      gl.uniform1i(this.capillaryLocs.enableThreshold, this.params.enableCapillaryThreshold ? 1 : 0);
      gl.uniform1f(this.capillaryLocs.dt, dt);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const tmp = this.fboA;
      this.fboA = this.fboB;
      this.fboB = tmp;
    }

    // --- PASS 3: Deegan (1997) Coffee-Ring Evaporation & Granulation ---
    if (this.coffeeRingProgram) {
      gl.useProgram(this.coffeeRingProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.fluidTex);
      gl.uniform1i(this.coffeeLocs.fluidState, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.fboA.pigmentTex);
      gl.uniform1i(this.coffeeLocs.pigmentState, 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
      gl.uniform1i(this.coffeeLocs.paperTexture, 2);

      gl.uniform2f(this.coffeeLocs.texelSize, texelSizeX, texelSizeY);
      gl.uniform1f(this.coffeeLocs.evaporationRate, this.params.evaporationRate * this.paperConfig.evaporationMult);
      gl.uniform1f(this.coffeeLocs.edgeDarkening, this.params.edgeDarkeningStrength * this.pigment1.edgeDarkening);
      gl.uniform1f(this.coffeeLocs.granulationStrength, this.params.granulationStrength * this.pigment1.granulationFactor);
      gl.uniform1f(this.coffeeLocs.dt, dt);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const tmp = this.fboA;
      this.fboA = this.fboB;
      this.fboB = tmp;
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
    if (!gl || !this.renderProgram || !this.quadVao || !this.fboA) return;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(this.renderProgram);
    gl.bindVertexArray(this.quadVao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboA.fluidTex);
    gl.uniform1i(this.renderLocs.fluidState, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fboA.pigmentTex);
    gl.uniform1i(this.renderLocs.pigmentState, 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.paperTexture);
    gl.uniform1i(this.renderLocs.paperTexture, 2);

    gl.uniform2f(this.renderLocs.texelSize, 1.0 / this.width, 1.0 / this.height);

    // Kubelka-Munk Pigment 1 coefficients
    const km1 = this.pigment1.km || { K: [2.5, 2.5, 2.5], S: [0.2, 0.2, 0.2] };
    gl.uniform3f(this.renderLocs.pigment1_K, km1.K[0], km1.K[1], km1.K[2]);
    gl.uniform3f(this.renderLocs.pigment1_S, km1.S[0], km1.S[1], km1.S[2]);

    // Kubelka-Munk Pigment 2 coefficients (default to yellow if null for layering)
    const km2 = this.pigment2?.km || { K: [0.12, 0.35, 4.2], S: [0.85, 0.78, 0.20] };
    gl.uniform3f(this.renderLocs.pigment2_K, km2.K[0], km2.K[1], km2.K[2]);
    gl.uniform3f(this.renderLocs.pigment2_S, km2.S[0], km2.S[1], km2.S[2]);

    gl.uniform1f(this.renderLocs.rakingAngle, rakingAngle);
    gl.uniform1f(this.renderLocs.rakingIntensity, rakingIntensity);

    // Map layer name to integer
    let layerCode = 0;
    if (layer === 'moisture') layerCode = 1;
    else if (layer === 'paper') layerCode = 2;
    else if (layer === 'pigment') layerCode = 3;
    else if (layer === 'vectorField') layerCode = 4;

    gl.uniform1i(this.renderLocs.viewLayer, layerCode);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    if (!gl) return;
    if (this.quadVao) gl.deleteVertexArray(this.quadVao);
    if (this.quadVbo) gl.deleteBuffer(this.quadVbo);
    [
      this.advectProgram,
      this.capillaryProgram,
      this.coffeeRingProgram,
      this.splatProgram,
      this.dryProgram,
      this.renderProgram,
    ].forEach((p) => {
      if (p) gl.deleteProgram(p);
    });
    [this.fboA, this.fboB].forEach((fbo) => {
      if (!fbo) return;
      gl.deleteFramebuffer(fbo.framebuffer);
      gl.deleteTexture(fbo.fluidTex);
      gl.deleteTexture(fbo.pigmentTex);
    });
    if (this.paperTexture) gl.deleteTexture(this.paperTexture);
  }
}

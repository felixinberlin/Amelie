/**
 * WebGPU Compute Pipeline for Kristallwachstum 3D
 *
 * Provides GPU-accelerated execution of:
 * 1. Mark Stock Brownian DLA stochastic nucleation
 * 2. Kobayashi (1993) 3D anisotropic phase-field Allen-Cahn relaxation
 *
 * Seamlessly degrades to the CPU KristallEngine when WebGPU is unavailable.
 */

import { DLA_WGSL, KOBAYASHI_PHASE_FIELD_WGSL } from './shaders.wgsl';
import { SimulationConfig } from './engine';

export interface WebGPUStatus {
  supported: boolean;
  adapterName?: string;
  active: boolean;
  errorMessage?: string;
}

export class WebGPUKristallPipeline {
  private device: any = null;
  private adapter: any = null;
  private gridSize: number = 32;

  // Compute pipelines
  private phaseFieldPipeline: any = null;
  private dlaPipeline: any = null;

  // GPU Buffers
  private paramsBuffer: any = null;
  private phiBufferA: any = null;
  private phiBufferB: any = null;
  private tempBufferA: any = null;
  private tempBufferB: any = null;
  private stagingBuffer: any = null;

  // Bind groups
  private bindGroupAB: any = null;
  private bindGroupBA: any = null;

  private isInitialized: boolean = false;

  public static isWebGPUSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in (navigator as any);
  }

  /**
   * Initializes the WebGPU device, compiles WGSL shaders, and allocates buffers.
   */
  public async initialize(gridSize: number = 32): Promise<boolean> {
    this.gridSize = gridSize;
    if (!WebGPUKristallPipeline.isWebGPUSupported()) {
      return false;
    }

    try {
      const gpu = (navigator as any).gpu;
      this.adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!this.adapter) {
        return false;
      }

      this.device = await this.adapter.requestDevice();
      if (!this.device) {
        return false;
      }

      // Compile WGSL shader modules
      const phaseFieldModule = this.device.createShaderModule({
        label: 'Kobayashi Phase-Field Module',
        code: KOBAYASHI_PHASE_FIELD_WGSL,
      });

      const dlaModule = this.device.createShaderModule({
        label: 'DLA Nucleation Module',
        code: DLA_WGSL,
      });

      this.phaseFieldPipeline = this.device.createComputePipeline({
        label: 'Kobayashi Phase-Field Compute Pipeline',
        layout: 'auto',
        compute: {
          module: phaseFieldModule,
          entryPoint: 'stepKobayashi',
        },
      });

      this.dlaPipeline = this.device.createComputePipeline({
        label: 'DLA Compute Pipeline',
        layout: 'auto',
        compute: {
          module: dlaModule,
          entryPoint: 'simulateDLA',
        },
      });

      // Allocate 3D grid buffers: float32 per cell
      const totalCells = gridSize * gridSize * gridSize;
      const bufferSizeBytes = totalCells * 4;

      const GPUBufferUsage = (window as any).GPUBufferUsage || {
        STORAGE: 0x0080,
        UNIFORM: 0x0040,
        COPY_SRC: 0x0004,
        COPY_DST: 0x0008,
        MAP_READ: 0x0001,
      };

      this.paramsBuffer = this.device.createBuffer({
        label: 'Phase Field Params Uniform Buffer',
        size: 64, // 9 fields padded to 16 bytes
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      this.phiBufferA = this.device.createBuffer({
        label: 'Phi Grid A',
        size: bufferSizeBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      });

      this.phiBufferB = this.device.createBuffer({
        label: 'Phi Grid B',
        size: bufferSizeBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      });

      this.tempBufferA = this.device.createBuffer({
        label: 'Temp Grid A',
        size: bufferSizeBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });

      this.tempBufferB = this.device.createBuffer({
        label: 'Temp Grid B',
        size: bufferSizeBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });

      this.stagingBuffer = this.device.createBuffer({
        label: 'Staging Readback Buffer',
        size: bufferSizeBytes,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      });

      // Create Bind Groups for ping-pong iteration
      const layout = this.phaseFieldPipeline.getBindGroupLayout(0);

      this.bindGroupAB = this.device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: this.paramsBuffer } },
          { binding: 1, resource: { buffer: this.phiBufferA } },
          { binding: 2, resource: { buffer: this.phiBufferB } },
          { binding: 3, resource: { buffer: this.tempBufferA } },
          { binding: 4, resource: { buffer: this.tempBufferB } },
        ],
      });

      this.bindGroupBA = this.device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: this.paramsBuffer } },
          { binding: 1, resource: { buffer: this.phiBufferB } },
          { binding: 2, resource: { buffer: this.phiBufferA } },
          { binding: 3, resource: { buffer: this.tempBufferB } },
          { binding: 4, resource: { buffer: this.tempBufferA } },
        ],
      });

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('WebGPU initialization failed, falling back to CPU Voxel Engine:', err);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Upload initial CPU phi & temperature grids to GPU storage buffers.
   */
  public uploadInitialState(phiGrid: Float32Array, undercooling: number): void {
    if (!this.isInitialized || !this.device) return;

    this.device.queue.writeBuffer(this.phiBufferA, 0, phiGrid);
    this.device.queue.writeBuffer(this.phiBufferB, 0, phiGrid);

    const totalCells = this.gridSize * this.gridSize * this.gridSize;
    const tempGrid = new Float32Array(totalCells).fill(undercooling);
    this.device.queue.writeBuffer(this.tempBufferA, 0, tempGrid);
    this.device.queue.writeBuffer(this.tempBufferB, 0, tempGrid);
  }

  /**
   * Dispatches N iterations of the Kobayashi phase-field compute pass on the GPU.
   */
  public dispatchPhaseField(iterations: number, config: SimulationConfig): void {
    if (!this.isInitialized || !this.device) return;

    // Pack uniform parameters (16-byte aligned)
    // struct PhaseFieldParams {
    //   gridSize: u32, dt: f32, dx: f32, tau: f32,
    //   epsilonBar: f32, delta: f32, anisotropyMode: u32, undercooling: f32,
    //   latentHeat: f32, [padding: 3 x f32]
    // };
    const paramsArray = new ArrayBuffer(48);
    const u32View = new Uint32Array(paramsArray);
    const f32View = new Float32Array(paramsArray);

    u32View[0] = this.gridSize;
    f32View[1] = 0.008; // dt
    f32View[2] = 0.03; // dx
    f32View[3] = 0.0003; // tau

    f32View[4] = 0.01; // epsilonBar
    f32View[5] = config.anisotropy; // delta
    u32View[6] = config.symmetry === 'cubic' ? 4 : 6; // anisotropyMode
    f32View[7] = config.undercooling;

    f32View[8] = 0.15; // latentHeat

    this.device.queue.writeBuffer(this.paramsBuffer, 0, paramsArray);

    const commandEncoder = this.device.createCommandEncoder({
      label: 'Kobayashi Compute Command Encoder',
    });

    const workgroups = Math.ceil(this.gridSize / 4);

    for (let iter = 0; iter < iterations; iter++) {
      const passEncoder = commandEncoder.beginComputePass({
        label: `Kobayashi Phase-Field Pass ${iter + 1}`,
      });
      passEncoder.setPipeline(this.phaseFieldPipeline);
      passEncoder.setBindGroup(0, iter % 2 === 0 ? this.bindGroupAB : this.bindGroupBA);
      passEncoder.dispatchWorkgroups(workgroups, workgroups, workgroups);
      passEncoder.end();
    }

    this.device.queue.submit([commandEncoder.finish()]);
  }

  /**
   * Reads back the relaxed 3D phase-field from GPU to CPU memory.
   */
  public async readbackPhi(): Promise<Float32Array | null> {
    if (!this.isInitialized || !this.device) return null;

    try {
      const commandEncoder = this.device.createCommandEncoder();
      const bufferSizeBytes = this.gridSize * this.gridSize * this.gridSize * 4;

      commandEncoder.copyBufferToBuffer(this.phiBufferA, 0, this.stagingBuffer, 0, bufferSizeBytes);
      this.device.queue.submit([commandEncoder.finish()]);

      await this.stagingBuffer.mapAsync(1); // GPUMapMode.READ = 1
      const copyArrayBuffer = this.stagingBuffer.getMappedRange();
      const result = new Float32Array(copyArrayBuffer.slice(0));
      this.stagingBuffer.unmap();
      return result;
    } catch {
      return null;
    }
  }

  public getStatus(): WebGPUStatus {
    return {
      supported: WebGPUKristallPipeline.isWebGPUSupported(),
      active: this.isInitialized,
      adapterName: this.adapter?.name || 'Default WebGPU Hardware Adapter',
    };
  }

  public dispose(): void {
    this.isInitialized = false;
    this.phiBufferA?.destroy();
    this.phiBufferB?.destroy();
    this.tempBufferA?.destroy();
    this.tempBufferB?.destroy();
    this.stagingBuffer?.destroy();
    this.paramsBuffer?.destroy();
    this.device = null;
  }
}

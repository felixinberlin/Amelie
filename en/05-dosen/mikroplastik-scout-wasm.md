# Microplastic-Scout WASM

## 1. Problem Statement
Microplastic pollution is one of the most pressing environmental issues of our time. These tiny particles permeate all ecosystems, posing a serious threat to biodiversity and human health. However, the detection and quantification of microplastics, especially in water and sediment samples, is labor-intensive, requires expensive specialized equipment, and trained personnel. This often leads to fragmented data collection, making it difficult for citizen scientists or smaller research groups to contribute effectively. The lack of accessible, rapid, and affordable analytical methods significantly slows down research and the development of protective measures.

## 2. The Amélie Solution: Microplastic-Scout WASM
The “Microplastic-Scout WASM” is a browser-based open-source tool that leverages Artificial Intelligence (AI) and WebAssembly (WASM) to democratize the identification and quantification of microplastics in microscopy images. Users can upload images of water or sediment samples taken under a microscope. An AI model (e.g., a pre-trained ONNX model) running directly in the browser analyzes the image, detects potential microplastic particles, and classifies them by type (e.g., fiber, fragment, pellet) and size. The tool provides a preliminary count, visual marking of detected particles, and a confidence score.

By executing the AI model directly in the browser using WebAssembly, privacy and speed are maximized, as no data needs to be uploaded to external servers. This enables universities, NGOs, and municipalities to launch cost-effective and accessible citizen science programs for microplastic monitoring, collecting valuable data that would otherwise remain undiscovered.

## 3. Technical Overview
*   **Frontend**: Modern web technologies (React/Vue/Svelte) providing an intuitive user interface for upload, display, and interaction.
*   **AI Model**: A pre-trained object detection model (e.g., YOLO, EfficientDet) trained on a dataset of microplastic images. The model is converted to a browser-optimized format (e.g., ONNX).
*   **Inference in Browser**: Utilizing ONNX Runtime Web or TensorFlow.js to efficiently run the AI model in WebAssembly within the browser. This allows for fast, on-device analysis.
*   **Image Processing**: Client-side pre-processing of uploaded images (scaling, normalization) and post-processing of AI results (drawing bounding boxes, displaying classification labels).
*   **Data Export**: Capability to export analysis results (count, type, coordinates) in standardized formats (CSV, GeoJSON) for use in further research or monitoring projects.
*   **Geolocation (optional)**: If permitted by the user, the sample's location can be captured and linked to the analysis results.

## 4. Civic Impact
The Microplastic-Scout WASM has the potential to significantly strengthen environmental citizen science. It lowers the barrier to entry for participation in microplastic research, enabling a broader public to actively engage in data collection. This leads to:
*   **More Comprehensive Data**: Collection of more geographically distributed data points on microplastic occurrences.
*   **Increased Awareness**: Direct involvement fosters understanding of the problem and the necessity of protective measures.
*   **Education**: The tool can be used as a teaching aid in schools and universities to provide students with practical experience in environmental analysis and AI.
*   **Local Agency**: Communities and NGOs can take more targeted actions based on local data they have generated themselves.
*   **Data Privacy**: Client-side processing ensures that sensitive data is not uploaded uncontrolled.

## 5. Target Institution
The **TU Berlin Open Science Lab** is an ideal target institution. It has a strong focus on open science, the development of open-source tools, and the promotion of citizen science. Its expertise in data science, machine learning, and web technologies perfectly aligns with the technical implementation of the Microplastic-Scout WASM. A collaboration could drive model development, validation of results by scientific partners, and broad adoption of the tool within the research and citizen science communities.

## 6. TypeScript Entry: `src/microplastic-detector.ts`
This is the core TypeScript module that wraps the WebAssembly inference logic.

```typescript
// src/microplastic-detector.ts
import { loadWasmModel, LABEL_MAP, WasmDetectionResult } from './wasm-inference-module';

export interface DetectionResult {
  bbox: [number, number, number, number];
  label: string;
  score: number;
}

export class MicroplasticDetector {
  private wasmExports: any | null = null;
  private isLoaded: boolean = false;
  private memory: WebAssembly.Memory | null = null;

  constructor() {
    // Constructor could initialize some things, but model loading is async
  }

  public async loadModel(modelPath: string): Promise<void> {
    try {
      const wasmModule = await loadWasmModel(modelPath);
      this.wasmExports = wasmModule.instance.exports;
      this.memory = this.wasmExports.memory;
      // Assume an `init` function in WASM that takes a model buffer
      // For this example, we'll skip passing the model buffer itself to the mock WASM,
      // as the mock `loadWasmModel` already implies the model is ready.
      // await this.wasmExports.init(modelBufferPtr, modelBufferSize);
      this.isLoaded = true;
      console.log("MicroplasticDetector: Model loaded successfully.");
    } catch (error) {
      console.error("Failed to load WASM model:", error);
      this.isLoaded = false;
      throw error;
    }
  }

  public isModelLoaded(): boolean {
    return this.isLoaded;
  }

  public async detect(imageData: ImageData): Promise<DetectionResult[]> {
    if (!this.isLoaded || !this.wasmExports || !this.memory) {
      throw new Error("Model not loaded. Call loadModel() first.");
    }

    const { data, width, height } = imageData;
    const inputBufferSize = data.length; // RGBA byte array
    const inputPtr = this.wasmExports.allocate(inputBufferSize);

    // Copy image data to WASM memory
    const uint8Memory = new Uint8Array(this.memory.buffer);
    uint8Memory.set(data, inputPtr);

    // Call WASM detection function
    const numDetections = this.wasmExports.detect(inputPtr, width, height);

    const results: DetectionResult[] = [];
    for (let i = 0; i < numDetections; i++) {
      const wasmResult: WasmDetectionResult = this.wasmExports.getDetectionResult(i);
      if (wasmResult) {
        results.push({
          bbox: wasmResult.bbox,
          label: LABEL_MAP[wasmResult.labelId] || 'unknown',
          score: wasmResult.score,
        });
      }
    }

    // Deallocate memory
    this.wasmExports.deallocate(inputPtr);

    return results;
  }
}

// src/wasm-inference-module.ts (Mocked for context)
// This file would normally contain the actual WebAssembly glue code and model loading.
// For testing, we mock its behavior.

export const LABEL_MAP = ['Fiber', 'Fragment', 'Pellet', 'Film']; // Example labels

export async function loadWasmModel(modelPath: string) {
  // In a real scenario, this would fetch and instantiate the WASM module
  // and load the ONNX model into it.
  console.log(`Loading WASM model from: ${modelPath}`);
  return {
    instance: {
      exports: {
        init: (modelBufferPtr: number, modelBufferSize: number) => { /* ... */ },
        detect: (inputPtr: number, width: number, height: number) => { /* ... */ return 0; },
        getDetectionResult: (index: number) => ({ bbox: [0,0,0,0], labelId: 0, score: 0 }),
        allocate: (size: number) => 0,
        deallocate: (ptr: number) => {},
        memory: new WebAssembly.Memory({ initial: 256 })
      }
    }
  };
}

// Interface for a detection result from WASM
export interface WasmDetectionResult {
  bbox: [number, number, number, number]; // [x, y, width, height]
  labelId: number;
  score: number;
}
```

## 7. Search Protocol Entry

```json
{
  "searchProtocol": {
    "engine": "github-ai-recon",
    "keywords": "webassembly ai image classification microplastic, onnx wasm object detection, citizen science environmental ai, browser ml environment, real-time pollution monitoring ai",
    "findings": [
      {
        "source": "trending-ai-repos",
        "description": "Observed a rise in client-side AI inference via WebAssembly (WASM) and WebGPU, often using frameworks like ONNX Runtime Web or TensorFlow.js for vision tasks. This allows for privacy-preserving, offline-capable AI applications directly in the browser.",
        "relevance": "Directly supports the technical feasibility of a browser-based microplastic detection tool."
      },
      {
        "source": "vibe-coding/side-project-sweeper",
        "description": "Noted several projects exploring 'AI for good' in environmental contexts, including wildlife monitoring, plant disease detection, and waste sorting. Many of these projects highlight the need for accessible tools for non-expert users.",
        "relevance": "Confirms the 'civic' aspect and demand for user-friendly environmental AI, aligning with the citizen science focus."
      },
      {
        "source": "prior-art-check (06-suche)",
        "description": "Reviewed `invasives-scout-wasm` and `geospatial-landcover-gradio`. While these use WASM/AI for environmental vision, their domain (plant identification, broad land cover) is distinct from granular microplastic analysis, confirming no direct collision.",
        "relevance": "Validated the novelty of the specific microplastic detection application."
      }
    ],
    "conclusion": "The combination of advanced browser ML capabilities (WASM) and a pressing environmental issue (microplastics) presents a strong opportunity for a novel, impactful, and technically feasible Amélie tool. The 'citizen science' angle addresses a key gap in data collection."
  }
}
```
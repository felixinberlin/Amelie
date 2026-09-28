# Wellenrausch: Web-based Wave Simulation with WebAssembly & WebGL

## 1. Initial Situation & Problem Statement
Teaching and research in physics, especially concerning wave phenomena such as diffraction, interference, acoustics, or quantum mechanics, often relies on static diagrams in textbooks or expensive proprietary simulation software. This limits interactive access for students and researchers and complicates the reproducibility and sharing of simulation results. An open, performant, and accessible platform for visualizing and analyzing complex wave phenomena is lacking in the open-source domain.

## 2. The Amélie Solution: Wellenrausch
"Wellenrausch" (German for "Wave Rush" or "Wave Roar") is a web-based tool enabling the simulation and visualization of complex wave phenomena. By leveraging WebAssembly (Wasm) for computationally intensive physical algorithms and WebGL for performant 3D visualization, Wellenrausch offers an interactive and powerful environment directly in the browser. It allows for the definition of wave sources, medium parameters, and observation fields to display dynamic effects such as superposition, refraction, and diffraction in real-time.

## 3. Target Groups & Use Cases
*   **Universities and Colleges:** As a teaching aid for physics and engineering courses to illustrate abstract concepts. Students can vary parameters and directly observe the effects.
*   **Research Institutes:** For rapid prototyping and visualization of research results in acoustics, optics, materials science, or quantum physics.
*   **Open Science Labs:** To promote open research and the exchange of simulation models and results.
*   **Public Educational Institutions:** For interactive exhibits and educational programs that make complex physical concepts accessible to a broader audience.

## 4. Technical Approach
*   **Frontend:** TypeScript, React (or similar framework) for the user interface.
*   **Physics Engine:** Implementation of wave equation solvers (e.g., FDTD, FEM) in C/C++ and compilation to WebAssembly for maximum performance.
*   **Visualization:** WebGL/WebGPU for efficient and interactive rendering of 2D and 3D wave fields, isolines, vector fields, and spectra.
*   **Data Management:** Storage and loading of simulation configurations in the browser (IndexedDB) or as JSON files.

## 5. Added Value & Sustainability
Wellenrausch promotes open science by providing a powerful tool under a CC0 license. It lowers the barrier to entry for wave simulation and enables broader adoption in teaching and research. Web technologies ensure wide compatibility and easy distribution. The modular architecture allows for future extensions to other physical domains.

## 6. Risks & Challenges
The main requirements lie in the precise implementation of physical models and the optimization of WebAssembly and WebGL pipelines to smoothly display even demanding simulations. Developing an intuitive user interface for complex parameters is also crucial.

## 7. References & Similar Projects
*   [Online Wave Calculator (proprietary)](https://www.falstad.com/ripple/)
*   [WebAssembly Demos for Scientific Applications](https://webassembly.org/docs/use-cases/)
*   [WebGL Libraries for 3D Visualization](https://threejs.org/)
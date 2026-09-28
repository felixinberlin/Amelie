# Amélie Shade & Breeze: Hyper-Local Urban Microclimate Playground

## Project Idea
The "Amélie Shade & Breeze" project proposes an interactive, browser-based tool that enables citizens and urban planners to visualize the hyper-local impacts of small urban changes (e.g., tree planting, facade greening, building modifications) on microclimate (shade, wind flow, local temperature) in real-time. By simply drawing elements on a map (based on OpenStreetMap or Berlin geodata), users can instantly see simulated effects, supported by client-side AI models (WASM/WebGPU) for fast, visually appealing feedback.

## Civic Relevance & Benefit
Current microclimate simulation tools are often complex, expensive, and not accessible to the general public. This hinders citizen participation in urban planning processes, especially on topics like heat protection and climate change adaptation. "Amélie Shade & Breeze" would offer a playful and intuitive way to understand and evaluate the effects of green infrastructure and structural measures, leading to more informed discussions and better decisions. It promotes awareness of the importance of microclimate in the city and strengthens participation.

## Technological Direction
The tool would leverage modern web technologies such as WebAssembly (WASM) and WebGPU to execute complex simulations directly in the user's browser. This ensures high performance, low latency, and privacy protection, as no data needs to be sent to external servers. Visualization would occur on an interactive 2D/3D map, with engaging visual overlays for shade, temperature, and wind. Development would focus on a modular, open-source framework that allows for future extensions and adaptations.
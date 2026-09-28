# Dossier: Luminance Sentinel: Browser-Native Light Pollution Mapper

**Problem:** Light pollution detrimentally affects ecosystems, human health, and astronomical observation. Environmental offices face challenges in gathering objective data on light intensity and effectively enforcing existing regulations. Traditional methods are often costly (specialized sensors), complex (satellite data analysis), or subjective (citizen complaints).

**Friction & Gap:** There is a lack of an accessible, citizen-friendly, and technologically advanced tool that democratizes the measurement and analysis of light emissions. The asymmetric inversion here is that instead of waiting for expensive infrastructure, a browser-native AI tool puts initial data collection and analysis into everyone's hands.

**Proposal:** A browser-native application leveraging WebGPU and/or WASM to analyze live camera feeds or uploaded images/videos (e.g., from smartphones). The tool would:
*   **Create Luminance Maps:** Real-time visualization of light intensity within a scene.
*   **Identify Light Sources:** AI-powered detection of streetlights, facade lighting, etc.
*   **Spectral Analysis (optional):** Estimation of color temperatures and their impacts.
*   **Check Regulatory Compliance:** Simple indicators if thresholds are exceeded or light spills into unwanted areas (skyglow, light trespass).

**Civic Impact:** Enables environmental offices to quickly identify light pollution hotspots, verify the effectiveness of mitigation measures, and raise public awareness. Citizens can actively contribute to data collection and develop a better understanding of their surroundings.
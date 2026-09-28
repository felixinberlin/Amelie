# Dossier: Policy Impact Sandbox (Browser-Native Urban Dynamics)

## Problem: The Invisible Consequences of Urban Planning Decisions
Urban planning is a complex field where decisions have far-reaching and often hard-to-predict effects on urban life, the environment, and social structures. Citizens, NGOs, and even junior professionals often struggle to grasp the multifaceted, spatial consequences of development plans, traffic concepts, or climate adaptation strategies. Existing tools are frequently proprietary, expensive, require specialized software, or provide only static representations that don't allow dynamic exploration of 'what-if' scenarios. This creates a knowledge and participation gap (Friction & Enforcement Gaps in the knowledge domain).

## Amélie's Asymmetric Inversion: From Reading to Experiencing
Instead of interpreting texts and diagrams, Amélie proposes an **interactive, browser-native simulation environment** that allows users to 'play' directly with policy parameters on real geographic data. The project aims to invert knowledge acquisition: from passive consumption to active, playful exploration of urban dynamics. By leveraging WASM/WebGPU for local, high-performance simulations and rendering directly in the browser, high accessibility and data privacy are ensured.

## The Policy Impact Sandbox

### Core Idea:
A playful, visual sandbox application that enables users to adjust parameters of urban development and environmental policies (e.g., building density, green space proportion, traffic calming measures, rainwater infiltration) on an interactive map of Berlin. The application then simulates and visualizes in real-time the potential impacts on various indicators such as noise pollution, microclimate, biodiversity, traffic flow, or social infrastructure.

### Technological Basis:
*   **Browser-Native Execution:** Entirely within the browser, without a backend server, utilizing WebAssembly (WASM) for high-performance simulation models and WebGPU for efficient rendering of complex 3D geodata and visualizations.
*   **Micro-Agent Approach:** Simple, modular simulation models that calculate, for example, the spread of urban heat islands, rainwater infiltration, or pedestrian/cyclist movement based on rules and geographic data.
*   **Open Data:** Utilization of Berlin's Geoportal (e.g., city base map, tree cadastre, soil sealing data, development plans) as the foundation for simulations.
*   **VibeCoding & Delightful UX:** Focus on an intuitive, responsive user interface with playful elements that make complex relationships understandable and experiential.

### Application Examples:
1.  **Green Space Policy:** What happens if a block is 50% greened instead of 30%? How does the temperature change in summer? What are the effects on biodiversity?
2.  **Traffic Planning:** How does converting a street into a bicycle street affect the traffic flow of surrounding streets and the accessibility of businesses?
3.  **Rainwater Management:** Where does water flow during heavy rainfall if a specific area is unsealed or a retention basin is built?

## Institutional Anchor: Berlin Senate Department for Urban Development, Environment and Climate Protection
The Senate Department is the ideal partner, as it is the primary custodian and shaper of urban development policies. Such a sandbox could serve as an internal tool for faster impact assessment and, more importantly, as a **communication and participation instrument** for citizens and stakeholders in planning processes. It promotes transparency and understanding of complex decisions.

## Vision
The Policy Impact Sandbox will become a playful tool that bridges the gap between complex expert planning and civic understanding. It empowers everyone to actively co-think the city of the future and explore the impacts of decisions themselves, fostering a more informed and engaged urban society. It is a living, digital model of the city that invites experimentation and conveys knowledge in a new, transformative way.
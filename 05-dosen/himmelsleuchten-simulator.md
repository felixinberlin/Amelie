# Amélie Idea: Skyglow Simulator

## Context & Problem Statement
Increasing light pollution in cities is a serious problem with negative impacts on the environment, human health, and astronomical research. Urban planners face the challenge of developing new lighting concepts that ensure safety while minimizing light emissions. Existing planning tools often lack sufficiently precise or interactive simulations of light propagation and the resulting skyglow. This leads to suboptimal decisions and an unnecessary increase in light pollution.

## Project Idea: Interactive Skyglow Simulator
The "Skyglow Simulator" is a browser-based, open-source tool built on WebGPU technology to enable physically accurate, real-time simulations of light propagation in urban environments. Users can place various lighting scenarios (e.g., new streetlights, facade lighting) within a 3D city model and immediately visualize their impact on skyglow, light spill into adjacent areas, and surface brightness.

## Core Features
*   **WebGPU-based Real-time Simulation**: Fast, physically accurate light simulation directly in the browser.
*   **Interactive 3D City Model**: Import of geospatial data (e.g., 3D building models, terrain data) for realistic representation.
*   **Parametrizable Light Sources**: Definition of luminaire types, beam characteristics, light color, and intensity.
*   **Skyglow & Light Spill Visualization**: Direct display of light emissions into the night sky and unwanted areas.
*   **"What-if" Scenarios**: Easy experimentation with different lighting options and their effects.
*   **Open-Source & CC0**: Transparency and free use for all public institutions.

## Benefits for the Target Institution (Berlin Senate Department for Environment, Mobility, Consumer and Climate Protection)
*   **Data-Driven Decisions**: Improved basis for approving and planning lighting concepts.
*   **Environmental Protection**: Active contribution to reducing light pollution and protecting biodiversity (insects, birds).
*   **Citizen Participation**: The tool can be used to clearly communicate the effects of lighting plans to citizens.
*   **Resource Efficiency**: Optimization of lighting saves energy and operating costs.

## Technical Aspects
The project leverages modern web technologies like WebGPU for the rendering engine and could build upon open geospatial data (e.g., from OpenStreetMap or Berlin Geoportal). The micro-scaffolding nature of Amélie would allow starting with a core simulator for a specific district and iteratively adding features.
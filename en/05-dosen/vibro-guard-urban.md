# VibroGuard: Urban Vibration Monitoring Network

## Problem Statement: Asymmetry and Friction in Urban Vibrations

Urban areas are constantly exposed to vibrations caused by construction work, heavy traffic, subways, and industrial activities. These vibrations can have significant impacts on residents' quality of life, ranging from sleep disturbances and stress to perceived (and sometimes real) damage to buildings. Although Germany has standards like DIN 4150-3, which define limit values for vibration effects on buildings, monitoring compliance with these limits is often non-transparent and reactive. Project developers and municipal authorities may have their own measurement data, but this is rarely made accessible to the public. This leads to a significant information asymmetry: residents feel the effects but lack objective, verifiable data to substantiate their complaints or demand compliance with regulations. This friction weakens civic participation and the effective enforcement of environmental and building standards.

## The Amélie Solution: VibroGuard – Citizen Science for Vibration Data

VibroGuard is a decentralized, open-source vibration monitoring network designed to invert this information asymmetry. It enables universities, citizen initiatives, and NGOs to install low-cost sensor nodes in affected areas to collect and visualize vibration data in real-time. By providing accessible and verifiable data, VibroGuard empowers citizens to engage in informed discussions with authorities and developers and to demand compliance with regulations.

### How it Works:
1.  **Low-Cost Sensor Nodes:** Based on open-source hardware (e.g., ESP32 or Raspberry Pi Zero) and MEMS accelerometers (e.g., ADXL345, LIS3DH) capable of capturing vibrations in three axes.
2.  **Data Transmission:** Sensor nodes transmit collected raw data (e.g., acceleration values) via wireless networks (Wi-Fi, LoRaWAN) to a central platform.
3.  **Data Processing and Storage:** An open-source backend infrastructure (e.g., MQTT for messaging, PostgreSQL/TimescaleDB for data, Python/Node.js for processing) receives, stores, and processes raw data into meaningful metrics (e.g., RMS vibration velocity, frequency analysis).
4.  **Visualization and Analysis:** A user-friendly web interface (e.g., based on Grafana or a custom Vue.js/React application) visualizes vibration data in real-time and historically. It allows comparison with relevant standards (e.g., DIN 4150-3 limits for different building types and frequencies).
5.  **Notification Function:** Automatic alerts can be triggered when defined vibration thresholds are exceeded.

## Physical Principles and Relevance

VibroGuard is based on the physical principles of vibration theory and mechanics. The measurement of acceleration, velocity, and displacement of vibrations is crucial. In particular, the root mean square (RMS) velocity of vibration is an important quantity for assessing vibration effects on structures according to DIN 4150-3. The tool enables the capture of these physical quantities and their contextualization with regard to normative limit values.

## Target Groups and Use Cases

*   **Citizen Initiatives and Residents:** For documenting vibration impacts and as an advocacy tool against authorities and developers.
*   **Urban Planning and Environmental Offices:** As a supplementary monitoring tool to verify compliance with regulations and for data-driven decision-making.
*   **Universities and Research Institutions:** For studies on urban vibration sources, their propagation, and effects on infrastructure and humans.
*   **NGOs in Heritage Preservation:** For monitoring vibrations near historical buildings.

## Impact and Value Creation

VibroGuard creates transparency and balances the information asymmetry. It enables more proactive and data-driven civic participation, improves the enforcement of environmental standards, and promotes more responsible urban development. The open-source nature of the hardware and software ensures trustworthiness and reproducibility of measurements, which is crucial for civil society acceptance.

## Technological Foundation

The project would build upon established open-source technologies, ensuring high maintainability and extensibility. The hardware is readily accessible and cost-effective. The software architecture is modular to allow for adaptation to specific needs.
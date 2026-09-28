# Amphibian-Detector: Acoustic Species Identification for Citizen Science

## Problem Statement
The global decline of amphibian populations is an alarming indicator of environmental degradation. Amphibians are sensitive bioindicators for the health of ecosystems. However, traditional monitoring methods, such as manual counts or visual surveys, are extremely time-consuming, labor-intensive, and often only feasible for short periods or in limited areas. This leads to significant data gaps, making precise assessment of population trends and the effectiveness of conservation measures difficult. Especially for citizen science projects, which rely on volunteer work, the requirements for expertise and time pose considerable hurdles.

## The Amélie Solution: 'Amphibian-Detector'
The 'Amphibian-Detector' is an open-source, low-cost hardware and software system specifically developed for passive acoustic monitoring of amphibian species within the framework of citizen science. The project enables universities, municipalities, and NGOs to set up a network of automatic 'listening posts' with a low budget.

### How it works:
1.  **DIY Hardware:** Based on common microcontrollers (e.g., ESP32, Raspberry Pi Pico W) and a simple microphone, a robust, weatherproof sensor is built. The assembly instructions are easy to understand and designed for educational purposes.
2.  **Local AI Recognition (TinyML):** An optimized machine learning model (TinyML) runs on the microcontroller, recognizing the characteristic calls of specific amphibian species (e.g., common frog, common toad, European tree frog) in real time. Recognition occurs directly on the device, minimizing power consumption and reducing privacy concerns.
3.  **Data Transmission:** Upon a positive detection, metadata (timestamp, identified species, confidence score, device ID, and GPS location) are sent via an energy-efficient connection (e.g., LoRaWAN or Wi-Fi) to a central database or a local collection point. Optionally, a short audio segment can be stored for verification.
4.  **Web Dashboard:** A simple web interface visualizes the collected data on a map, allowing citizen scientists to review the results and add further observations.

## Technological Basis
*   **Hardware:** ESP32 / Raspberry Pi Pico W, MEMS microphone, power management, weatherproof enclosure (3D-printable).
*   **Firmware:** MicroPython / C++ (Arduino framework) with TensorFlow Lite for Microcontrollers (TinyML).
*   **ML Model:** Convolutional Neural Networks (CNN) trained on publicly available amphibian call datasets.
*   **Data Transmission:** LoRaWAN (for rural areas) or Wi-Fi (for urban/semi-urban areas).
*   **Backend/Frontend:** Python (FastAPI/Django) / JavaScript (React/Vue) for the dashboard.

## Use Cases & Benefits
*   **Citizen Science:** Schools, environmental groups, and engaged citizens can actively participate in monitoring, building and operating their own devices.
*   **Conservation Authorities:** Receive continuous and comprehensive data on amphibian population trends and distribution. This enables targeted planning of conservation measures.
*   **Education:** Building and programming the Amphibian-Detector provides a practical introduction to electronics, programming, and environmental protection.
*   **Early Detection:** Localization of hotspots and detection of population trends to respond quickly to changes.

 The 'Amphibian-Detector' transforms passive acoustic monitoring into an accessible, community-driven tool that provides crucial data for amphibian conservation and promotes environmental awareness.
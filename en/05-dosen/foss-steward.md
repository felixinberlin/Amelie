# FOSS Steward: Open-Source Project Sustainability Auditor

## Problem Statement
Public institutions such as universities, NGOs, and municipalities are increasingly relying on Open-Source Software (FOSS) for their digital infrastructures and services. While the benefits of FOSS (transparency, cost savings, flexibility) are widely recognized, there is often a lack of systematic methods for assessing long-term sustainability, security, and overall project health. Inadequate evaluation can lead to unexpected maintenance costs, security vulnerabilities due to outdated dependencies, or even implementation failure if projects are suddenly no longer maintained.

## The Amélie Solution: FOSS Steward
"FOSS Steward" is a CC0 tool designed to help public institutions objectively evaluate the health and sustainability of open-source projects. By analyzing Git repositories and associated metadata, FOSS Steward provides a data-driven foundation for decision-making in the selection and deployment of FOSS.

### Core Features
1.  **Activity and Recency Analysis:** Assessment of commit frequency, release cycles, and response times to issues/pull requests.
2.  **Community and Bus Factor Analysis:** Identification of the number of active contributors, diversity of committers, and potential "bus factor" risks (dependency on a few key individuals).
3.  **Dependency Audit:** Examination of dependencies for known security vulnerabilities (CVEs), obsolescence, and license compatibility.
4.  **License Compliance Check:** Automated verification of the project's license and the licenses of its dependencies for compatibility and adherence.
5.  **Documentation and Test Coverage Indicators:** Estimation of documentation quality and the presence of test suites.
6.  **Summary Reports:** Generation of easy-to-understand reports and dashboards that provide decision-makers with a quick overview of project health.

### Technological Basis
FOSS Steward leverages a combination of Git client libraries, package manager APIs (npm, pip, Maven, etc.), static code analysis, and potentially machine learning for pattern recognition in project activities. Results are provided via a simple web interface or as an API for integration into existing IT management systems.

### Institutional Benefits
*   **Risk Mitigation:** Reduces the risk of investing in poorly maintained or insecure FOSS projects.
*   **Informed Decisions:** Enables data-driven selection of FOSS that meets the institution's long-term requirements.
*   **Resource Efficiency:** Avoids unnecessary maintenance costs and security audits by early detection of issues.
*   **Promotion of Sustainable FOSS Use:** Raises awareness about the importance of project health and community.

FOSS Steward empowers public institutions to utilize the potential of open-source software responsibly and sustainably.

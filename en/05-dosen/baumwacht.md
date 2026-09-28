# ArborGuard: Satellite-Based Monitoring of Tree Protection Ordinances

## Problem Statement
Urban tree protection ordinances are essential for preserving green infrastructure in our cities. They safeguard trees from unauthorized felling, damage, or clearing. However, enforcing these ordinances is a monumental task for municipalities and environmental agencies. Staff resources are often limited, and illegal tree felling or construction activities that harm trees frequently go unnoticed or are reported too late, when the damage is already irreversible. This creates an asymmetric situation: ordinance enforcement is sluggish and reactive, while violations often occur proactively and undetected.

## The Amélie Solution: ArborGuard
ArborGuard is an open-source tool designed to invert this asymmetry. It leverages publicly available satellite data (e.g., Sentinel-2, Landsat, or commercial providers with appropriate non-profit licenses) to detect changes in tree canopy density over time. These detected changes are then cross-referenced with geospatial data of protected tree locations and the specific tree protection ordinances of a municipality.

### How it Works:
1.  **Satellite Data Analysis**: Regular retrieval and processing of satellite imagery for defined monitoring areas.
2.  **Change Detection**: Application of machine learning algorithms to identify significant changes in tree canopies (e.g., loss due to felling, damage, or new planting).
3.  **Ordinance Overlay**: Superimposing the detected changes with digitized tree registers and zones covered by tree protection ordinances.
4.  **Prioritization and Alerting**: Potential violations are prioritized based on the tree's protection status and the extent of the change, then visualized on an interactive map. Critical changes can trigger automatic notifications.
5.  **Citizen Participation & Verification**: A web platform allows citizens to verify potential violations (e.g., through on-site visits and photos) and submit structured reports directly to the responsible environmental agencies. This could also include an option to upload felling permits to prevent false reports.
6.  **Evidence Collection**: Automatic provision of before-and-after imagery and geospatial data as a basis for official investigations and potential sanctions.

## Civic Impact
*   **Effective Environmental Protection**: Proactive detection protects tree populations, thereby preserving urban biodiversity, microclimates, and air quality.
*   **Transparency & Accountability**: Increases transparency in the enforcement of tree protection ordinances and enhances accountability for violations.
*   **Citizen Engagement**: Empowers citizens to actively participate in protecting their local environment, acting as the 'eyes and ears' of the city.
*   **Resource Efficiency for Municipalities**: Relieves environmental agencies from routine monitoring tasks, allowing them to focus on processing confirmed violations.
*   **Data-Driven Decisions**: Provides valuable data on tree population trends and the effectiveness of protective measures.

## Technical Details
The project would be built on a modern web stack, utilizing Python (for geospatial processing and ML models), TypeScript/JavaScript (for frontend and backend APIs), and PostGIS/PostgreSQL for geospatial data storage. The use of open-source libraries such as GDAL, Rasterio, Scikit-learn, and Turf.js is envisioned. The user interface would be implemented as an interactive map with filtering and reporting functionalities.
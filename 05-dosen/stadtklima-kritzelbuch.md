# Urban Climate Doodle Book

## The Challenge
Planning our cities for climate change is complex. How do new buildings, streets, or trees affect the micro-climate – shade, wind, and temperature – in their immediate surroundings? Current simulation tools are often expensive, difficult to use, and deliver results only after long waiting periods. This hinders early public involvement and slows down iterative planning processes.

## The Amélie Idea
An "Urban Climate Doodle Book" is a **browser-native, AI-powered tool** that enables urban planners and citizens to quickly and playfully sketch urban changes on a map. Whether it's a new building, a row of trees, or a green space – the impacts on the local micro-climate (shade patterns throughout the day, wind flows, perceived temperature) are **simulated and visually presented immediately** directly in the browser.

## How it Works
1.  **Draw & Sketch:** Users can draw simple shapes for new buildings, trees, or green spaces directly on a map view (e.g., OpenStreetMap with Berlin 3D building data).
2.  **Instant Feedback:** A lightweight, browser-running AI model (e.g., WebGPU-based) processes the inputs in real-time.
3.  **Visual Simulation:** Overlays show the estimated impacts:
    *   **Shade:** Dynamic representation of shade patterns over the course of the day.
    *   **Wind:** Visualization of wind corridors and blockages.
    *   **Temperature:** Relative estimation of surface and air temperature.
4.  **Iterative Planning:** The rapid feedback allows users to explore different scenarios and immediately compare their effects.

## The Benefit
*   **Participation:** Lowers the barrier for citizen engagement through intuitive visualization.
*   **Efficiency:** Accelerates early planning phases through rapid prototyping.
*   **Climate Resilience:** Promotes climate-adapted design through immediate understanding of micro-climatic effects.
*   **Transparency:** Makes complex relationships understandable and comprehensible.

The Urban Climate Doodle Book is not a substitute for detailed, engineering-grade simulations, but rather an **exploratory tool** for ideation, communication, and iterative design.
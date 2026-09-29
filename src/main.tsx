import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./moods.css";
import { initMood } from "./utils/mood";

// Vor dem ersten Rendern, damit die Seite nicht kurz in der falschen Stimmung aufblitzt.
initMood();

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

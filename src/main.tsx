import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import "./moods.css";
import { initMood } from "./utils/mood";

// Vor dem ersten Rendern, damit die Seite nicht kurz in der falschen Stimmung aufblitzt.
initMood();
// React restores positions after each lazy page has committed.
window.history.scrollRestoration = 'manual';

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter>
    </React.StrictMode>
  );
}

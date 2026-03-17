import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// ── Service Worker (PWA) ──────────────────────────────────────
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => console.log("[ALFA PWA] SW registered:", reg.scope))
            .catch((err) => console.warn("[ALFA PWA] SW registration failed:", err));
    });
}


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { CategoryProvider } from "./contexts/CategoryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <CategoryProvider>
        <App />
      </CategoryProvider>
    </ThemeProvider>
  </StrictMode>
);

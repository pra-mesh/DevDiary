import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { CategoryProvider } from "./contexts/CategoryContext.tsx";
import { EntryProvider } from "./contexts/EntryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <CategoryProvider>
        <EntryProvider>
          <App />
        </EntryProvider>
      </CategoryProvider>
    </ThemeProvider>
  </StrictMode>
);

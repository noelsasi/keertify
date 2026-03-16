// import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "./components/layouts/ThemeProvider.tsx"

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="keertify-theme">
      <App />
    </ThemeProvider>
  // </StrictMode>
)

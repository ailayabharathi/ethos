import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionContextProvider } from "@/components/auth/SessionContextProvider"; // Import SessionContextProvider

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" attribute="class">
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  </ThemeProvider>
);
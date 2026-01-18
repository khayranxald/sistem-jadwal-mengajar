import React, { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import useDarkModeStore from "./stores/darkModeStore";
import "./styles/global.css";


function App() {
  const { isDarkMode } = useDarkModeStore();

  useEffect(() => {
    // Apply dark mode class on initial mount
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Log app initialization
    console.log("🚀 Sistem Jadwal Mengajar - Initialized");
    console.log("📅 Minggu 1: Setup Project Complete");
    console.log("🎨 Theme:", isDarkMode ? "Dark Mode" : "Light Mode");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AppRouter />
    </div>
  );
}

export default App;

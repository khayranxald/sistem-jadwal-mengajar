import { useEffect } from "react";
import useDarkModeStore from "../stores/darkModeStore";

const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useDarkModeStore();

  useEffect(() => {
    // Apply dark mode on mount
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode, setDarkMode };
};

export default useDarkMode;

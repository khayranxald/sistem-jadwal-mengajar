import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDarkModeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,

      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.isDarkMode;
          if (newMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: newMode };
        }),

      setDarkMode: (value) =>
        set(() => {
          if (value) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: value };
        }),
    }),
    {
      name: "dark-mode-storage",
    }
  )
);

export default useDarkModeStore;

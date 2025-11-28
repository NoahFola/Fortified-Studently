import { create } from "zustand";
import { persist } from "zustand/middleware";
interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: "studently-ui-store",
    }
  )
);

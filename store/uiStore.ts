import { create } from "zustand";

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  darkMode: false,
  sidebarOpen: true,

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

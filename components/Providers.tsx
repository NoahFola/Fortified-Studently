"use client";
import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import { useUIStore } from "@/store/uiStore";

import ThemeProvider from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const { darkMode } = useUIStore();


  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);



  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}

export default Providers;

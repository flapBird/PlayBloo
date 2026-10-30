"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("playbloo-theme", dark ? "dark" : "light");
    } catch {
      // The current page can still switch when browser storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch color theme"
      className="header-action header-action-square"
    >
      <Moon aria-hidden="true" className="header-action-icon dark:hidden" />
      <Sun aria-hidden="true" className="header-action-icon hidden dark:block" />
    </button>
  );
}

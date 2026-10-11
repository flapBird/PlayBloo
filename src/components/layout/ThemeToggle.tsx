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
    <button type="button" onClick={toggleTheme} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
      <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
      <Sun aria-hidden="true" className="hidden h-4 w-4 dark:block" />
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:block">Switch to light mode</span>
    </button>
  );
}

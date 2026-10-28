"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

interface SidebarState {
  open: boolean;
  toggle: () => void;
}

const STORAGE_KEY = "playbloo-sidebar";
const CHANGE_EVENT = "playbloo:sidebar";

/**
 * Server HTML always renders the rail visible; the inline script in the root
 * layout applies the stored state to <html data-sidebar> before first paint,
 * so the attribute is the single source of truth once the app is interactive.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const getSnapshot = () => document.documentElement.dataset.sidebar !== "closed";
const getServerSnapshot = () => true;

function writeOpen(open: boolean) {
  document.documentElement.dataset.sidebar = open ? "open" : "closed";
  try {
    localStorage.setItem(STORAGE_KEY, open ? "open" : "closed");
  } catch {
    // The toggle still works for this page when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const SidebarContext = createContext<SidebarState | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => writeOpen(!getSnapshot()), []);
  const value = useMemo(() => ({ open, toggle }), [open, toggle]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider");
  return context;
}

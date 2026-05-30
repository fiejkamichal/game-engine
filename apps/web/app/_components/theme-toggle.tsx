"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "app-theme";
const ICON_MOON = "\u263E";
const ICON_SUN = "\u263C";

function readDomTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable (private mode / SSR-ish) — silently ignore.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readDomTheme());
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.key !== "t" && event.key !== "T") return;
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }
      event.preventDefault();
      const next: Theme = readDomTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function onClick() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  const isDark = theme === "dark";
  const icon = isDark ? ICON_MOON : ICON_SUN;
  const title = isDark
    ? "Przełącz na jasny motyw (T)"
    : "Przełącz na ciemny motyw (T)";

  return (
    <button
      type="button"
      onClick={onClick}
      className="icon-btn"
      aria-label="Przełącz motyw"
      title={title}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

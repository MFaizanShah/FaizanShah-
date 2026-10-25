"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-shift");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("fs-theme", next);
    } catch {}
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-shift"), 700);
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      id="theme-toggle"
      className={`reactor${isLight ? " reactor--light" : ""}`}
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-pressed={isLight}
    >
      <span className="reactor__label reactor__label--dark">DRK</span>
      <span className="reactor__track" aria-hidden="true">
        <span className="reactor__ticks" />
        <span className="reactor__knob">
          <span className="reactor__core" />
          <svg className="reactor__ring" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" />
          </svg>
        </span>
      </span>
      <span className="reactor__label reactor__label--light">LUM</span>
    </button>
  );
}

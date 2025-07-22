// src/components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const enabled = stored === "dark" || (!stored && prefersDark);
    setIsDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded border text-sm border-gray-400 dark:border-gray-600"
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

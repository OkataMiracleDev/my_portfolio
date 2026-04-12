"use client";
import { useEffect, useState } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("light-mode", savedTheme === "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("light-mode", newTheme === "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[10001] p-3 rounded-full card hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <HiSun className="text-2xl text-yellow-300" />
      ) : (
        <HiMoon className="text-2xl text-indigo-600" />
      )}
    </button>
  );
}

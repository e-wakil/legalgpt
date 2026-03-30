// useTheme.ts
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useTheme = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

 useEffect(() => {
    const isChatPage = location.pathname.startsWith("/chat");

    if (isDark && isChatPage) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");

    return () => {
        document.documentElement.classList.remove("dark"); // cleanup on unmount
    };
}, [isDark, location.pathname]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
};

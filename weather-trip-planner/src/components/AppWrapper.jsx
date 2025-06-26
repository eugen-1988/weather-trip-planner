// src/components/AppWrapper.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const AppWrapper = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  const hiddenNavbarRoutes = ["/", "/welcome", "/login", "/register"];
  const shouldHideNavbar = hiddenNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const isInitialDark = saved === "dark" || (!saved && prefersDark);
    document.documentElement.classList.toggle("dark", isInitialDark);
    setIsDark(isInitialDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white"
          : "bg-gradient-to-br from-[#dbeafe] via-[#93c5fd] to-[#3b82f6] text-gray-700"
      }`}
    >
      {!shouldHideNavbar && (
        <Navbar onToggleTheme={toggleTheme} isDark={isDark} />
      )}
      {children}
    </div>
  );
};

export default AppWrapper;

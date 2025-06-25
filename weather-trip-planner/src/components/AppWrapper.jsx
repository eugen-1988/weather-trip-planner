// src/components/AppWrapper.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ import nou
import Navbar from "./Navbar";

const AppWrapper = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation(); // ✅ obținem ruta curentă

  // ✅ rutele pe care nu vrem să afișăm Navbar-ul
  const hiddenNavbarRoutes = ["/", "/welcome", "/login", "/register"];
  const shouldHideNavbar = hiddenNavbarRoutes.includes(location.pathname);

  // La prima încărcare – citește din localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (saved === "light" || (!saved && !prefersDark)) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Comutator temă
  const toggleTheme = () => {
    const isNowDark = !isDark;
    document.documentElement.classList.toggle("dark", isNowDark);
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
    setIsDark(isNowDark);
  };

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 
        ${
          isDark
            ? "bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white"
            : "bg-gradient-to-br from-[#dbeafe] via-[#93c5fd] to-[#3b82f6] text-gray-700"
        }`}
    >
      {/* ✅ afișăm Navbar doar dacă nu suntem pe o rută ascunsă */}
      {!shouldHideNavbar && (
        <Navbar onToggleTheme={toggleTheme} isDark={isDark} />
      )}
      {children}
    </div>
  );
};

export default AppWrapper;

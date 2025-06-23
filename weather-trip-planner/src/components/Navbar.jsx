import { useState } from "react";
import { FiSettings, FiMapPin, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import logo from "../assets/logo_1.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { useSelector, useDispatch } from "react-redux";
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from "../redux/geoSlice";
import {
  setWeatherData,
  setForecast,
  setHourlyForecast,
} from "../redux/weatherSlice";
import { getFiveDayForecast, getHourlyForecast } from "../services/weatherAPI";
import { useLocationHandler } from "../hooks/useLocationHandler";
import axios from "axios";

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateToCurrentLocation, resetToInitialLocation } =
    useLocationHandler();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { city, country, loading, error } = useSelector((state) => state.geo);

  const toggleThemeIcon = () => setIsDarkMode((prev) => !prev);

  const displayLocation = loading
    ? "Detecting..."
    : error
    ? "Unknown"
    : `${city}, ${country}`;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    dispatch(setLocationStart());

    try {
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: searchQuery.trim(),
            limit: 1,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          },
        }
      );

      const geo = geoRes.data?.[0];
      if (!geo) throw new Error("Location not found");

      const coords = { lat: geo.lat, lon: geo.lon };
      const city = geo.name;
      const country = geo.country;

      dispatch(setLocationSuccess({ coords, city, country }));

      // Actualizare meteo
      const weatherRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: geo.lat,
            lon: geo.lon,
            units: "metric",
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          },
        }
      );
      dispatch(setWeatherData(weatherRes.data));

      // Forecast 5 zile + orar
      const forecast = await getFiveDayForecast(geo.lat, geo.lon);
      dispatch(setForecast(forecast));

      const hourly = await getHourlyForecast(geo.lat, geo.lon);
      dispatch(setHourlyForecast(hourly));
    } catch (err) {
      dispatch(setLocationFailure("Could not fetch location"));
    }

    setSearchQuery("");
  };

  return (
    <header className="w-full px-4 py-4 bg-black/30 shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Stânga: Logo + Text */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 p-[2px] rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 shadow-[0_4px_10px_rgba(255,140,0,0.4)]">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain rounded-full bg-white shadow-inner shadow-black/20"
            />
          </div>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-300 via-yellow-400 to-orange-500 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.4)] tracking-wide">
            WeatherFlow
          </span>
        </div>

        {/* Mijloc: DOAR PE DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative flex items-center gap-2">
            <span className="absolute w-8 h-8 rounded-full bg-cyan-500 opacity-30 animate-ping" />
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full text-white shadow-md z-10">
              <FiMapPin className="text-lg" />
            </div>
            <span className="text-sm text-white/90 font-medium tracking-wide ml-1">
              {displayLocation}
            </span>
          </div>

          {/* Search Input + Button */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="pl-4 pr-4 py-2 w-64 rounded-xl bg-white/10 
                text-gray-200 font-light text-sm placeholder:text-gray-400
                backdrop-blur-md shadow-inner border border-white/20
                focus:outline-none focus:ring-1 focus:ring-cyan-400
                transition-all duration-300 ease-in-out"
            />
            <button
              title="Search"
              onClick={handleSearch}
              className="p-2 rounded-full shadow-xl border border-white/20
                bg-gradient-to-tr from-cyan-500 to-blue-500
                text-white hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-cyan-300
                transition-all duration-300"
            >
              <motion.div
                key="search"
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <FiSearch className="text-xl" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Dreapta: Temă + Burger */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleThemeIcon}
            title="Comută tema"
            className={`p-2 rounded-full shadow-xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-white/30
              ${
                isDarkMode
                  ? "bg-gradient-to-tr from-slate-800 to-slate-700 text-sky-300"
                  : "bg-gradient-to-tr from-yellow-200 to-yellow-300 text-yellow-700"
              }`}
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <FiMoon className="text-2xl" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <FiSun className="text-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            title="Meniu"
            className="p-2 rounded-full shadow-xl border border-white/20
              bg-gradient-to-tr from-orange-400 to-yellow-400
              text-white hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-yellow-400
              transition-all duration-300"
          >
            <motion.div
              key="burger"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <FiSettings className="text-xl" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* DOAR PE MOBILE */}
      <div className="mt-4 md:hidden flex flex-col items-center gap-3">
        <div className="relative flex items-center gap-2">
          <span className="absolute w-8 h-8 rounded-full bg-cyan-500 opacity-30 animate-ping" />
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full text-white shadow-md z-10">
            <FiMapPin className="text-lg" />
          </div>
          <span className="text-sm text-white/90 font-medium tracking-wide ml-1">
            {displayLocation}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full max-w-xs">
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="pl-4 pr-4 py-2 w-full rounded-xl bg-white/10 
              text-gray-200 font-light text-sm placeholder:text-gray-400
              backdrop-blur-md shadow-inner border border-white/20
              focus:outline-none focus:ring-1 focus:ring-cyan-400
              transition-all duration-300 ease-in-out"
          />
          <button
            title="Search"
            onClick={handleSearch}
            className="p-2 rounded-full shadow-xl border border-white/20
              bg-gradient-to-tr from-cyan-500 to-blue-500
              text-white hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-cyan-300
              transition-all duration-300"
          >
            <motion.div
              key="search-mobile"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <FiSearch className="text-xl" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Overlay + MobileMenu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-[9998]"
            />
            <MobileMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onUseLocation={updateToCurrentLocation}
              onResetLocation={resetToInitialLocation}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

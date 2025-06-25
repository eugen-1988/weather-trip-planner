import { motion } from "framer-motion";
import {
  FiX,
  FiLogOut,
  FiMapPin,
  FiRefreshCw,
  FiGrid,
  FiMap,
  FiCalendar,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({ isOpen, onClose, onUseLocation, onResetLocation }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleUseLocationClick = () => {
    if (onUseLocation) {
      onUseLocation();
      onClose();
    }
  };

  const handleResetLocationClick = () => {
    if (onResetLocation) {
      onResetLocation();
      onClose();
    }
  };

  const goToTripPlanner = () => {
    navigate("/trip-planner");
    onClose();
  };

  const goToMyTrips = () => {
    navigate("/my-trips");
    onClose();
  };
  const goToHome = () => {
    navigate("/home");
    onClose();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.5 }}
      className="fixed top-0 right-0 w-64 h-full 
      bg-white/50 text-blue-900 backdrop-blur-xl 
      dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] dark:text-white 
      shadow-2xl z-[9999] px-6 py-6 rounded-l-xl border-l border-white/20 dark:border-white/10"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          <FiGrid className="text-white/70 text-lg" />
          <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Menu
          </span>
        </h2>

        <motion.button
          onClick={onClose}
          whileHover={{ rotate: 180, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full border border-orange-400 text-white bg-[#0f172a] shadow-md hover:shadow-orange-500/50 hover:border-orange-500 transition duration-300"
        >
          <FiX className="text-xl" />
        </motion.button>
      </div>

      {/* Menu */}
      <ul className="space-y-4 text-white text-base">
        {/* 🏠 Home Page */}
        <li>
          <button
            onClick={goToHome}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
             text-sm text-white font-medium rounded-lg
             bg-gradient-to-r from-indigo-500 to-purple-500
             shadow hover:from-indigo-600 hover:to-purple-600
             hover:shadow-lg active:scale-95
             transition duration-300 ease-in-out"
          >
            <FiHome className="text-lg" />
            Home Page
          </button>
        </li>
        {/* 🧭 Trip Planner */}
        <li>
          <button
            onClick={goToTripPlanner}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
              text-sm text-white font-medium rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              shadow hover:from-indigo-600 hover:to-purple-600
              hover:shadow-lg active:scale-95
              transition duration-300 ease-in-out"
          >
            <FiMap className="text-lg" />
            Trip Planner
          </button>
        </li>

        {/* 📅 My Trips */}
        <li>
          <button
            onClick={goToMyTrips}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
              text-sm text-white font-medium rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              shadow hover:from-indigo-600 hover:to-purple-600
              hover:shadow-lg active:scale-95
              transition duration-300 ease-in-out"
          >
            <FiCalendar className="text-lg" />
            My Trips
          </button>
        </li>

        {/* 📍 My Location */}
        <li>
          <button
            onClick={handleUseLocationClick}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
              text-sm text-white font-medium rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              shadow hover:from-indigo-600 hover:to-purple-600
              hover:shadow-lg active:scale-95
              transition duration-300 ease-in-out"
          >
            <FiMapPin className="text-lg" />
            My Location
          </button>
        </li>

        {/* 🔁 Reset Location */}
        <li>
          <button
            onClick={handleResetLocationClick}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
              text-sm text-white font-medium rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              shadow hover:from-indigo-600 hover:to-purple-600
              hover:shadow-lg active:scale-95
              transition duration-300 ease-in-out"
          >
            <FiRefreshCw className="text-lg" />
            Reset Location
          </button>
        </li>

        {/* 🔐 Logout */}
        {currentUser && (
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3
                text-sm text-white font-medium rounded-lg
                bg-gradient-to-r from-orange-400 to-orange-500
                shadow-md hover:from-orange-500 hover:to-orange-600
                hover:shadow-lg active:scale-95
                transition duration-300 ease-in-out"
            >
              <FiLogOut className="text-base" />
              Logout
            </button>
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default MobileMenu;

import { motion } from "framer-motion";
import {
  FiX,
  FiLogOut,
  FiMapPin,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const MobileMenu = ({ isOpen, onClose, onUseLocation, onResetLocation }) => {
  const { currentUser, logout } = useAuth();

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

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.5 }}
      className="fixed top-0 right-0 w-64 h-full bg-gradient-to-br from-[#1b2735] via-[#2c3e50] to-[#1b2735] shadow-2xl z-[9999] px-6 py-6 rounded-l-xl border-l border-white/10"
    >
      {/* Header + Close */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          <FiSettings className="text-white/70 text-lg" />
          <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Settings
          </span>
        </h2>

        <motion.button
          onClick={onClose}
          whileHover={{ rotate: 180, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full border border-orange-400 text-white
          bg-[#0f172a] shadow-md hover:shadow-orange-500/50
          hover:border-orange-500 transition duration-300"
        >
          <FiX className="text-xl" />
        </motion.button>
      </div>

      {/* Menu */}
      <ul className="space-y-4 text-white text-base">
        {/* 📍 My Location */}
        <li>
          <button
            onClick={handleUseLocationClick}
            className="w-full flex flex-row-reverse items-center justify-center gap-2 px-4 py-2
              text-sm text-white font-medium rounded-lg
              bg-gradient-to-r from-blue-500 to-cyan-500
              shadow hover:from-blue-600 hover:to-cyan-600
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
              bg-gradient-to-r from-blue-500 to-cyan-500
              shadow hover:from-blue-600 hover:to-cyan-600
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

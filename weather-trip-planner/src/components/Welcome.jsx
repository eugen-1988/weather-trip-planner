// src/components/Welcome.jsx
import backgroundImage from "../assets/background.webp";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";

const Welcome = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-white 
                 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <img
          src={logo}
          alt="WeatherFlow Logo"
          className="w-72 sm:w-96 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
        />

        <div className="w-full max-w-md mt-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default Welcome;

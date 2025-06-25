// src/components/WeatherMain.jsx
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  WiStrongWind,
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiThermometerExterior,
  WiFog,
} from "react-icons/wi";
import { HiOutlineCalendarDays, HiOutlineClock } from "react-icons/hi2";

import WeatherIcon from "./WeatherIcon";
import iconToCodeMap from "../utils/iconToCodeMap";

const WeatherMain = () => {
  const weatherData = useSelector((state) => state.weather.weatherData);

  const weather = weatherData
    ? {
        city: weatherData?.name,
        country: weatherData?.sys?.country,
        temperature: Math.round(weatherData?.main?.temp),
        feels_like: Math.round(weatherData?.main?.feels_like),
        description: weatherData?.weather?.[0]?.description,
        wind: `${weatherData?.wind?.speed} m/s`,
        pressure: `${weatherData?.main?.pressure} hPa`,
        humidity: `${weatherData?.main?.humidity}%`,
        uv: 4, // placeholder UV
        dew_point: "14°C", // placeholder Dew Point
        visibility: `${weatherData?.visibility / 1000} km`,
        iconId: weatherData?.weather?.[0]?.icon,
      }
    : null;

  // 🔁 Cod numeric & zi/noapte pentru WeatherIcon
  const code = weather?.iconId ? iconToCodeMap[weather.iconId] : null;
  const isDay = weather?.iconId?.endsWith("d");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-white/5 via-white/10 to-white/5
      backdrop-blur-xl p-6 md:p-8 rounded-3xl
      border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]
      text-inherit transform-gpu"
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/10 shadow-inner shadow-white/10" />

      {!weather ? (
        <p className="text-inherit text-center text-sm">
          Loading weather data...
        </p>
      ) : (
        <>
          {/* Date & Time */}
          <div className="flex items-center gap-6 text-sm text-inherit mb-4 z-10 relative">
            <div className="flex items-center gap-2">
              <HiOutlineCalendarDays className="text-2xl text-sky-700 dark:text-sky-300" />

              <span>{dayjs().format("MMM D")}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-2xl text-emerald-700 dark:text-emerald-300" />

              <span>{dayjs().format("h:mm A")}</span>
            </div>
          </div>

          {/* Location & Temp */}
          <div className="flex justify-between items-center mb-4 z-10 relative">
            <div>
              <h2 className="text-2xl font-bold">
                {weather.city}, {weather.country}
              </h2>
              <p className="text-sm text-inherit">{weather.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {code && <WeatherIcon code={code} isDay={isDay} size={82} />}
              <div className="text-5xl font-semibold text-inherit drop-shadow-md">
                {weather.temperature}°C
              </div>
            </div>
          </div>

          {/* Feels like */}
          <div className="text-sm text-inherit mb-6 z-10 relative">
            Feels like{" "}
            <span className="font-medium">{weather.feels_like}°C</span>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-inherit z-10 relative">
            <div className="flex items-center gap-2">
              <WiStrongWind className="text-2xl text-cyan-700 dark:text-cyan-400" />

              <span>
                <strong>Wind:</strong> {weather.wind}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WiBarometer className="text-2xl text-blue-700 dark:text-blue-300" />
              <span>
                <strong>Pressure:</strong> {weather.pressure}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WiHumidity className="text-2xl text-indigo-400" />
              <span>
                <strong>Humidity:</strong> {weather.humidity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WiDaySunny className="text-2xl text-yellow-600 dark:text-yellow-300" />

              <span>
                <strong>UV Index:</strong> {weather.uv}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WiThermometerExterior className="text-2xl text-pink-700 dark:text-pink-300" />

              <span>
                <strong>Dew point:</strong> {weather.dew_point}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WiFog className="text-2xl text-teal-700 dark:text-teal-300" />
              <span>
                <strong>Visibility:</strong> {weather.visibility}
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default WeatherMain;

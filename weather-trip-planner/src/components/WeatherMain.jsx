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

  if (!weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-white/5 via-white/10 to-white/5
          backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 
          shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-inherit transform-gpu"
      >
        <p className="text-inherit text-center text-sm">
          Loading weather data...
        </p>
      </motion.div>
    );
  }

  const {
    name: city,
    sys: { country },
    main: { temp, feels_like, pressure, humidity },
    weather,
    wind,
    visibility,
  } = weatherData;

  const iconId = weather?.[0]?.icon;
  const description = weather?.[0]?.description;
  const code = iconToCodeMap[iconId];
  const isDay = iconId?.endsWith("d");

  const weatherDetails = {
    city,
    country,
    temperature: Math.round(temp),
    feels_like: Math.round(feels_like),
    description,
    wind: `${wind.speed} m/s`,
    pressure: `${pressure} hPa`,
    humidity: `${humidity}%`,
    uv: 4,
    dew_point: "14°C",
    visibility: `${visibility / 1000} km`,
    iconId,
  };

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

      {/* Location & Temperature */}
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <div>
          <h2 className="text-2xl font-bold">
            {weatherDetails.city}, {weatherDetails.country}
          </h2>
          <p className="text-sm text-inherit">{weatherDetails.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {code && <WeatherIcon code={code} isDay={isDay} size={82} />}
          <div className="text-5xl font-semibold text-inherit drop-shadow-md">
            {weatherDetails.temperature}°C
          </div>
        </div>
      </div>

      {/* Feels Like */}
      <div className="text-sm text-inherit mb-6 z-10 relative">
        Feels like{" "}
        <span className="font-medium">{weatherDetails.feels_like}°C</span>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-inherit z-10 relative">
        <Detail
          icon={
            <WiStrongWind className="text-2xl text-cyan-700 dark:text-cyan-400" />
          }
          label="Wind"
          value={weatherDetails.wind}
        />
        <Detail
          icon={
            <WiBarometer className="text-2xl text-blue-700 dark:text-blue-300" />
          }
          label="Pressure"
          value={weatherDetails.pressure}
        />
        <Detail
          icon={<WiHumidity className="text-2xl text-indigo-400" />}
          label="Humidity"
          value={weatherDetails.humidity}
        />
        <Detail
          icon={
            <WiDaySunny className="text-2xl text-yellow-600 dark:text-yellow-300" />
          }
          label="UV Index"
          value={weatherDetails.uv}
        />
        <Detail
          icon={
            <WiThermometerExterior className="text-2xl text-pink-700 dark:text-pink-300" />
          }
          label="Dew point"
          value={weatherDetails.dew_point}
        />
        <Detail
          icon={<WiFog className="text-2xl text-teal-700 dark:text-teal-300" />}
          label="Visibility"
          value={weatherDetails.visibility}
        />
      </div>
    </motion.div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

export default WeatherMain;

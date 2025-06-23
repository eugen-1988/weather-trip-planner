// src/components/HourlyForecast.jsx
import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import WeatherIcon from "./WeatherIcon";
import iconToCodeMap from "../utils/iconToCodeMap";
import { HiOutlineClock } from "react-icons/hi2";

const HourlyForecast = () => {
  const hourly = useSelector((state) => state.weather.hourlyForecast);

  if (!hourly || hourly.length === 0) {
    return (
      <p className="text-center text-sm text-white/70">
        Loading hourly forecast...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
        <HiOutlineClock className="text-2xl text-emerald-300" />
        Hourly Forecast
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 min-w-0">
        {hourly.map((hour, index) => {
          const code = iconToCodeMap[hour.icon];
          const isDay = hour.icon?.endsWith("d");

          return (
            <div
              key={index}
              className="min-w-[80px] flex-shrink-0 flex flex-col items-center text-center 
              bg-white/10 backdrop-blur-md p-2 rounded-xl
              shadow-[0_8px_20px_rgba(0,0,0,0.25)] border border-white/10"
            >
              <div className="text-sm text-white/80">
                {dayjs(hour.time).format("HH:mm")}
              </div>
              {code ? (
                <WeatherIcon code={code} isDay={isDay} size={56} />
              ) : (
                <span className="text-white text-lg">❓</span>
              )}
              <div className="text-md font-medium">{hour.temp}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;

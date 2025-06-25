// src/components/ForecastSlider.jsx
import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import WeatherIcon from "./WeatherIcon";
import iconToCodeMap from "../utils/iconToCodeMap";
import { HiOutlineCalendarDays } from "react-icons/hi2"; // 📅

const ForecastSlider = () => {
  const forecast = useSelector((state) => state.weather.forecast);

  if (!forecast || forecast.length === 0) {
    return (
      <p className="text-center text-sm text-white/70">Loading forecast...</p>
    );
  }

  return (
    <div>
      {/* 🔹 Titlu cu calendar */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
        <HiOutlineCalendarDays className="text-2xl text-sky-300" />5 Day
        Forecast
      </h2>

      {/* 🔸 Forecast cards scrollable */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 py-6 px-6">
        <div className="flex gap-4 min-w-max">
          {forecast.map((day, index) => {
            const code = iconToCodeMap[day.icon];
            const isDay = day.icon?.endsWith("d");

            return (
              <div
                key={index}
                className="min-w-[120px] flex-shrink-0 flex flex-col items-center text-center 
                bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 
                shadow-[0_8px_20px_rgba(0,0,0,0.25)]              
                transition-transform duration-300"
              >
                <div className="text-sm text-white/70 mb-1">
                  {dayjs(day.date).format("ddd, MMM D")}
                </div>
                {code ? (
                  <WeatherIcon code={code} isDay={isDay} size={66} />
                ) : (
                  <span className="text-white text-xl">❓</span>
                )}
                <div className="text-2xl font-bold">{day.temp}°C</div>
                <div className="text-xs text-white/60">{day.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastSlider;

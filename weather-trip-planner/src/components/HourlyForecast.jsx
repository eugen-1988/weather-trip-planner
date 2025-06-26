import { useSelector } from "react-redux";
import dayjs from "dayjs";
import WeatherIcon from "./WeatherIcon";
import iconToCodeMap from "../utils/iconToCodeMap";
import { HiOutlineClock } from "react-icons/hi2";

const HourlyForecast = () => {
  const hourly = useSelector((state) => state.weather.hourlyForecast);

  if (!hourly?.length) {
    return (
      <p className="text-center text-sm text-inherit">
        Loading hourly forecast...
      </p>
    );
  }

  return (
    <div>
      {/*  Titlu orar */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-inherit">
        <HiOutlineClock className="text-3xl text-emerald-700 dark:text-emerald-300" />
        Hourly Forecast
      </h2>

      {/*  Scroll orizontal ore */}
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 min-w-0 py-5 px-5">
        {hourly.map((hour, index) => {
          const code = iconToCodeMap[hour.icon];
          const isDay = hour.icon?.endsWith("d");

          return (
            <div
              key={index}
              className="min-w-[80px] flex-shrink-0 flex flex-col items-center text-center 
                bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 
                shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="text-sm text-inherit">
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

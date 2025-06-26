import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import { HiOutlineChartBar } from "react-icons/hi2";

const WeatherTrendsGraph = () => {
  const hourly = useSelector((state) => state.weather.hourlyForecast);

  if (!hourly?.length) {
    return (
      <p className="text-center text-sm text-white/70">
        Loading temperature trends...
      </p>
    );
  }

  const graphData = hourly.map((hour) => ({
    time: dayjs(hour.time).format("HH:mm"),
    temp: hour.temp,
  }));

  const isMobile = window.innerWidth < 640;
  const graphHeight = isMobile ? 160 : 220;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-inherit">
        <HiOutlineChartBar className="text-3xl text-amber-700 dark:text-amber-300" />
        Temperature Trend (Next Hours)
      </h2>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
        <ResponsiveContainer width="100%" height={graphHeight}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis
              stroke="#fff"
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v}°C`}
            />
            <Tooltip
              formatter={(v) => `${v}°C`}
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#f7ba34" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f7ba34"
              strokeWidth={3}
              dot={{ fill: "#f7ba34", stroke: "#fff", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherTrendsGraph;

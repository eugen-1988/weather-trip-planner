// src/components/WeatherIcon.jsx

import { weatherCodes } from "../assets/weatherCodes";

// ✅ Import toate SVG-urile din assets/icons/ folosind Vite
const rawIcons = import.meta.glob("../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

// ✅ Transformă obiectul { path: url } în { filename: url }
const icons = Object.entries(rawIcons).reduce((acc, [path, url]) => {
  const name = path.split("/").pop().replace(".svg", "");
  acc[name] = url;
  return acc;
}, {});

const WeatherIcon = ({ code, isDay = true, size = 48 }) => {
  const time = isDay ? "day" : "night";
  const iconName = weatherCodes[time][code];

  // 🔁 Modificare: caută fișierul cu prefix `wi_`
  const prefixedName = `wi_${iconName}`;
  const iconUrl = icons[prefixedName];

  if (!iconUrl) {
    console.warn("Icon not found:", prefixedName);
    return <span className="text-white text-xl">❓</span>;
  }

  return (
    <img
      src={iconUrl}
      alt={iconName}
      width={size}
      height={size}
      className="mx-auto"
    />
  );
};

export default WeatherIcon;

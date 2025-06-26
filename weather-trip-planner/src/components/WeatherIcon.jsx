import { weatherCodes } from "../assets/weatherCodes";

const rawIcons = import.meta.glob("../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const icons = Object.fromEntries(
  Object.entries(rawIcons).map(([path, url]) => {
    const name = path.split("/").pop().replace(".svg", "");
    return [name, url];
  })
);

const WeatherIcon = ({ code, isDay = true, size = 48 }) => {
  const timeOfDay = isDay ? "day" : "night";
  const baseName = weatherCodes[timeOfDay]?.[code];
  const iconName = baseName ? `wi_${baseName}` : null;
  const iconUrl = iconName ? icons[iconName] : null;

  if (!iconUrl) {
    console.warn("⚠️ WeatherIcon not found:", iconName);
    return <span className="text-white text-xl">❓</span>;
  }

  return (
    <img
      src={iconUrl}
      alt={baseName}
      width={size}
      height={size}
      className="mx-auto"
    />
  );
};

export default WeatherIcon;

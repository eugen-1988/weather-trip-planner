// src/services/weatherAPI.js
import axios from "axios";
import dayjs from "dayjs";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/reverse";

/**
 * Obține orașul și țara pe baza coordonatelor
 */
export const getLocationName = async (lat, lon) => {
  const { data } = await axios.get(GEO_URL, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      limit: 1,
    },
  });

  if (!data || data.length === 0) throw new Error("Location not found");
  return {
    city: data[0].name,
    country: data[0].country,
  };
};

/**
 * Obține datele meteo curente pe baza coordonatelor
 */
export const getCurrentWeather = async (lat, lon) => {
  const { data } = await axios.get(WEATHER_URL, {
    params: {
      lat,
      lon,
      units: "metric",
      appid: OPENWEATHER_API_KEY,
    },
  });

  return {
    temperature: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    wind: `${data.wind.speed} m/s ${getWindDirection(data.wind.deg)}`,
    pressure: `${data.main.pressure} hPa`,
    humidity: `${data.main.humidity}%`,
    uv: 4, // OpenWeather planul Free nu oferă UV direct, se poate adăuga mai târziu
    dew_point: `${data.main.temp - (100 - data.main.humidity) / 5}°C`,
    visibility: `${data.visibility / 1000} km`,
  };
};

/**
 * Helper pentru conversia unghiului vântului în direcție cardinală
 */
const getWindDirection = (deg) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};
/**
 /**
 * Obține forecastul pe 5 zile (din 3 în 3 ore, îl filtrăm pentru ora 12:00)
 */
export const getFiveDayForecast = async (lat, lon) => {
  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    }
  );

  // Extragem o singură intrare per zi la ora 12:00
  const dailyForecast = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  // Formatează fiecare intrare pentru slider
  return dailyForecast.map((item) => ({
    date: item.dt_txt,
    day: dayjs(item.dt_txt).format("ddd, MMM D"),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
  }));
};
/**
 * Obține forecastul orar (următoarele 8 intervale de 3 ore)
 */
export const getHourlyForecast = async (lat, lon) => {
  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    }
  );

  return data.list.slice(0, 8).map((item) => ({
    time: item.dt_txt,
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));
};

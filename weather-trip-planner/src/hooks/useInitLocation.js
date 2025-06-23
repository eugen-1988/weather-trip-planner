// src/hooks/useInitLocation.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from "../redux/geoSlice";
import {
  setWeatherData,
  setForecast,
  setHourlyForecast, // 🔹 forecast orar
} from "../redux/weatherSlice";
import useGeolocation from "./useGeolocation";
import {
  getFiveDayForecast,
  getHourlyForecast, // 🔹 import nou
} from "../services/weatherAPI";

const useInitLocation = () => {
  const dispatch = useDispatch();
  const { coords, error: geoError } = useGeolocation();

  useEffect(() => {
    let intervalId;

    const fetchLocationAndWeather = async () => {
      if (!coords) return;

      dispatch(setLocationStart());

      try {
        const { lat, lon } = coords;
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        // 🔹 1. Get city + country
        const geoRes = await axios.get(
          "https://api.openweathermap.org/geo/1.0/reverse",
          {
            params: { lat, lon, limit: 1, appid: apiKey },
          }
        );

        const geoData = geoRes.data?.[0];
        if (!geoData) throw new Error("Locația nu a putut fi identificată.");

        const locationInfo = {
          coords: { lat, lon },
          city: geoData.name,
          country: geoData.country,
        };
        dispatch(setLocationSuccess(locationInfo));

        // 🔹 2. Get current weather
        const weatherRes = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: { lat, lon, units: "metric", appid: apiKey },
          }
        );

        const weatherData = {
          ...weatherRes.data,
          name: locationInfo.city,
          sys: { ...weatherRes.data.sys, country: locationInfo.country },
        };
        dispatch(setWeatherData(weatherData));

        // 🔹 3. Get 5-day forecast
        const forecastData = await getFiveDayForecast(lat, lon);
        dispatch(setForecast(forecastData));

        // 🔹 4. Get hourly forecast (următoarele 8 intervale de 3 ore)
        const hourlyData = await getHourlyForecast(lat, lon);
        dispatch(setHourlyForecast(hourlyData));
      } catch (err) {
        dispatch(
          setLocationFailure(err.message || "Eroare la obținerea locației.")
        );
      }
    };

    if (coords && !geoError) {
      fetchLocationAndWeather();

      intervalId = setInterval(() => {
        fetchLocationAndWeather();
      }, 5 * 60 * 1000);
    }

    if (geoError) {
      dispatch(setLocationFailure("Permisiunea de locație a fost refuzată."));
    }

    return () => clearInterval(intervalId);
  }, [coords, geoError, dispatch]);
};

export default useInitLocation;

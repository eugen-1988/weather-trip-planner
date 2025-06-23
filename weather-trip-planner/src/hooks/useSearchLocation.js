// src/hooks/useSearchLocation.js
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from "../redux/geoSlice";
import {
  setWeatherData,
  setForecast,
  setHourlyForecast,
} from "../redux/weatherSlice";
import { getFiveDayForecast, getHourlyForecast } from "../services/weatherAPI";

const useSearchLocation = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    dispatch(setLocationStart());

    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: cityName,
            limit: 1,
            appid: apiKey,
          },
        }
      );

      const location = geoRes.data?.[0];
      if (!location) throw new Error("Location not found");

      const { lat, lon, name, country } = location;

      dispatch(
        setLocationSuccess({
          coords: { lat, lon },
          city: name,
          country,
        })
      );

      // Vremea curentă
      const weatherRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat,
            lon,
            units: "metric",
            appid: apiKey,
          },
        }
      );

      dispatch(setWeatherData(weatherRes.data));

      // Forecast 5 zile + forecast orar
      const forecast = await getFiveDayForecast(lat, lon);
      const hourly = await getHourlyForecast(lat, lon);

      dispatch(setForecast(forecast));
      dispatch(setHourlyForecast(hourly));
    } catch (err) {
      setError(err.message || "Search failed");
      dispatch(setLocationFailure(err.message || "Search failed"));
    } finally {
      setLoading(false);
    }
  };

  return { searchCity, loading, error };
};

export default useSearchLocation;

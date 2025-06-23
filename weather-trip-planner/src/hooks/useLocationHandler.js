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
import {
  getLocationName,
  getFiveDayForecast,
  getHourlyForecast,
} from "../services/weatherAPI";
import axios from "axios";
import { toast } from "react-toastify";

const STORAGE_KEY = "initial_location";

export const useLocationHandler = () => {
  const dispatch = useDispatch();

  const fetchWeatherRaw = async (lat, lon, city, country) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: { lat, lon, units: "metric", appid: apiKey },
      }
    );

    const fullData = {
      ...res.data,
      name: city,
      sys: { ...res.data.sys, country },
    };

    return fullData;
  };

  const handleSearchLocation = async (cityName) => {
    try {
      dispatch(setLocationStart());

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0)
        throw new Error("Location not found");

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
      const city = geoData[0].name;
      const country = geoData[0].country;

      const locationInfo = {
        coords: { lat, lon },
        city,
        country,
      };

      dispatch(setLocationSuccess(locationInfo));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locationInfo));

      const weatherData = await fetchWeatherRaw(lat, lon, city, country);
      dispatch(setWeatherData(weatherData));

      const forecastData = await getFiveDayForecast(lat, lon);
      dispatch(setForecast(forecastData));

      const hourlyData = await getHourlyForecast(lat, lon);
      dispatch(setHourlyForecast(hourlyData));

      toast.success(`Weather for ${city}, ${country} loaded`);
    } catch (error) {
      dispatch(setLocationFailure(error.message));
      toast.error("Failed to fetch weather data");
    }
  };

  const updateToCurrentLocation = async () => {
    dispatch(setLocationStart());

    if (!navigator.geolocation) {
      dispatch(setLocationFailure("Geolocation not supported."));
      toast.error("Geolocation not supported by browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const geoData = await getLocationName(latitude, longitude);

          const locationInfo = {
            coords: { lat: latitude, lon: longitude },
            city: geoData.city,
            country: geoData.country,
          };

          dispatch(setLocationSuccess(locationInfo));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(locationInfo));

          const weather = await fetchWeatherRaw(
            latitude,
            longitude,
            geoData.city,
            geoData.country
          );
          dispatch(setWeatherData(weather));

          const forecast = await getFiveDayForecast(latitude, longitude);
          dispatch(setForecast(forecast));

          const hourly = await getHourlyForecast(latitude, longitude);
          dispatch(setHourlyForecast(hourly));

          toast.success(`Location updated to ${geoData.city}`);
        } catch (err) {
          dispatch(setLocationFailure("Failed to fetch location data."));
          toast.error("Unable to get current location");
        }
      },
      (error) => {
        dispatch(setLocationFailure(error.message));
        toast.error(error.message || "Geolocation error");
      }
    );
  };

  const resetToInitialLocation = async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      toast.error("No initial location saved");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      dispatch(setLocationStart());
      dispatch(setLocationSuccess(parsed));

      const { lat, lon } = parsed.coords;
      const weather = await fetchWeatherRaw(
        lat,
        lon,
        parsed.city,
        parsed.country
      );
      dispatch(setWeatherData(weather));

      const forecast = await getFiveDayForecast(lat, lon);
      dispatch(setForecast(forecast));

      const hourly = await getHourlyForecast(lat, lon);
      dispatch(setHourlyForecast(hourly));

      toast.success(`Reset to ${parsed.city}, ${parsed.country}`);
    } catch (err) {
      dispatch(setLocationFailure("Failed to restore saved location."));
      toast.error("Reset failed");
    }
  };

  return {
    handleSearchLocation,
    updateToCurrentLocation,
    resetToInitialLocation,
  };
};

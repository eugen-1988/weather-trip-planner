// src/hooks/useGeolocation.js
import { useEffect, useState } from "react";
import axios from "axios";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    coords: null,
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation not supported by your browser.",
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${
              import.meta.env.VITE_OPENWEATHER_API_KEY
            }`
          );

          const city = res.data?.[0]?.name;
          const country = res.data?.[0]?.country;

          setLocation({
            coords: { lat: latitude, lon: longitude },
            city: city || "Unknown",
            country: country || "Unknown",
            loading: false,
            error: null,
          });
        } catch (error) {
          setLocation((prev) => ({
            ...prev,
            error: "Failed to get city name.",
            loading: false,
          }));
        }
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    );
  }, []);

  return location;
};

export default useGeolocation;

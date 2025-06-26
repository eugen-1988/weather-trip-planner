import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weatherData: null,
  forecast: [],
  hourlyForecast: [],
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherData: (state, action) => {
      state.weatherData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
    },
    setHourlyForecast: (state, action) => {
      state.hourlyForecast = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default weatherSlice.reducer;

export const {
  setWeatherData,
  setForecast,
  setHourlyForecast,
  setLoading,
  setError,
} = weatherSlice.actions;

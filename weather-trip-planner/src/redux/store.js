// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import tripReducer from "./tripSlice";
import geoReducer from "./geoSlice"; // 👈 import nou

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    trip: tripReducer,
    geo: geoReducer, // 👈 adăugat
  },
});

// src/redux/geoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coords: null,
  city: "",
  country: "",
  loading: false,
  error: null,
};

const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    setLocationStart(state) {
      state.loading = true;
      state.error = null;
    },
    setLocationSuccess(state, action) {
      state.coords = action.payload.coords;
      state.city = action.payload.city;
      state.country = action.payload.country;
      state.loading = false;
      state.error = null;
    },
    setLocationFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLocationStart, setLocationSuccess, setLocationFailure } =
  geoSlice.actions;

export default geoSlice.reducer;

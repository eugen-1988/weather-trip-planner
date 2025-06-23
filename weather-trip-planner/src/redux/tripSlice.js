// src/redux/tripSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Starea inițială a călătoriilor
const initialState = {
  trips: [], // va conține lista de călătorii salvate
};

// ✅ Slice pentru călătorii
const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    // ➕ Adaugă o nouă călătorie
    addTrip: (state, action) => {
      state.trips.push(action.payload);
    },
    // 🗑️ Șterge o călătorie
    removeTrip: (state, action) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },
    // 🔄 Resetează toate călătoriile (de ex. la logout)
    resetTrips: () => initialState,
  },
});

// ✅ Exportă reducerul implicit
export default tripSlice.reducer;

// ✅ Exportă acțiunile pentru dispatch
export const { addTrip, removeTrip, resetTrips } = tripSlice.actions;

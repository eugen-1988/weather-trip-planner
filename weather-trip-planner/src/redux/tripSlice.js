import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [],
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    addTrip: (state, action) => {
      state.trips.push(action.payload);
    },

    removeTrip: (state, action) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },

    resetTrips: () => initialState,
  },
});

export default tripSlice.reducer;

export const { addTrip, removeTrip, resetTrips } = tripSlice.actions;

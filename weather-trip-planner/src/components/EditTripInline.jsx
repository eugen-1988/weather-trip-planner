import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from "../redux/geoSlice";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const EditTripInline = ({ trip, onCancel, onSave }) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState(trip.city);
  const [country, setCountry] = useState(trip.country);
  const [coords, setCoords] = useState(trip.coords);

  const [departureDate, setDepartureDate] = useState(
    trip.departureDate?.toDate?.().toISOString().split("T")[0] || ""
  );
  const [arrivalDate, setArrivalDate] = useState(
    trip.arrivalDate?.toDate?.().toISOString().split("T")[0] || ""
  );

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    dispatch(setLocationStart());
    setSearching(true);

    try {
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: searchQuery.trim(),
            limit: 1,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          },
        }
      );

      const geo = geoRes.data?.[0];
      if (!geo || typeof geo.lat !== "number" || typeof geo.lon !== "number") {
        throw new Error("Location data incomplete");
      }

      const newCoords = { lat: geo.lat, lon: geo.lon };
      setCity(geo.name);
      setCountry(geo.country);
      setCoords(newCoords);

      dispatch(
        setLocationSuccess({
          coords: newCoords,
          city: geo.name,
          country: geo.country,
        })
      );
      toast.success("Location found", { position: "top-center" });
    } catch {
      dispatch(setLocationFailure("Location fetch failed"));
      toast.error("Failed to find location", { position: "top-center" });
    } finally {
      setSearching(false);
      setSearchQuery("");
    }
  };

  const handleSubmit = async () => {
    if (!city || !country || !departureDate || !arrivalDate) {
      toast.error("Please complete all fields", { position: "top-center" });
      return;
    }

    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lon !== "number"
    ) {
      toast.error("Coordinates are missing or invalid", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      const ref = doc(db, "trips", trip.id);
      await updateDoc(ref, {
        city,
        country,
        coords: { lat: coords.lat, lng: coords.lon },
        departureDate: new Date(departureDate),
        arrivalDate: new Date(arrivalDate),
      });

      toast.success("Trip updated", { position: "top-center" });
      onSave();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Could not update trip", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 border border-white/20 p-4 mt-4 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-6 flex-wrap">
        {/*  Searchbar */}
        <div className="flex items-center gap-2 md:w-[300px] w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search new city..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-4 pr-4 py-2 w-full rounded-xl bg-white/10 
              text-gray-200 font-light text-sm placeholder:text-gray-400
              backdrop-blur-md shadow-inner border border-white/20
              focus:outline-none focus:ring-1 focus:ring-cyan-400
              transition-all duration-300 ease-in-out"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            title="Search"
            className="p-2 rounded-full shadow-xl border border-white/20
              bg-gradient-to-tr from-cyan-500 to-blue-500
              text-white hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-cyan-300
              transition-all duration-300"
          >
            <motion.div
              key="search-inline"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <FiSearch className="text-xl" />
            </motion.div>
          </button>
        </div>

        {/*  Dates */}
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="bg-white/5 border border-white/20 rounded px-4 py-2 w-full md:w-[280px]"
        />
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          className="bg-white/5 border border-white/20 rounded px-4 py-2 w-full md:w-[280px]"
        />

        {/*  Buttons */}
        <div className="flex gap-2 w-full md:w-auto ml-auto">
          <button
            onClick={onCancel}
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 
              rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-medium 
              text-cyan-300 backdrop-blur-md shadow-md transition-all duration-200 
              hover:bg-cyan-300/20 hover:text-white hover:shadow-lg 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 
              active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-white rounded-xl
              bg-gradient-to-r from-green-400 via-green-500 to-green-600
              shadow-lg hover:from-green-500 hover:to-green-700
              transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTripInline;

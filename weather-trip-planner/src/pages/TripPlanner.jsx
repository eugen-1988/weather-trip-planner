import WeatherMain from "../components/WeatherMain";
import MapSection from "../components/MapSection";
import Footer from "../components/Footer";
import useInitLocation from "../hooks/useInitLocation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaRegSmile, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { db } from "../auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TripPlanner = () => {
  useInitLocation();

  const { currentUser } = useAuth();
  const coords = useSelector((state) => state.geo.coords);
  const city = useSelector((state) => state.geo.city);
  const country = useSelector((state) => state.geo.country);
  const [range, setRange] = useState({ from: undefined, to: undefined });

  const handleDateSelect = (selectedRange) => {
    setRange(selectedRange || { from: undefined, to: undefined });
  };

  const handleSaveTrip = async () => {
    if (!range?.from || !range?.to) {
      return toast.error("Please select both departure and arrival dates.", {
        position: "top-center",
      });
    }

    if (!city || !coords) {
      return toast.error("Location information is missing.", {
        position: "top-center",
      });
    }

    if (!currentUser) {
      return toast.error("You must be logged in to save a trip.", {
        position: "top-center",
      });
    }

    const tripData = {
      userId: currentUser.uid,
      userName: currentUser.displayName || "Anonymous",
      city,
      country,
      coords: { lat: coords.lat, lng: coords.lon },
      departureDate: range.from,
      arrivalDate: range.to,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "trips"), tripData);
      toast.success("Trip successfully saved!", { position: "top-center" });
      setRange({ from: undefined, to: undefined });
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save the trip. Please try again.", {
        position: "top-center",
      });
    }
  };

  const formatDate = (date) => {
    return date instanceof Date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "–";
  };

  return (
    <div className="min-h-screen w-full bg-inherit text-inherit">
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherMain />
          <MapSection />
        </div>

        <section className="w-full bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl text-inherit">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md text-inherit rounded-xl shadow-lg p-4">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                  className="w-full"
                  modifiersClassNames={{
                    selected:
                      "bg-blue-400 text-white font-bold ring-2 ring-offset-1 ring-blue-400",
                    today: "bg-yellow-100 text-yellow-800 font-semibold",
                    range_middle: "bg-blue-300/40",
                    range_start: "rounded-l-full",
                    range_end: "rounded-r-full",
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-xl font-medium">
                <FaRegSmile className="text-2xl text-yellow-300" />
                <div className="text-base md:text-lg font-medium text-inherit">
                  <span className="text-xl font-semibold">
                    Hi{" "}
                    <span className="animate-pulse text-yellow-300">
                      {currentUser?.displayName || "explorer"}
                    </span>
                    , let’s plan something amazing.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-2xl text-red-400" />
                <p className="text-lg font-semibold">
                  {!city && !country
                    ? "Detecting location..."
                    : `${city}, ${country}`}
                </p>
              </div>

              {range?.from && range?.to && (
                <div className="flex flex-col gap-2 bg-white/5 px-4 py-3 rounded-lg shadow-inner border border-white/10 text-sm">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendarDays className="text-xl text-yellow-200" />
                    <span>
                      <strong className="text-white">Travel period:</strong>{" "}
                      <span className="text-yellow-300">
                        {formatDate(range.from)} – {formatDate(range.to)}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveTrip}
                className="w-full md:w-[200px] flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95"
              >
                <FaSave className="text-base" />
                Save trip
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TripPlanner;

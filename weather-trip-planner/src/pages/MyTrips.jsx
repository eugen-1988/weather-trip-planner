import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../auth/firebase";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import useInitLocation from "../hooks/useInitLocation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { WiStrongWind, WiBarometer, WiHumidity } from "react-icons/wi";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { TbWorldSearch } from "react-icons/tb";
import WeatherIcon from "../components/WeatherIcon";
import iconToCodeMap from "../utils/iconToCodeMap";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import EditTripInline from "../components/EditTripInline";

const fetchWeatherData = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`
  );
  return res.json();
};

const formatDate = (dateObj) => {
  if (!dateObj) return "No date";
  const date =
    typeof dateObj?.seconds === "number"
      ? new Date(dateObj.seconds * 1000)
      : new Date(dateObj);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const MyTrips = () => {
  useInitLocation();
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({});
  const [editingTripId, setEditingTripId] = useState(null);
  const editRef = useRef(null);

  useEffect(() => {
    const loadTrips = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "trips"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(results);

        const weatherMap = {};
        await Promise.all(
          results.map(async (trip) => {
            if (trip.coords?.lat && trip.coords?.lng) {
              const weather = await fetchWeatherData(
                trip.coords.lat,
                trip.coords.lng
              );
              weatherMap[trip.id] = weather;
            }
          })
        );
        setWeatherData(weatherMap);
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [currentUser]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditingTripId(null);
      }
    };

    if (editingTripId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTripId]);

  const handleRemoveTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      toast.success("Trip deleted successfully.", { position: "top-center" });
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Try again later.", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="min-h-screen w-full bg-inherit text-inherit">
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center mb-10"
        >
          <div className="absolute inset-0 blur-[60px] bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500 opacity-20 rounded-xl z-0"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-yellow-300 drop-shadow-xl z-10 flex items-center gap-4">
            <TbWorldSearch className="text-5xl animate-pulse drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] text-cyan-700 dark:text-cyan-300" />
            My Trips
          </h1>
        </motion.div>

        {loading ? (
          <p className="text-center text-inherit">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-center text-inherit italic">
            You have no saved trips at the moment.
          </p>
        ) : (
          <div className="space-y-8">
            {trips.map((trip) => {
              const weather = weatherData[trip.id];
              const iconId = weather?.weather?.[0]?.icon;
              const code = iconToCodeMap[iconId];
              const isDay = iconId?.endsWith("d");

              return (
                <div key={trip.id} className="space-y-4">
                  <div className="bg-white/10 border border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                    <div className="flex-1 p-6 space-y-3">
                      <div className="flex flex-col items-start gap-3 md:flex-col md:items-start md:gap-10">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {trip.city}, {trip.country}
                          </h2>
                          <div className="flex items-center gap-3 text-sm text-inherit mt-2">
                            <HiOutlineCalendarDays className="text-xl  dark:text-yellow-300 text-yellow-700" />
                            <span>
                              <strong className="text-inherit">
                                Travel period:
                              </strong>{" "}
                              <span className="dark:text-yellow-300 text-yellow-700">
                                {formatDate(trip.departureDate)} –{" "}
                                {formatDate(trip.arrivalDate)}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <button
                            onClick={() => handleRemoveTrip(trip.id)}
                            className="w-fit flex items-center justify-center gap-2 px-5 py-2
                             text-sm font-semibold text-white rounded-xl
                             bg-gradient-to-r from-red-500 via-red-600 to-red-700
                             shadow-lg hover:from-red-600 hover:to-red-800
                             transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95"
                          >
                            <FaTrashAlt className="text-base" />
                            Remove trip
                          </button>

                          <button
                            onClick={() => {
                              if (editingTripId === trip.id) return;
                              setEditingTripId(trip.id);
                              if (
                                typeof window !== "undefined" &&
                                window.innerWidth < 768
                              ) {
                                setTimeout(() => {
                                  editRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }, 200);
                              }
                            }}
                            className="w-fit flex items-center justify-center gap-2 px-5 py-2
                            text-sm font-semibold text-white rounded-xl
                            bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700
                            shadow-lg hover:from-yellow-600 hover:to-yellow-800
                            transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95"
                          >
                            ✏️ Edit trip
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6 border-t lg:border-t-0 lg:border-l border-white/10">
                      {weather ? (
                        <div className="flex flex-col sm:flex-col lg:flex-row gap-6">
                          <div className="flex flex-col items-center sm:hidden">
                            {code && (
                              <div className="mb-4">
                                <WeatherIcon
                                  code={code}
                                  isDay={isDay}
                                  size={72}
                                />
                              </div>
                            )}
                            <div className="flex w-full justify-between text-sm text-inherit">
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                  <WiStrongWind className="text-2xl text-cyan-700 dark:text-cyan-400 shrink-0" />
                                  <span>
                                    <strong>Wind:</strong> {weather.wind.speed}{" "}
                                    m/s
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <WiBarometer className="text-2xl text-blue-600 dark:text-blue-300 shrink-0" />
                                  <span>
                                    <strong>Pressure:</strong>{" "}
                                    {weather.main.pressure} hPa
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <WiHumidity className="text-2xl text-indigo-400 shrink-0" />
                                  <span>
                                    <strong>Humidity:</strong>{" "}
                                    {weather.main.humidity}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="capitalize font-medium text-inherit text-lg">
                                  {weather.weather[0].description}
                                </p>
                                <p className="text-3xl font-bold">
                                  {Math.round(weather.main.temp)}°C
                                </p>
                                <p className="text-sm">
                                  Feels like:{" "}
                                  {Math.round(weather.main.feels_like)}°C
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-col flex-1 justify-between space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="capitalize font-medium text-lg text-inherit">
                                  {weather.weather[0].description}
                                </p>
                                <p className="text-3xl font-bold">
                                  {Math.round(weather.main.temp)}°C
                                </p>
                                <p className="text-sm text-inherit">
                                  Feels like:{" "}
                                  {Math.round(weather.main.feels_like)}°C
                                </p>
                              </div>
                              {code && (
                                <WeatherIcon
                                  code={code}
                                  isDay={isDay}
                                  size={70}
                                />
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-2 text-xs text-inherit">
                              <div className="flex items-center gap-1">
                                <WiStrongWind className="text-xl text-cyan-700 dark:text-cyan-400" />
                                <span>
                                  <strong>Wind:</strong> {weather.wind.speed}{" "}
                                  m/s
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <WiBarometer className="text-xl text-blue-600 dark:text-blue-300" />
                                <span>
                                  <strong>Pressure:</strong>{" "}
                                  {weather.main.pressure} hPa
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <WiHumidity className="text-xl text-indigo-400" />
                                <span>
                                  <strong>Humidity:</strong>{" "}
                                  {weather.main.humidity}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-inherit">
                          Loading weather...
                        </p>
                      )}
                    </div>

                    <div className="hidden lg:block flex-1 h-auto min-h-[200px]">
                      <MapContainer
                        center={[trip.coords.lat, trip.coords.lng]}
                        zoom={10}
                        scrollWheelZoom={true}
                        className="w-full h-full z-0 rounded-r-3xl"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[trip.coords.lat, trip.coords.lng]}>
                          <Popup>
                            {trip.city}, {trip.country}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>

                    <div className="lg:hidden w-full h-[200px] mt-4 rounded-b-3xl overflow-hidden">
                      <MapContainer
                        center={[trip.coords.lat, trip.coords.lng]}
                        zoom={10}
                        scrollWheelZoom={true}
                        className="w-full h-full z-0"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[trip.coords.lat, trip.coords.lng]}>
                          <Popup>
                            {trip.city}, {trip.country}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>

                  {editingTripId === trip.id && (
                    <motion.div
                      ref={editRef}
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <EditTripInline
                        trip={trip}
                        onCancel={() => setEditingTripId(null)}
                        onSave={() => {
                          setEditingTripId(null);
                          window.location.reload();
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyTrips;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

const RecenterMap = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lon], 11);
    }
  }, [coords, map]);

  return null;
};

const MapSection = () => {
  const coords = useSelector((state) => state.geo.coords);
  const defaultCenter = [51.5074, -0.1278];
  const initialCenter = coords ? [coords.lat, coords.lon] : defaultCenter;

  const openWeatherLayer = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${
    import.meta.env.VITE_OPENWEATHER_API_KEY
  }`;

  return (
    <motion.div
      className="relative h-[300px] md:h-[300px] rounded-3xl overflow-hidden
                 bg-gradient-to-br from-white/10 via-white/5 to-white/0
                 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                 border border-white/10 backdrop-blur-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom
        className="w-full h-full z-[5] relative rounded-3xl"
      >
        {/*  OpenStreetMap Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*  OpenWeather Temperature Overlay */}
        <TileLayer url={openWeatherLayer} opacity={0.5} />

        {/*  User Location Marker */}
        {coords && (
          <Marker position={[coords.lat, coords.lon]}>
            <Popup>
              Your location
              <br />
              Lat: {coords.lat}, Lon: {coords.lon}
            </Popup>
          </Marker>
        )}

        <RecenterMap coords={coords} />
      </MapContainer>
    </motion.div>
  );
};

export default MapSection;

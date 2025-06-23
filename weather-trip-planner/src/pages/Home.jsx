import Navbar from "../components/Navbar";
import WeatherMain from "../components/WeatherMain";
import MapSection from "../components/MapSection";
import ForecastSlider from "../components/ForecastSlider";
import HourlyForecast from "../components/HourlyForecast";
import Footer from "../components/Footer";
import useInitLocation from "../hooks/useInitLocation";
import WeatherTrendsGraph from "../components/WeatherTrendsGraph";

const Home = () => {
  useInitLocation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherMain />
          <MapSection />
        </div>
        <HourlyForecast />
        <ForecastSlider />
        <WeatherTrendsGraph />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

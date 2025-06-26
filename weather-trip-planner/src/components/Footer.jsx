const Footer = () => {
  return (
    <footer className="text-sm text-inherit py-6 text-center border-t border-white/10 mt-10 px-4">
      <p>
        Weather data powered by{" "}
        <a
          href="https://openweathermap.org/"
          className="underline hover:text-white transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          OpenWeather
        </a>
      </p>
      <p className="mt-1">
        © {new Date().getFullYear()} WeatherFlow Planner. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

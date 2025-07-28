 🌤️ Weather Trip Planner – Plan your travels with weather in mind

 🔎 Overview
Weather Trip Planner is a modern and intuitive web app that lets you plan your trips based on real-time weather data. With a clean interface, interactive maps, and Firebase-powered data persistence, the app helps you choose the best travel dates and destinations backed by accurate forecasts.

 🧠 What I Built & Learned
- Developed a fully responsive, modern interface using TailwindCSS and Framer Motion
- Structured a scalable architecture with React + Redux + Firebase (Auth & Firestore)
- Integrated Leaflet.js for real-time map interaction and geolocation
- Created a complete trip management system: create, update, view, delete trips
- Used OpenWeather API for real-time weather data
- Applied form validation with React Hook Form & Zod

 ✨ Key Features
- [x] Search for city and see up-to-date weather info
- [x] Select travel range with DayPicker calendar
- [x] Interactive map with location markers
- [x] Save trips to Firestore
- [x] Edit trips inline
- [x] Fully responsive for all screen sizes

 🛠️ Tech Stack
**Frontend:** React 19, Vite, TailwindCSS, Framer Motion, React Router  
**State Management:** Redux Toolkit  
**Forms & Validation:** React Hook Form, Zod  
**Database & Auth:** Firebase Auth + Firestore  
**Weather API:** OpenWeather  
**Maps:** Leaflet + React-Leaflet  
**Other:** Axios, UUID, Recharts, dotenv

 🔧 Local Setup
```bash
git clone https://github.com/eugen-1988/weather-trip-planner.git
cd weather-trip-planner
npm install
npm run dev

[Live Demo](https://weather-trip-planner-xi.vercel.app/)


📁 Project Structure Highlights
/components – Reusable UI elements (WeatherDisplay, Map, Calendar)

/pages – TripPlanner, MyTrips views

/store – Redux slices (auth, trips, weather, location)

/hooks – Custom logic (e.g. useInitLocation)

/lib – Weather formatting, validators, API requests

📌 Why this project matters
This app highlights my ability to combine frontend development with real-time APIs and cloud services. I designed and implemented everything from the UI to Firestore integration. The project showcases my strengths in full-stack logic, UI/UX, and clean architecture.

🚀 Deployment
Deployed on Vercel. Uses .env file for secure keys (Firebase, OpenWeather).



---

 🇩🇪 – Deutsche Version


 🌤️ Wetter Reiseplaner – Plane deine Reisen mit Wetterdaten im Blick

 🔎 Überblick
Weather Trip Planner ist eine moderne, benutzerfreundliche Web-App, mit der du Reisen auf Basis aktueller Wetterdaten planen kannst. Die Anwendung kombiniert eine klare Oberfläche mit interaktiven Karten und Firebase-Datenhaltung, um dir bei der Wahl des besten Reiseziels und Zeitpunkts zu helfen.

 🧠 Was ich entwickelt & gelernt habe
- Vollständig responsives UI mit TailwindCSS und Framer Motion umgesetzt
- Skalierbare Architektur mit React, Redux und Firebase aufgebaut
- Leaflet.js für Karten- und Geolokalisierungsfunktionen integriert
- Komplettes Tripsystem implementiert: erstellen, anzeigen, bearbeiten, löschen
- OpenWeather API für Echtzeit-Wetterdaten verwendet
- Formulare mit React Hook Form und Zod validiert

 ✨ Hauptfunktionen
- [x] Ortssuche mit Anzeige aktueller Wetterdaten
- [x] Reisezeitraum im Kalender (DayPicker) auswählbar
- [x] Interaktive Karte mit Standortmarkern
- [x] Speicherung der Reisen in Firestore
- [x] Bearbeitung direkt aus der Oberfläche
- [x] Responsive Design für alle Bildschirmgrößen

 🛠️ Tech Stack
**Frontend:** React 19, Vite, TailwindCSS, Framer Motion, React Router  
**State Management:** Redux Toolkit  
**Formulare & Validierung:** React Hook Form, Zod  
**Datenbank & Authentifizierung:** Firebase Auth + Firestore  
**Wetterdaten:** OpenWeather API  
**Karten:** Leaflet + React-Leaflet  
**Weitere Tools:** Axios, UUID, Recharts, dotenv

 🔧 Lokale Installation
```bash
git clone https://github.com/eugen-1988/weather-trip-planner.git
cd weather-trip-planner
npm install
npm run dev

[Live Demo](https://weather-trip-planner-xi.vercel.app/)


📁 Projektstruktur
/components – Wiederverwendbare UI-Komponenten (Weather, Map, Calendar)

/pages – Hauptseiten: TripPlanner, MyTrips

/store – Redux States (auth, trips, weather, location)

/hooks – Eigene Hooks (z. B. useInitLocation)

/lib – Utilities: Wetterformatierung, Validierung, API-Requests

📌 Warum dieses Projekt relevant ist
Dieses Projekt zeigt meine Fähigkeit, moderne Frontend-Technologien mit APIs und Cloud-Diensten zu kombinieren. Ich habe alle Bereiche – von UI über Zustand bis Datenhaltung – selbst konzipiert und umgesetzt. Es unterstreicht meine Erfahrung im Fullstack-Bereich mit Fokus auf Struktur, Benutzererlebnis und moderne Tools.

🚀 Deployment
Deploy über Vercel. Sicherheitsrelevante Keys werden in .env Dateien verwaltet.



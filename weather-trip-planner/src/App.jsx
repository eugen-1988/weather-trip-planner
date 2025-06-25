import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Welcome from "./components/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

import TripPlanner from "./pages/TripPlanner";
import MyTrips from "./pages/MyTrips";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Welcome>
              <Login />
            </Welcome>
          }
        />
        <Route
          path="/login"
          element={
            <Welcome>
              <Login />
            </Welcome>
          }
        />
        <Route
          path="/register"
          element={
            <Welcome>
              <Register />
            </Welcome>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;

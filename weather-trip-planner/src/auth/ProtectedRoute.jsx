// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

 
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;

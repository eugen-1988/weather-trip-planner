// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bun venit, {currentUser?.displayName || currentUser?.email}!
      </h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

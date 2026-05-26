// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212121]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#10a37f] border-t-transparent animate-spin" />
          <span className="text-[#8e8ea0] font-semibold text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
}
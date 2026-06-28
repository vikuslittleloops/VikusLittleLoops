import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#15101a] text-blush-200">
        <div className="flex flex-col items-center gap-4">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-blush-400/30 border-t-blush-400" />
          <span className="font-serif text-lg">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

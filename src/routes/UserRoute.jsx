import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export default function UserRoute({ children }) {
  const { isAuthenticated, loading } = useUserAuth();

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

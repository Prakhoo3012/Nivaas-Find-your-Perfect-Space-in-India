import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wrap any route that requires login.
 * While session is loading → spinner
 * Not logged in → redirect to /auth
 * Logged in → render children
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--d-bg)",
      }}>
        <div style={{
          width: 32, height: 32, border: "3px solid rgba(200,169,110,0.2)",
          borderTopColor: "var(--gold)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

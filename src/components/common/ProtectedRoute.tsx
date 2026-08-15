import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";

const getAccessToken = () =>
  sessionStorage.getItem("accessToken") ?? localStorage.getItem("accessToken");

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Gate for signed-in-only pages. Without an access token the user never sees
 * the page — they're sent home instead of to /login, so a guest browsing the
 * site isn't dropped into an auth wall they didn't ask for.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const hasToken = Boolean(getAccessToken());
  const isAuthed = hasToken && Boolean(user);

  // A token with no user (or vice versa) means the persisted session is
  // half-torn — clear it so the next sign-in starts clean.
  const cleanedUp = useRef(false);
  useEffect(() => {
    if (isAuthed || cleanedUp.current) return;
    cleanedUp.current = true;
    if (hasToken || user) logout();
    toast.error("Please sign in to view that page.");
  }, [isAuthed, hasToken, user, logout]);

  if (!isAuthed) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

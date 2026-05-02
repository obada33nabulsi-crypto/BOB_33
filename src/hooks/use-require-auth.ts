import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/store/auth";

/** Redirects to /login if the user isn't authenticated. */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return isAuthenticated;
}

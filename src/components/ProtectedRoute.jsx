"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Loading from "./loading/Loading";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.log("[ProtectedRoute] No session found, redirecting to /");
          setIsAuthenticated(false);
          router.replace("/");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("[ProtectedRoute] Auth check failed:", error);
        setIsAuthenticated(false);
        router.replace("/");
      }
    };

    checkAuth();

    // Set up real-time listener for auth state changes (logout from other tabs)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        `[ProtectedRoute] Auth state changed: ${event}`,
        session ? "logged in" : "logged out",
      );

      if (event === "SIGNED_OUT" || !session) {
        console.log("[ProtectedRoute] User signed out, redirecting");
        setIsAuthenticated(false);
        router.replace("/");
      } else if (event === "SIGNED_IN") {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (isAuthenticated === null) {
    return <Loading name="Authentication" />;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return children;
}

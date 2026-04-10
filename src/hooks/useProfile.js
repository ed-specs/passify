import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoadingProfile(true);
        setError(null);

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user:", userError);
          setError("Failed to get user");
          return;
        }

        if (!user) {
          console.log("No user session found");
          setProfile(null);
          return;
        }

        // Fetch profile data
        const data = await authService.getProfile(user.id);

        // Format the data to match your component's needs
        setProfile({
          fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: user.email,
          profileImage: data.avatar_url || "/images/default-profile.png",
          phone: data.phone || "Add phone number",
          address: data.address || "Add address",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error?.message || "Failed to fetch profile");
        setProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  return { profile, isLoadingProfile, error, setProfile };
}

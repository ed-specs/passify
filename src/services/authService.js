import { supabase } from "@/lib/supabase";

export const authService = {
  // sign up function
  async signUp({ email, password, firstName, lastName }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData?.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
        },
      ]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  // sign in function
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // update user profile
  async updateProfile(
    userId,
    { fullName, phone, address, profileImage, imageFile },
  ) {
    let finalImageUrl = profileImage;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        avatar_url: finalImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    return { finalImageUrl };
  },

  // sign out function
  async logout() {
    const { error } = await supabase.auth.signOut({
      scope: "global", // Sign out from all devices
    });
    if (error) throw error;
  },
};

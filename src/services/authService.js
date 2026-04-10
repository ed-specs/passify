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

  // sign out function

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

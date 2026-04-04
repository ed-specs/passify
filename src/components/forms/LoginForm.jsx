"use client";

import { useState } from "react";
import SignInInputField from "../input-fields/SignInInputField";
import LoginButton from "../buttons/LoginButton";

export default function LoginForm({ onAuthSuccess, onAuthError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    setError(false);

    try {
      // --- HERE IS WHERE YOUR SUPABASE LOGIC GOES ---
      // For now, let's pretend it takes 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = true; // Pretend Supabase said YES

      if (isSuccess) {
        // 2. CALL THE "WALKIE-TALKIE"
        // This tells the Home page: "Hey, show the success toaster!"
        onAuthSuccess("Welcome back! Logging you in...");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(true);
      // This tells the Home page: "Hey, show the error toaster!"
      onAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* email */}
        <SignInInputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          isLoading={isLoading}
          error={error}
        />
        {/* password */}
        <SignInInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          isLoading={isLoading}
          error={error}
        />
      </div>
      <LoginButton isLoading={isLoading} />
    </form>
  );
}

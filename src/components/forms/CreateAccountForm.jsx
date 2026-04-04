"use client";

import { useState } from "react";
import CreateAccountInputField from "../input-fields/CreateAccountInputField";
import CreateAccountButton from "../buttons/CreateAccountButton";

export default function CreateAccountForm({
  onCreateAccountSuccess,
  onCreateAccountError,
}) {
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
        onCreateAccountSuccess("Account created successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(true);
      // This tells the Home page: "Hey, show the error toaster!"
      onCreateAccountError(
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* first name */}
          <CreateAccountInputField
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            isLoading={isLoading}
            error={error}
          />
          {/* last name */}
          <CreateAccountInputField
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            isLoading={isLoading}
            error={error}
          />
        </div>
        {/* email */}
        <CreateAccountInputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          isLoading={isLoading}
          error={error}
        />
        {/* password */}
        <CreateAccountInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          isLoading={isLoading}
          error={error}
        />
        {/* confirm password */}
        <CreateAccountInputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          isLoading={isLoading}
          error={error}
        />
      </div>
      <CreateAccountButton isLoading={isLoading} />
    </form>
  );
}

"use client";

import { useState } from "react";
import SignInInputField from "../../input-fields/auth-input-fields/SignInInputField";
import LoginButton from "../../buttons/auth-buttons/LoginButton";
import { authService } from "@/services/authService";
import { validators } from "@/lib/validators";
import { getPublicErrorMessage } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";

export default function LoginForm({ onAuthSuccess, onAuthError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Validate inputs
    if (validators.isEmpty(email) || validators.isEmpty(password)) {
      onAuthError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!validators.isValidEmail(email)) {
      onAuthError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      logger.info("Login attempt", { email });
      await authService.signIn({ email, password });

      logger.info("Login successful", { email });
      onAuthSuccess("Welcome back! Logging you in...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(true);
      const publicMessage = getPublicErrorMessage(err);
      logger.warn("Login failed", { email, error: err.message });
      onAuthError(publicMessage);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* password */}
        <SignInInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          isLoading={isLoading}
          error={error}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <LoginButton isLoading={isLoading} />
    </form>
  );
}

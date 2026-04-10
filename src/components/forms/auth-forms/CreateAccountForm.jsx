"use client";

import { useState } from "react";
import CreateAccountInputField from "../../input-fields/auth-input-fields/CreateAccountInputField";
import CreateAccountButton from "../../buttons/auth-buttons/CreateAccountButton";
import PasswordStrengthMeter from "../../password/PasswordStrengthMeter";
import { authService } from "@/services/authService";
import { validators } from "@/lib/validators";
import { getPublicErrorMessage } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";

export default function CreateAccountForm({
  onCreateAccountSuccess,
  onCreateAccountError,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Validate all fields are filled
    if (
      validators.isEmpty(email) ||
      validators.isEmpty(password) ||
      validators.isEmpty(confirmPassword) ||
      validators.isEmpty(firstName) ||
      validators.isEmpty(lastName)
    ) {
      onCreateAccountError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!validators.isValidEmail(email)) {
      onCreateAccountError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Validate name format
    if (!validators.validateName(firstName)) {
      onCreateAccountError(
        "First name must be 2-50 characters (letters, spaces, hyphens, apostrophes only).",
      );
      setIsLoading(false);
      return;
    }

    if (!validators.validateName(lastName)) {
      onCreateAccountError(
        "Last name must be 2-50 characters (letters, spaces, hyphens, apostrophes only).",
      );
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (!validators.validatePasswordsMatch(password, confirmPassword)) {
      onCreateAccountError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (!validators.isStrongPassword(password)) {
      onCreateAccountError(
        "Password must be at least 12 characters and include uppercase, lowercase, numbers, and special characters.",
      );
      setIsLoading(false);
      return;
    }

    try {
      logger.info("Account creation attempt", { email });
      await authService.signUp({
        email,
        password,
        firstName,
        lastName,
      });

      logger.info("Account created successfully", { email });
      onCreateAccountSuccess(
        "Account created successfully! Redirecting to Login...",
      );

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(true);
      const publicMessage = getPublicErrorMessage(err);
      logger.warn("Account creation failed", { email, error: err.message });
      onCreateAccountError(publicMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* first name */}
          <CreateAccountInputField
            label="First Name"
            type="text"
            name="firstName"
            value={firstName}
            placeholder="Enter your first name"
            isLoading={isLoading}
            error={error}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {/* last name */}
          <CreateAccountInputField
            label="Last Name"
            type="text"
            name="lastName"
            value={lastName}
            placeholder="Enter your last name"
            isLoading={isLoading}
            error={error}
            onChange={(e) => setLastName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* password */}
        <CreateAccountInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          isLoading={isLoading}
          error={error}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Password strength meter */}
        {password && <PasswordStrengthMeter password={password} />}

        {/* confirm password */}
        <CreateAccountInputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          isLoading={isLoading}
          error={error}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <CreateAccountButton isLoading={isLoading} />
    </form>
  );
}

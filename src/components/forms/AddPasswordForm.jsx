"use client";

import { useState } from "react";
import AddNewPasswordInputField from "../input-fields/AddNewPasswordInputField";
import AddPasswordButton from "../buttons/add-new-password/AddPasswordButton";

export default function AddPasswordForm({
  onAddPasswordSuccess,
  onAddPasswordError,
}) {
  const [accountTitle, setAccountTitle] = useState("");
  const [accountCategory, setAccountCategory] = useState("");
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      // --- HERE IS WHERE YOUR SUPABASE LOGIC GOES ---
      // For now, let's pretend it takes 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = true; // Pretend Supabase said YES

      if (isSuccess) {
        // 2. CALL THE "WALKIE-TALKIE"
        // This tells the Home page: "Hey, show the success toaster"
        onAddPasswordSuccess("New password added successfully!");
      } else {
        throw new Error("Failed to save password. Please try again.");
      }
    } catch (err) {
      setError(true);
      // This tells the Home page: "Hey, show the error toaster!"
      onAddPasswordError(
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddPassword} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* email */}
        <AddNewPasswordInputField
          label="Website / App"
          type="text"
          name="accountTitle"
          placeholder="Enter website or app"
          isLoading={isLoading}
          error={error}
          value={accountTitle}
          onChange={(e) => setAccountTitle(e.target.value)}
        />
        {/* email */}
        <AddNewPasswordInputField
          label="Category"
          type="text"
          name="account Category"
          placeholder="Enter your account name"
          isLoading={isLoading}
          error={error}
          value={accountCategory}
          onChange={(e) => setAccountCategory(e.target.value)}
        />
        {/* email */}
        <AddNewPasswordInputField
          label="Account Name"
          type="text"
          name="accountName"
          placeholder="Enter your account name"
          isLoading={isLoading}
          error={error}
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        {/* password */}
        <AddNewPasswordInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          isLoading={isLoading}
          error={error}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* note */}
        <AddNewPasswordInputField
          label="Note"
          type="textarea"
          name="note"
          placeholder="Enter a note about this password"
          isLoading={isLoading}
          error={error}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <AddPasswordButton isLoading={isLoading} />
    </form>
  );
}

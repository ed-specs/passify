"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import the icons

export default function CreateAccountInputField({
  label,
  type = "text",
  name,
  placeholder,
  error,
  isLoading,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Determine if we should show the toggle icon
  const isPassword = type === "password";

  // Decide the actual input type to show the browser
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-500">{label}</label>

      <div className="relative w-full">
        <input
          type={inputType}
          placeholder={placeholder}
          name={name}
          disabled={isLoading}
          className={`w-full px-4 py-2 pr-12 rounded-lg border outline-none transition-colors duration-150
            ${isLoading ? "bg-gray-200 cursor-not-allowed text-gray-400" : "bg-white"}
            ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-900 placeholder:text-gray-500"}`}
        />

        {isPassword && !isLoading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-150"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

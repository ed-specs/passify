"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AddNewPasswordInputField({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  isLoading,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isTextArea = type === "textarea";
  const inputType = isPassword && showPassword ? "text" : type;

  // Define common classes to keep code clean
  const sharedClasses = `w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-colors duration-150
    ${isLoading ? "bg-gray-200 cursor-not-allowed text-gray-400" : "bg-white"}
    ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-900 placeholder:text-gray-500"}`;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-500">{label}</label>

      <div className="relative w-full">
        {isTextArea ? (
          /* USE TEXTAREA FOR MULTI-LINE NOTES */
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={isLoading}
            className={`${sharedClasses} h-24 resize-none py-3`} // py-3 helps align the starting text nicely
          />
        ) : (
          /* USE INPUT FOR EVERYTHING ELSE */
          <input
            type={inputType}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            disabled={isLoading}
            className={`${sharedClasses} pr-12`}
          />
        )}

        {isPassword && !isLoading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

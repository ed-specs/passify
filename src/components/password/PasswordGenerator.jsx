"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";

    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.special) chars += special;

    if (chars.length === 0) {
      logger.warn("No character types selected for password generation");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(newPassword);
    logger.info("Password generated", { length });
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      logger.info("Password copied to clipboard");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy password", { error: err.message });
    }
  };

  const toggleOption = (option) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Password Generator</h2>

      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={handleCopy}
            disabled={!password}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} />
            Generate
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8 characters</span>
          <span>128 characters</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Character Types</h3>

        {[
          { key: "uppercase", label: "Uppercase (A-Z)" },
          { key: "lowercase", label: "Lowercase (a-z)" },
          { key: "numbers", label: "Numbers (0-9)" },
          { key: "special", label: "Special (!@#$%^&*)" },
        ].map((option) => (
          <label
            key={option.key}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={options[option.key]}
              onChange={() => toggleOption(option.key)}
              className="w-4 h-4"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-4">
        💡 Tip: Use passwords with uppercase, lowercase, numbers, and special
        characters for maximum security.
      </p>
    </div>
  );
}

"use client";

import { validators } from "@/lib/validators";
import { AlertCircle, Check } from "lucide-react";

export default function PasswordStrengthMeter({ password = "" }) {
  const strength = validators.getPasswordStrength(password);
  const label = validators.getPasswordStrengthLabel(strength);

  const requirements = [
    {
      label: "At least 12 characters",
      met: password.length >= 12,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      met: /[0-9]/.test(password),
    },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const getStrengthColor = (str) => {
    if (str < 30) return "bg-red-500";
    if (str < 60) return "bg-yellow-500";
    if (str < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthTextColor = (str) => {
    if (str < 30) return "text-red-600";
    if (str < 60) return "text-yellow-600";
    if (str < 80) return "text-blue-600";
    return "text-green-600";
  };

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Password Strength</span>
          <span
            className={`text-sm font-bold ${getStrengthTextColor(strength)}`}
          >
            {label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2 p-4 rounded-lg border border-gray-300 bg-gray-50">
        <p className="text-sm font-medium text-gray-500">Requirements:</p>
        <div className="space-y-1">
          {requirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              {req.met ? (
                <Check className="size-4 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="size-4 text-gray-300 shrink-0" />
              )}
              <span className={req.met ? "text-gray-600" : "text-gray-400"}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

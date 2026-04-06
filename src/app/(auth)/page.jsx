"use client";

import LoginForm from "@/components/forms/auth-forms/LoginForm";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { useState } from "react";

export default function SignInPage() {
  const [showToaster, setShowToaster] = useState(false);
  const [toasterData, setToasterData] = useState({
    type: "success",
    message: "Login successful!",
  });

  const displayToaster = (type, message) => {
    setToasterData({ type, message });
    setShowToaster(true);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center p-4">
      <div className="sm:p-5 rounded-2xl  w-full max-w-lg flex flex-col gap-6">
        {/* header */}
        <div className="flex flex-col gap-3">
          {/* Logo here */}
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-2xl  font-bold">Welcome to Passify</h1>
            <span className="text-gray-500">Sign in to your account</span>
          </div>
        </div>
        {/* form */}
        <LoginForm
          onAuthSuccess={(msg) => displayToaster("success", msg)}
          onAuthError={(msg) => displayToaster("error", msg)}
        />
      </div>

      {/* toaster message here */}
      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </div>
  );
}

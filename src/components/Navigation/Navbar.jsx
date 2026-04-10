"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { useState } from "react";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Password Vault", href: "/password-vault" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showToaster, setShowToaster] = useState(false);
  const [toasterData, setToasterData] = useState({
    type: "success",
    message: "Logging out...",
  });

  const displayToaster = (type, message) => {
    setToasterData({ type, message });
    setShowToaster(true);
    setTimeout(() => {
      setShowToaster(false);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      displayToaster("success", "Logged out successfully!");

      // Clear any client-side cached data
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }

      // Wait a bit for cookies to be cleared, then navigate
      setTimeout(() => {
        router.push("/");
        // Use window.location for a hard refresh to clear all cached state
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }, 1500);
    } catch (error) {
      displayToaster("error", error?.message || "Logout failed");
    }
  };

  return (
    <>
      <div className=" hidden md:flex items-center gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm ${
                isActive
                  ? "bg-gray-800 hover:bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="cursor-pointer px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm text-red-500 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </>
  );
}

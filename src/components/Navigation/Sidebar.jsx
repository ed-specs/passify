"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Vault,
  Settings,
  CircleUserRound,
  X,
} from "lucide-react";
import { authService } from "@/services/authService";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { useState } from "react";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Password Vault", href: "/password-vault", icon: Vault }, // Added missing icon
  { label: "Profile", href: "/profile", icon: CircleUserRound },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
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
      {/* 1. THE BACKDROP (The Dark Overlay) */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden
          ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* 2. THE SIDEBAR PANEL */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 p-5 text-white shadow-2xl 
        transition-transform duration-300 ease-in-out lg:hidden
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col justify-between h-full ">
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2.5 text-gray-500 hover:text-white transition-colors"
          >
            <X className="size-6" />
          </button>

          {/* Top Section */}
          <div className="flex flex-col gap-6">
            <div className="flex pt-2 px-2">
              <h1 className="text-xl font-bold tracking-tight">Passify</h1>
            </div>

            <nav className="flex flex-col gap-1">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleSidebar} // Close sidebar when navigating
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-800 text-white shadow-inner"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="">
            <button
              onClick={handleLogout}
              className="cursor-pointer flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 transition-all hover:bg-red-500/10 hover:text-red-500 border-none bg-transparent"
            >
              <X className="size-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>
      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </>
  );
}

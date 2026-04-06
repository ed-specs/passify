"use client";

import { Copy } from "lucide-react";

export default function PasswordCard({
  passwordData,
  toggleViewPasswordModal,
}) {
  return (
    <div
      onClick={toggleViewPasswordModal}
      className="col-span-3 text-sm md:text-base sm:col-span-1 p-4 rounded-2xl border border-gray-300 bg-white flex items-center gap-4 hover:shadow-md transition-shadow duration-150 cursor-pointer"
    >
      {/* icon */}
      <div className="size-10 rounded-full bg-pink-500"></div>
      {/* title and description */}
      <div className="flex flex-1 flex-col min-w-0">
        <h3 className="font-medium text-sm md:text-base">
          {passwordData.title || "Title (e.g. Google Account)"}
        </h3>
        <span className="text-gray-500 text-sm truncate">
          {passwordData.account || "Email / username here"}
        </span>
      </div>
      {/* copy button */}
      <div className="flex ">
        <button className="rounded-full cursor-pointer flex items-center justify-center p-2.5 bg-gray-100 active:bg-gray-200 transition-colors duration-150">
          <Copy className="size-5 sm:size-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/header/Header";
import { useState } from "react";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="relative container mx-auto min-h-dvh ">
      <div className="flex flex-1 flex-col items-center gap-4 md:gap-6 p-4 md:p-5">
        {/* header / nav */}
        <Header toggleSidebar={toggleSidebar} />

        {/* main */}
        <div className="flex w-full max-w-7xl">
          <div className="flex flex-col gap-4 flex-1"></div>
        </div>
      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
}

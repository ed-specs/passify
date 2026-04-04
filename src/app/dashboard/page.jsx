"use client";

import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/header/Header";
import { useState } from "react";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="relative container mx-auto min-h-dvh ">
      <div className="flex flex-1 flex-col gap-4">
        {/* header / nav */}
        <Header toggleSidebar={toggleSidebar} />

        {/* main */}
      </div>
      {isSidebarOpen && (
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </div>
  );
}

"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/header/Header";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { useState } from "react";

function DashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterData, setToasterData] = useState({
    type: "success",
    message: "Success!",
  });

  const displayToaster = (type, message) => {
    setToasterData({ type, message });
    setShowToaster(true);
    setTimeout(() => {
      setShowToaster(false);
    }, 5000);
  };

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
      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

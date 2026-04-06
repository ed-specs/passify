"use client";

import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/header/Header";
import SearchBarInputField from "@/components/input-fields/SearchBarInputField";
import PasswordCard from "@/components/cards/password-card/PasswordCard";
import ViewPasswordModal from "@/components/modals/ViewPasswordModal";
import NoPasswordFound from "@/components/no-found/NoPasswordFound";
import AddPasswordModal from "@/components/modals/AddPasswordModal";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { ListFilter, X, FileText } from "lucide-react";
import { useState } from "react";
import AddPasswordModalButton from "@/components/buttons/add-new-password/AddPasswordModalButton";

const MOCK_PASSWORDS = [
  { id: 1, title: "Google", account: "user@gmail.com" },
  { id: 2, title: "Facebook", account: "user@facebook.com" },
  { id: 3, title: "Twitter", account: "user@twitter.com" },
];

export default function PasswordVaultPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [toggleAddPassword, setToggleAddPassword] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [toasterData, setToasterData] = useState({
    type: "success",
    message: "Login successful!",
  });

  const displayToaster = (type, message) => {
    setToasterData({ type, message });
    setShowToaster(true);

    // Hide the toaster after 3 seconds
    setTimeout(() => {
      setShowToaster(false);
    }, 5000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleFilterOptions = () => {
    setToggleFilter((prev) => !prev);
  };

  const toggleAddPasswordModal = () => {
    setToggleAddPassword((prev) => !prev);
  };

  const handlePasswordCardClick = (passwordData) => {
    setSelectedPassword(passwordData);
  };
  const handleViewPasswordCloseModal = () => setSelectedPassword(null);
  const handleAddPasswordCloseModal = () => setToggleAddPassword(false);

  const searchPassword = MOCK_PASSWORDS.filter((password) => {
    const titleMatch = password.title
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());
    const accountMatch = password.account
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());
    return titleMatch || accountMatch;
  });

  return (
    <div className="relative container mx-auto min-h-dvh ">
      <div className="flex flex-1 flex-col items-center gap-4 md:gap-6 p-4 md:p-5">
        {/* header / nav */}
        <Header toggleSidebar={toggleSidebar} />

        {/* main */}
        <div className="flex w-full max-w-7xl">
          {/* tallys / search / filter */}
          <div className="flex flex-col gap-6 flex-1">
            {/* search and filter */}
            <div className="relative flex items-center gap-3 justify-between">
              {/* search bar */}
              <SearchBarInputField
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for passwords..."
                name="search"
              />
              {/* filter */}
              <div className="block">
                <button
                  onClick={toggleFilterOptions}
                  className="flex text-sm items-center gap-3 p-2.5 md:px-4 md:py-2.5 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-900 text-white md:border-gray-300 md:bg-white hover:md:bg-gray-100 md:text-gray-900 cursor-pointer transition-colors duration-150 "
                >
                  {toggleFilter ? (
                    <>
                      <X className="size-6 sm:size-5" />
                      <span className="hidden md:inline-block">
                        Close filter
                      </span>
                    </>
                  ) : (
                    <>
                      <ListFilter className="size-6 sm:size-5" />
                      <span className="hidden md:inline-block">
                        Filter options
                      </span>
                    </>
                  )}
                </button>

                {/* to be implemented */}
                {toggleFilter && (
                  <div className="absolute mt-3 right-0 w-full max-w-md border border-gray-300 bg-white rounded-2xl p-5 z-10 text-sm">
                    No Data Yet.
                  </div>
                )}
              </div>
            </div>

            {/* list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-500">Your password</h2>
                <AddPasswordModalButton onClick={toggleAddPasswordModal} />
              </div>

              {searchPassword.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {searchPassword.map((password) => (
                    <PasswordCard
                      key={password.id}
                      passwordData={password}
                      toggleViewPasswordModal={() =>
                        handlePasswordCardClick(password)
                      }
                    />
                  ))}
                </div>
              ) : (
                <NoPasswordFound />
              )}
            </div>
          </div>
        </div>
      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {selectedPassword && (
        <ViewPasswordModal
          passwordData={selectedPassword}
          handleViewPasswordCloseModal={handleViewPasswordCloseModal}
          onUpdatePasswordSuccess={(msg) => displayToaster("success", msg)}
          onUpdatePasswordError={(msg) => displayToaster("error", msg)}
          onHandleDeletePasswordSuccess={(msg) => {
            displayToaster("success", msg);
            handleViewPasswordCloseModal();
          }}
          onHandleDeletePasswordError={(msg) => displayToaster("error", msg)}
        />
      )}

      {toggleAddPassword && (
        <AddPasswordModal
          handleAddPasswordCloseModal={handleAddPasswordCloseModal}
          onAddPasswordSuccess={(message) => {
            displayToaster("success", message);
            handleAddPasswordCloseModal();
          }}
          onAddPasswordError={(message) => displayToaster("error", message)}
        />
      )}

      {/* toaster message here */}
      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </div>
  );
}

"use client";

import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/header/Header";
import EditProfileButton from "@/components/buttons/EditProfileButton";
import ToasterMessage from "@/components/toaster/ToasterMessage";
import { useRef, useState } from "react";

const initialProfile = {
  fullName: "Edward C. Gatbonton",
  email: "edwardgatbonton13@gmail.com",
  profileImage: "/images/default-profile.png",
  phone: "+63 912 345 6789",
  address: "Poblacion 4, Victoria, Oriental Mindoro",
};

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterData, setToasterData] = useState({
    type: "success",
    message: "",
  });
  const fileInputRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const displayToaster = (type, message) => {
    setToasterData({ type, message });
    setShowToaster(true);

    setTimeout(() => {
      setShowToaster(false);
    }, 5000);
  };

  const toggleEditProfile = () => {
    if (isEditing) {
      setFormData(profileData);
      setError(false);
    }
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result || "/images/default-profile.png";
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const isSuccess = true;

      if (isSuccess) {
        setProfileData(formData);
        setIsEditing(false);
        displayToaster("success", "Profile updated successfully!");
      } else {
        throw new Error("Unable to update profile. Please try again.");
      }
    } catch (err) {
      setError(true);
      displayToaster(
        "error",
        err.message || "Unable to update profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative container mx-auto min-h-dvh ">
      <div className="flex flex-1 flex-col items-center gap-4 md:gap-6 p-4 md:p-5">
        {/* header / nav */}
        <Header toggleSidebar={toggleSidebar} />

        {/* main */}
        <div className="flex w-full max-w-7xl">
          <div className="flex flex-col gap-6 flex-1 items-center">
            <div className="w-full max-w-lg flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center gap-4 mt-2">
                {/* profile */}
                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  disabled={!isEditing}
                  className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition hover:opacity-90"
                >
                  <img
                    src={
                      isEditing
                        ? formData.profileImage
                        : profileData.profileImage
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  {isEditing && (
                    <span className="cursor-pointer absolute inset-0 bg-black/20 flex items-center justify-center text-xs text-white opacity-0 transition hover:opacity-100">
                      Change
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />

                {/* name and email */}
                <div className="flex flex-col justify-center items-center min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {profileData.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {profileData.email}
                  </p>
                </div>
                {/* update button */}
                <div className="">
                  <EditProfileButton
                    onClick={toggleEditProfile}
                    label={isEditing ? "Cancel edit" : "Edit profile"}
                  />
                </div>
              </div>

              {/* profile information */}
              <div className="flex flex-col gap-4">
                <form onSubmit={handleUpdateProfile} className="grid gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Full name</label>
                    {isEditing ? (
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={` w-full rounded-lg border border-gray-300  px-4 py-2.5 text-sm min-w-0 truncate outline-none transition focus:border-gray-900
                          ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                      />
                    ) : (
                      <div className=" rounded-lg bg-gray-50 px-4 py-2.5 text-sm min-w-0 truncate ">
                        {profileData.fullName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Email</label>
                    {isEditing ? (
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={` w-full rounded-lg border border-gray-300  px-4 py-2.5 text-sm min-w-0 truncate outline-none transition focus:border-gray-900
                          ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                      />
                    ) : (
                      <div className=" rounded-lg bg-gray-50 px-4 py-2.5 text-sm min-w-0 truncate ">
                        {profileData.email}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    {isEditing ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={` w-full rounded-lg border border-gray-300  px-4 py-2.5 text-sm min-w-0 truncate outline-none transition focus:border-gray-900
                          ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                      />
                    ) : (
                      <div className=" rounded-lg bg-gray-50 px-4 py-2.5 text-sm min-w-0 truncate ">
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Address</label>
                    {isEditing ? (
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={` w-full rounded-lg border border-gray-300  px-4 py-2.5 text-sm min-w-0 truncate outline-none transition focus:border-gray-900
                          ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                      />
                    ) : (
                      <div className=" rounded-lg bg-gray-50 px-4 py-2.5 text-sm min-w-0 truncate ">
                        {profileData.address}
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">
                      Something went wrong while updating. Please try again.
                    </p>
                  )}

                  {isEditing && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm min-w-0 truncate font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading ? "Updating..." : "Update"}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* sign out button */}
            </div>
          </div>
        </div>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {showToaster && (
        <ToasterMessage type={toasterData.type} message={toasterData.message} />
      )}
    </div>
  );
}

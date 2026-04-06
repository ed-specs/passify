"use client";

import UpdatePasswordInputFields from "../input-fields/update-password-input-fields/UpdatePasswordInputFields";
import { X, Eye, EyeOff, Delete } from "lucide-react";
import { useState } from "react";
import DeletePasswordModal from "./DeletePasswordModal";

export default function ViewPasswordModal({
  passwordData,
  handleViewPasswordCloseModal,
  onUpdatePasswordSuccess,
  onUpdatePasswordError,
  onHandleDeletePasswordSuccess,
  onHandleDeletePasswordError,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    title: passwordData.title,
    account: passwordData.account,
    password: passwordData.password,
    notes: passwordData.notes,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    // 1. Start Loading
    setIsLoading(true);
    setError(false);

    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = true;

      if (isSuccess) {
        // 2. Call the "Success" relay baton from the parent
        onUpdatePasswordSuccess("Password updated successfully!");
        setIsEditing(false); // Switch back to view mode
      } else {
        throw new Error("Failed to update.");
      }
    } catch (err) {
      setError(true);
      // 3. Call the "Error" relay baton from the parent
      onUpdatePasswordError(err.message || "Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleDeleteModal = () => {
    setToggleDelete((prev) => !prev);
  };

  const handleDeleteModalClose = () => {
    setToggleDelete(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 ">
      <div className="p-4 sm:p-5 rounded-2xl bg-white flex flex-col relative gap-6 w-full max-w-lg">
        {/* header */}
        <div className="flex items-center flex-col pt-2 gap-3">
          {/* icon */}
          <div className="size-16 rounded-full bg-pink-500"></div>
          {/* title & category */}
          <div className="flex flex-col items-center text-center ">
            <h1 className="text-xl font-semibold">{passwordData.title}</h1>
            <span className="text-sm text-gray-500">Category</span>
          </div>
        </div>
        {/* main */}
        <div className="flex flex-col gap-3">
          {isEditing ? (
            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-3"
            >
              <UpdatePasswordInputFields
                label="Account Name"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                isLoading={isLoading}
              />
              <UpdatePasswordInputFields
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                isLoading={isLoading}
              />
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-gray-500">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-gray-900 min-h-24 resize-none  ${isLoading ? "bg-gray-200 cursor-not-allowed text-gray-400" : "bg-white"}`}
                />
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Account name</span>
                <div className="px-4 py-2.5 rounded-lg bg-gray-50 min-w-0 flex items-center">
                  <span className="text-sm font-medium truncate">
                    {formData.account}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Account password</span>
                <div className="px-4 py-2.5 rounded-lg bg-gray-50 min-w-0 flex items-center justify-between">
                  <span className="text-sm font-medium truncate ">
                    {showPassword ? formData.password : "•••••••••••"}
                  </span>
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Notes</span>
                <div className="px-4 py-2.5 rounded-lg bg-gray-50 h-24">
                  <span className="text-sm font-medium truncate">
                    {formData.notes || "No additional notes."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 gap-2">
          <button
            disabled={isLoading} // PREVENT CLICKING
            className={`w-full px-4 py-2.5 rounded-lg text-white text-sm transition-colors cursor-pointer
      ${isLoading ? "bg-gray-300 cursor-not-allowed" : isEditing ? "bg-gray-400 hover:bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
            onClick={() =>
              isEditing ? setIsEditing(false) : toggleDeleteModal()
            }
          >
            {isEditing ? "Cancel" : "Delete"}
          </button>

          <button
            disabled={isLoading} // PREVENT CLICKING
            onClick={() =>
              isEditing ? handleUpdatePassword() : setIsEditing(true)
            }
            className="w-full cursor-pointer px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEditing ? (isLoading ? "Saving..." : "Save Changes") : "Update"}
          </button>
        </div>

        <button
          onClick={handleViewPasswordCloseModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors duration-150"
        >
          <X className="size-5" />
        </button>

        {isEditing && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center justify-center bg-green-500">
            <span className="text-xs text-white font-medium">Edit mode</span>
          </div>
        )}

        {toggleDelete && (
          <DeletePasswordModal
            handleDeleteModalClose={handleDeleteModalClose}
            onHandleDeletePasswordSuccess={onHandleDeletePasswordSuccess}
            onHandleDeletePasswordError={onHandleDeletePasswordError}
          />
        )}
      </div>
    </div>
  );
}

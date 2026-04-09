import { useState } from "react";

export default function DeletePasswordModal({
  handleDeleteModalClose,
  onHandleDeletePasswordSuccess,
  onHandleDeletePasswordError,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDeletePassword = async () => {
    setIsLoading(true);
    setError(false);

    try {
      // Simulate API call or Supabase delete logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = true; // Replace with real delete response

      if (isSuccess) {
        handleDeleteModalClose();
        onHandleDeletePasswordSuccess("Password deleted successfully!");
      } else {
        throw new Error("Failed to delete password. Please try again.");
      }
    } catch (err) {
      setError(true);
      handleDeleteModalClose();
      onHandleDeletePasswordError(
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-60 p-4 ">
      <div className="p-4 sm:p-5 rounded-2xl bg-white flex flex-col relative gap-6 w-full max-w-md">
        {/* header */}
        <div className="flex items-center flex-col pt-2 gap-3">
          {/* icon */}
          {/* title & category */}
          <div className="flex flex-col items-center text-center ">
            <h1 className="text-xl font-semibold">Delete Password</h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this password? This action cannot be
            undone.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteModalClose}
            disabled={isLoading}
            className="w-full cursor-pointer px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeletePassword}
            disabled={isLoading}
            className="w-full cursor-pointer px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

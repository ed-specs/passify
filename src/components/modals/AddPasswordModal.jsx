import AddPasswordForm from "../forms/AddPasswordForm";
import { X } from "lucide-react";

export default function AddPasswordModal({
  handleAddPasswordCloseModal,
  onAddPasswordSuccess,
  onAddPasswordError,
}) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 ">
      <div className="p-4 sm:p-5 rounded-2xl bg-white flex flex-col relative gap-6 w-full max-w-lg">
        {/* header */}
        <div className="flex items-center flex-col pt-2 gap-3">
          {/* icon */}
          {/* title & category */}
          <div className="flex flex-col items-center text-center ">
            <h1 className="text-xl font-semibold">Add New Password</h1>
          </div>
        </div>
        {/* main */}
        <AddPasswordForm
          onAddPasswordSuccess={onAddPasswordSuccess}
          onAddPasswordError={onAddPasswordError}
        />

        <button
          onClick={handleAddPasswordCloseModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors duration-150"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}

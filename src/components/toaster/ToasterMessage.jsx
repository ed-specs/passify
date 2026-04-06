import { CheckCircle, AlertCircle } from "lucide-react";

export default function ToasterMessage({ type, message }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white fixed top-4 right-4 shadow-2xl z-100 animate-in fade-in slide-in-from-top-4 duration-300
        ${isSuccess ? "bg-green-500" : "bg-red-500"}
      `}
    >
      {/* 2. Add dynamic icons for better UX */}
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}

      <span className="font-medium text-sm">
        {message ||
          (isSuccess ? "Operation successful!" : "An error occurred.")}
      </span>
    </div>
  );
}

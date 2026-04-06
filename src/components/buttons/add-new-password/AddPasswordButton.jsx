export default function AddPasswordButton({ isLoading }) {
  return (
    <div className="flex  mt-2">
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-4 py-2.5 rounded-lg text-sm  text-white cursor-pointer transition-colors duration-150
            ${isLoading ? "bg-gray-700 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}`}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? "Saving password..." : "Save password"}
        </div>
      </button>
    </div>
  );
}

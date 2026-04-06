import Link from "next/link";

export default function CreateAccountButton({ isLoading }) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2.5 rounded-lg text-sm text-white cursor-pointer transition-colors duration-150
            ${isLoading ? "bg-gray-700 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}`}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? "Creating account..." : "Create Account"}
        </div>
      </button>

      <Link
        href="/"
        className="w-full text-center text-sm px-4 py-2.5 rounded-lg text-gray-900 cursor-pointer transition-colors duration-150 hover:bg-gray-200"
      >
        Go back to sign in
      </Link>
    </div>
  );
}

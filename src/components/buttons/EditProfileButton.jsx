export default function EditProfileButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="sm:text-sm py-1.5 px-4 sm:py-2.5 rounded-lg bg-gray-800 hover:bg-gray-900 cursor-pointer text-white font-medium transition-colors duration-150"
    >
      {label}
    </button>
  );
}

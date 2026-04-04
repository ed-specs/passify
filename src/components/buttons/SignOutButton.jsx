import Link from "next/link";

export default function SignOutButton() {
  return (
    <Link
      href="/"
      className="px-4 py-2 rounded-lg text-sm bg-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-150 cursor-pointer"
    >
      Sign out
    </Link>
  );
}

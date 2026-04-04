import { Menu } from "lucide-react";
import Navbar from "@/components/Navigation/Navbar";
import SignOutButton from "@/components/buttons/SignOutButton";

export default function Header({ toggleSidebar }) {
  return (
    <div className="flex items-center justify-between p-4 md:p-5">
      {/* left (logo) */}
      <div className="flex items-center gap-2">
        {/* toggle sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
        >
          <Menu className="size-5" />
        </button>
        {/* text logo */}
        <h1 className="text-xl sm:text-2xl font-bold">Passify</h1>
      </div>
      {/* menus */}
      <Navbar />

      {/* sign out */}
      <div className="hidden md:flex">
        <SignOutButton />
      </div>
    </div>
  );
}

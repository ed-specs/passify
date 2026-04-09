import { Menu } from "lucide-react";
import Navbar from "@/components/Navigation/Navbar";

export default function Header({ toggleSidebar }) {
  return (
    <div className="flex items-center justify-between w-full max-w-7xl">
      {/* left (logo) */}
      <div className="flex items-center gap-2">
        {/* toggle sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
        >
          <Menu className="size-6" />
        </button>
        {/* text logo */}
        <h1 className="text-2xl sm:text-2xl font-bold">Passify</h1>
      </div>
      {/* menus */}
      <Navbar />
    </div>
  );
}

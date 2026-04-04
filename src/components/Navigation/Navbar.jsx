"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Password Vault", href: "/password-vault" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className=" hidden md:flex items-center gap-2">
      {MENU_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-md transition-colors duration-150 text-sm ${
              isActive
                ? "bg-gray-800 hover:bg-gray-900 text-white"
                : "hover:bg-gray-100"
            } `}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

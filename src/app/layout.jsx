import "./globals.css";
import { inter } from "../../public/fonts/font";

export const metadata = {
  title: "Passify",
  description:
    "Password manager app that helps you securely store and manage your passwords with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased text-sm sm:text-base bg-gray-`}
    >
      <body className="">{children}</body>
    </html>
  );
}

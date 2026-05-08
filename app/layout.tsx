import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AM Dashboard | Account Manager",
  description: "Dashboard para Account Manager de agencia de marketing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0f1117] text-white antialiased">{children}</body>
    </html>
  );
}

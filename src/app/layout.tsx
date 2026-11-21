import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "elvora.my",
  description: "Something new is coming to elvora.my.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

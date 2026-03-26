import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourtVision",
  description: "A basketball-themed Next.js landing page inspired by premium product marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

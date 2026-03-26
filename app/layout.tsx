import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JASPER 賽程",
  description: "A basketball-themed Next.js landing page inspired by premium product marketing.",
  icons: {
    icon: "/jasper-logo.jpg",
    shortcut: "/jasper-logo.jpg",
    apple: "/jasper-logo.jpg",
  },
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

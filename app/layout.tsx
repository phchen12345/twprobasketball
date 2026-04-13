import type { Metadata } from "next";
import { AuthProvider } from "./components/auth/AuthProvider";
import "./globals.css";

const siteName = "台灣籃球職業聯賽賽程";
const siteTitle = "台灣籃球職業聯賽賽程 | TPBL、PLG、BCL 賽程整理";
const siteDescription =
  "提供台灣籃球職業聯賽賽程整理，包含 TPBL、PLG 與 BCL Asia-East 賽程、比賽時間、場館與直播資訊。";

export const metadata: Metadata = {
  metadataBase: new URL("https://taiwanprobasketball.vercel.app"),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "台灣籃球職業聯賽賽程",
    "TPBL 賽程",
    "PLG 賽程",
    "BCL 賽程",
    "台灣籃球",
    "職業籃球賽程",
    "籃球直播資訊",
  ],
  authors: [{ name: "JASPER" }],
  creator: "JASPER",
  publisher: "JASPER",
  alternates: {
    canonical: "https://taiwanprobasketball.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://taiwanprobasketball.vercel.app",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

const siteName = "台灣籃球職業聯賽賽程";
const siteDescription =
  "提供台灣籃球職業聯賽賽程整理，包含 TPBL、PLG 與 BCL Asia-East 賽程、比賽時間、場館與直播資訊。";

export const metadata: Metadata = {
  metadataBase: new URL("https://twprobasketball.vercel.app"),
  title: {
    default: `${siteName}｜TPBL、PLG、BCL 賽程整理`,
    template: `%s｜${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "台灣籃球職業聯賽賽程",
    "TPBL賽程",
    "PLG賽程",
    "BCL賽程",
    "台灣職籃賽程",
    "新北國王賽程",
    "桃園領航猿賽程",
    "台灣籃球",
  ],
  authors: [{ name: "JASPER" }],
  creator: "JASPER",
  publisher: "JASPER",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName,
    title: `${siteName}｜TPBL、PLG、BCL 賽程整理`,
    description: siteDescription,
    images: [
      {
        url: "/jasper-logo.jpg",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}｜TPBL、PLG、BCL 賽程整理`,
    description: siteDescription,
    images: ["/jasper-logo.jpg"],
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
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zappy | Vendor Event Tracker",
  description: "Advanced real-time vendor coordination and event execution platform built by Vivek Joshi.",
  authors: [{ name: "Vivek Joshi" }],
  keywords: ["Zappy", "Vendor Tracker", "Event Management", "Next.js", "Vivek Joshi"],
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F172A] selection:bg-indigo-500/30`}
      >
        {children}
      </body>
    </html>
  );
}
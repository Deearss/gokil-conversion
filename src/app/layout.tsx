import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gokil Conversion - Fast PNG to JPG Converter",
  description: "A state-of-the-art client-side MVP simulating Distributed Data Processing by converting PNG files to JPG directly inside your browser without backend interaction.",
  keywords: ["converter", "png to jpg", "data processing", "html5 canvas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

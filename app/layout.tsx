import type { Metadata } from "next";
import { Electrolize } from "next/font/google";
import "./globals.css";

const gothicFont = Electrolize({
  weight: "400", // peso richiesto dal font
  variable: "--font-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarettaxWeb",
  description: "Sito web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gothicFont.variable} antialiased`}>{children}</body>
    </html>
  );
}

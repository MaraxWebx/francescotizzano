import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "../app/globals.css";

const gabaritoFont = Mulish({
  weight: "400", // peso richiesto dal font
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrancescoTizzano",
  description: "Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabaritoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}

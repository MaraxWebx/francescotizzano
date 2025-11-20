import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "../app/globals.css";

const gabaritoFont = Mulish({
  weight: "400", // peso richiesto dal font
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrancescoTizzano | Stylist • Art Director • Consultant ",
  description:
    "Stylist e Art Director a Napoli: trasformo visioni in identità visive forti e riconoscibili, unendo gusto contemporaneo e consulenza creativa mirata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
      </head>
      <body className={`${gabaritoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}

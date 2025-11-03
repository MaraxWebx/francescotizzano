"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname(); // legge il path corrente

  const isGallery = pathname === "/style";

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between p-6 z-50 bg-transparent">
      {isGallery ? (
        // 🔹 Se sei nella pagina gallery → mostra "Back"
        <Link
          href="/"
          className="text-white text-2xl  tracking-wide hover:underline"
        >
          X
        </Link>
      ) : (
        // 🔹 Se sei in home (o altrove) → mostra "Style"
        <Link
          href="/style"
          className="text-white text-md tracking-wide hover:underline"
        >
          Style
        </Link>
      )}

      <Link href="/" className="text-white text-md  tracking-wide">
        FrancescoTizzano
      </Link>
    </header>
  );
}

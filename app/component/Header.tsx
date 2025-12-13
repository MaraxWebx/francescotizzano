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
          className="text-white text-2xl tracking-wide transform transition-all duration-500 ease-in-out hover:rotate-360 hover:scale-110 hover:opacity-80"
        >
          ←
        </Link>
      ) : (
        // 🔹 Se sei in home (o altrove) → mostra "Style"
        <Link
          href="/style"
          className="text-white text-md tracking-wide relative transition-all duration-300 hover:scale-110 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
        >
          Style
        </Link>
      )}

      <Link
        href="/"
        className="text-white text-lg tracking-wide relative transition-all duration-300 hover:scale-110 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
      >
        FrancescoTizzano
      </Link>
    </header>
  );
}

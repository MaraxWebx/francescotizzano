"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center justify-between pb-6 px-6 z-50">
      {/* SINISTRA — PROFILE */}
      <Link
        href="/profile"
        className="text-white text-md tracking-wide relative transition-all duration-300 hover:scale-110 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
      >
        Profile
      </Link>

      {/* DESTRA — CONTATTI */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-end">
        <a
          href="tel:+393484713563"
          className="text-white text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          +39 348 471 3563
        </a>

        <a
          href="mailto:francescotizzano89@gmail.com"
          className="text-white text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          francescotizzano89@gmail.com
        </a>

        <a
          href="https://www.instagram.com/francescotizzano/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          @francescotizzano
        </a>
      </div>
    </div>
  );
}

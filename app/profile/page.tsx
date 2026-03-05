"use client";

import Header from "../component/Header";
import Footer from "../component/Footer";
import BioScene from "../component/BioScene";

export default function Gallery() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto  overflow-hidden">
        <BioScene></BioScene>
      </main>

      <Footer />
    </div>
  );
}

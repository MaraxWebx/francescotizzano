"use client";

import Header from "../component/Header";
import Footer from "../component/Footer";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Image from "next/image";
import { useEffect, useState } from "react";

// 🔹 Componente per caricare e mostrare un modello 3D
function ModelBox({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <primitive object={scene} scale={1.3} />
    </Canvas>
  );
}

type GalleryItem = { type: string; src: string };

// 🔹 Array dinamico: ognuno specifica il tipo (img o glb)
const items: GalleryItem[] = [
    /*  { type: "img", src: "/images/gallery/tizzano-1.jpg" }, */
    // da 01 a 17
    { type: "img", src: "/images/gallery/78.jpg" },
    { type: "img", src: "/images/gallery/79.jpg" },
    { type: "img", src: "/images/gallery/60.jpg" },
    { type: "img", src: "/images/gallery/61.jpg" },
    { type: "img", src: "/images/gallery/62.jpg" },
    { type: "img", src: "/images/gallery/63.jpg" },
    { type: "img", src: "/images/gallery/73.jpeg" },
    { type: "img", src: "/images/gallery/74.jpg" },
    { type: "img", src: "/images/gallery/75.jpg" },
    { type: "img", src: "/images/gallery/76.jpg" },
    { type: "img", src: "/images/gallery/64.jpg" },
    { type: "img", src: "/images/gallery/65.jpg" },
    { type: "img", src: "/images/gallery/67.jpg" },
    { type: "img", src: "/images/gallery/68.jpg" },
    { type: "img", src: "/images/gallery/69.jpg" },
    { type: "img", src: "/images/gallery/66.jpg" },
    { type: "img", src: "/images/gallery/70.JPG" },
    { type: "img", src: "/images/gallery/71.JPG" },
    { type: "img", src: "/images/gallery/72.JPG" },
    { type: "img", src: "/images/gallery/57.jpg" },
    { type: "img", src: "/images/gallery/58.jpg" },

    { type: "img", src: "/images/gallery/90.jpg" },
    { type: "img", src: "/images/gallery/0.jpg" },

    { type: "img", src: "/images/gallery/1.jpg" },
    { type: "img", src: "/images/gallery/2.jpg" },
    { type: "img", src: "/images/gallery/3.jpg" },
    { type: "img", src: "/images/gallery/4.jpg" },
    { type: "img", src: "/images/gallery/5.jpg" },
    { type: "img", src: "/images/gallery/6.jpg" },
    { type: "img", src: "/images/gallery/7.jpg" },
    { type: "img", src: "/images/gallery/8.jpg" },
    { type: "img", src: "/images/gallery/9.jpg" },
    { type: "img", src: "/images/gallery/59.jpg" },
    { type: "img", src: "/images/gallery/10.jpeg" },
    /*     { type: "img", src: "/images/gallery/11.jpg" },
     */ { type: "img", src: "/images/gallery/12.jpg" },
    { type: "img", src: "/images/gallery/13.jpg" },
    { type: "img", src: "/images/gallery/14.jpg" },
    { type: "img", src: "/images/gallery/15.jpg" },
    { type: "img", src: "/images/gallery/16.jpg" },
    { type: "img", src: "/images/gallery/17.jpg" },
    { type: "img", src: "/images/gallery/18.jpg" },
    { type: "img", src: "/images/gallery/19.jpg" },
    { type: "img", src: "/images/gallery/20.jpg" },
    { type: "img", src: "/images/gallery/21.png" },
    { type: "img", src: "/images/gallery/22.jpg" },
    { type: "img", src: "/images/gallery/23.jpg" },
    { type: "img", src: "/images/gallery/24.jpg" },
    { type: "img", src: "/images/gallery/25.jpg" },

    { type: "img", src: "/images/gallery/28.jpg" },
    { type: "img", src: "/images/gallery/29.jpg" },
    { type: "img", src: "/images/gallery/30.jpg" },
    { type: "img", src: "/images/gallery/31.jpg" },
    { type: "img", src: "/images/gallery/32.jpg" },
    { type: "img", src: "/images/gallery/33.jpg" },
    /*     { type: "img", src: "/images/gallery/34.heic" },
     */ /*  { type: "img", src: "/images/gallery/35.heic" }, */
    { type: "img", src: "/images/gallery/36.jpg" },
    { type: "img", src: "/images/gallery/37.jpg" },
    { type: "img", src: "/images/gallery/38.jpg" },
    { type: "img", src: "/images/gallery/39.jpg" },
    { type: "img", src: "/images/gallery/40.jpg" },
    { type: "img", src: "/images/gallery/41.jpg" },
    { type: "img", src: "/images/gallery/42.jpg" },
    { type: "img", src: "/images/gallery/43.jpg" },
    { type: "img", src: "/images/gallery/44.jpg" },
    { type: "img", src: "/images/gallery/45.jpg" },
    { type: "img", src: "/images/gallery/46.jpg" },
    /*     { type: "img", src: "/images/gallery/47.jpg" },
     */ { type: "img", src: "/images/gallery/48.jpg" },
    { type: "img", src: "/images/gallery/49.jpg" },
    { type: "img", src: "/images/gallery/50.jpg" },
    { type: "img", src: "/images/gallery/51.jpg" },
    { type: "img", src: "/images/gallery/52.jpg" },
    { type: "img", src: "/images/gallery/53.jpg" },
    { type: "img", src: "/images/gallery/54.jpg" },
    { type: "img", src: "/images/gallery/55.jpg" },
    { type: "img", src: "/images/gallery/56.jpg" },
];

// 🔹 Fisher-Yates: mescola una copia dell'array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Gallery() {
  // ordine casuale a ogni visita; mescolato solo sul client per evitare errori di hydration
  const [shuffled, setShuffled] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setShuffled(shuffle(items));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto  overflow-hidden">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-2">
          {shuffled.map((item) => (
            <div key={item.src} className="mb-2 break-inside-avoid">
              <Image
                src={item.src}
                alt=""
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

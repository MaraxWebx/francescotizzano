"use client";

import Header from "../component/Header";
import Footer from "../component/Footer";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Image from "next/image";

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

export default function Gallery() {
  // 🔹 Array dinamico: ognuno specifica il tipo (img o glb)
  const items = [
    { type: "img", src: "/images/gallery/tizzano-1.jpg" },
    { type: "img", src: "/images/gallery/tizzano-6.jpg" },
    { type: "img", src: "/images/gallery/tizzano-2.jpg" },
    /*     { type: "glb", src: "/models/tizzano/tizzano-7.glb" },
     */ { type: "img", src: "/images/gallery/tizzano-3.jpg" },
    /*     { type: "glb", src: "/models/tizzano/tizzano-9.glb" },
     */ { type: "img", src: "/images/gallery/tizzano-4.JPG" },
    { type: "img", src: "/images/gallery/tizzano-5.jpg" },
    /*     { type: "glb", src: "/models/tizzano/tizzano-14.glb" },
     */ // ...puoi aggiungerne altri fino a 20
  ];

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto  overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-0">
          {items.map((item, i) => (
            <div
              key={i}
              className=" h-screen flex items-center justify-center transition duration-300"
            >
              {/* Se è un’immagine */}
              {item.type === "img" && (
                <>
                  <div className="relative w-full h-full">
                    <Image
                      src={item.src}
                      alt={`img-${i}`}
                      fill
                      className="object-cover transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </>
              )}

              {/* Se è un modello .glb */}
              {item.type === "glb" && <ModelBox url={item.src} />}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

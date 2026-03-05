"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// elenco dei modelli che vuoi mostrare a rotazione
const sideModels = [
  "/models/tizzano/tizzano-2.glb",
  "/models/tizzano/tizzano-123.glb",
  "/models/tizzano/tizzano-124.glb",
  "/models/tizzano/tizzano-125.glb",
  "/models/tizzano/tizzano-127.glb",
];

// preload modelli per evitare lag quando cambiano
sideModels.forEach((m) => useGLTF.preload(m));

function AnimatedSideObj({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Object3D>(null!);

  // oscillazione lenta avanti/indietro
  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    ref.current.rotation.y = Math.sin(t) * 0.1;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.02;
  });

  return <primitive ref={ref} object={scene} />;
}

export default function SideModel() {
  const [index, setIndex] = useState(0);

  // cambia modello ogni 4 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sideModels.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:fixed block bg-black lg:top-0 lg:left-0 h-screen lg:w-1/4 w-screen border-0 z-40 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]} // migliora performance mobile
        gl={{ powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <AnimatedSideObj url={sideModels[index]} />
      </Canvas>
    </div>
  );
}

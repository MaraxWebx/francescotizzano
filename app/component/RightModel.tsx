"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Mesh } from "three";

const models = [
  /*   "/models/tizzano/tizzano-3.glb",
   */ "/models/tizzano/tizzano-6.glb",
  "/models/tizzano/tizzano-7.glb",
  "/models/tizzano/tizzano-4.glb",
  "/models/tizzano/tizzano-5.glb",
  "/models/tizzano/tizzano-9.glb",
  "/models/tizzano/tizzano-14.glb",
  "/models/tizzano/tizzano-16.glb",
  "/models/tizzano/tizzano-20.glb",
];

function AnimatedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      // oscillazione rotazione y
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      // oscillazione rotazione x
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // zoom avanti/indietro con la scala
      const scale = 1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1; // varia da 0.8 a 1
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return <primitive ref={ref} object={scene} />;
}

export default function RightModel() {
  const [index, setIndex] = useState(0);

  // cambia modello ogni 3 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % models.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="block lg:fixed lg:top-0 lg:right-0 h-screen w-screen bg-black lg:bg-transparent lg:w-2/4 z-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <AnimatedModel url={models[index]} />
      </Canvas>
    </div>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

function SideObj() {
  const { scene } = useGLTF("/models/tizzano/tizzano-2.glb");
  const ref = useRef<Mesh>(null!);

  // oscillazione lenta avanti/indietro senza rotazione continua
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3; // oscillazione y
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1; // oscillazione x più lenta
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

export default function SideModel() {
  return (
    <div className="lg:fixed block bg-black lg:top-0 lg:left-0 h-screen  lg:w-1/4  w-screen border-0  z-40 pointer-events-none">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <SideObj />
      </Canvas>
    </div>
  );
}

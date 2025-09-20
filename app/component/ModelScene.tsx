"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Mesh } from "three";

function Model({ file }: { file: string }) {
  const { scene } = useGLTF(file); // carica il modello
  const ref = useRef<Mesh>(null!);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // ascolta il movimento del mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // da -1 a 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // aggiorna la rotazione ad ogni frame
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = mouse.x * 0.8;
      ref.current.rotation.x = -mouse.y * 0.8;
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

export default function ModelScene() {
  const [currentModel, setCurrentModel] = useState("/models/maretta-2.glb");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;

      // distanza del mouse dal centro
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // se il mouse è vicino al centro (entro 100px), cambia modello
      if (distance < 100) {
        setCurrentModel("/models/maretta-1.glb");
      } else {
        setCurrentModel("/models/maretta-2.glb");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model file={currentModel} />
      </Canvas>
    </div>
  );
}

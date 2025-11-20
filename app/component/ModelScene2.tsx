"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Mesh } from "three";

function Model({ file }: { file: string }) {
  const { scene } = useGLTF(file);
  const ref = useRef<Mesh>(null!);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetScroll, setTargetScroll] = useState(0);
  const scrollPos = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setTargetScroll(window.scrollY / 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = mouse.x * 0.8;
      ref.current.rotation.x = -mouse.y * 0.8;

      scrollPos.current += (targetScroll - scrollPos.current) * 0.1;
      ref.current.position.y = -scrollPos.current;
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

// 🔹 Nuovo componente per il testo fluttuante e rotante
function FloatingText() {
  const ref = useRef<Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      // morbido fluttuare e rotazione
      ref.current.position.y = Math.sin(t * 1.2) * 0.25; // fluttuazione
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.4; // rotazione dolce
      ref.current.rotation.x = Math.cos(t * 0.3) * 0.1; // leggera inclinazione
    }
  });

  return (
    <Text
      ref={ref}
      position={[0, -0.5, 3]}
      fontSize={0.1}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Stylist • Art Director • Consultant
    </Text>
  );
}

export default function ModelScene2() {
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model file="/models/tizzano/tizzano-1.glb" />
        <FloatingText />
      </Canvas>
    </div>
  );
}

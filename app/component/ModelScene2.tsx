"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

/* =========================
   MODEL
========================= */

function Model({ file }: { file: string }) {
  const { scene } = useGLTF(file);
  const ref = useRef<THREE.Object3D>(null!);

  const mouse = useRef({ x: 0, y: 0 });
  const targetScroll = useRef(0);
  const scrollPos = useRef(0);

  /* mouse */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* scroll */
  useEffect(() => {
    const handleScroll = () => {
      targetScroll.current = window.scrollY / 100;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const { x, y } = mouse.current;

    /* rotazione con inerzia */
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      x * 0.8,
      0.08,
    );

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -y * 0.8,
      0.08,
    );

    /* scroll smooth */
    scrollPos.current += (targetScroll.current - scrollPos.current) * 0.08;
    ref.current.position.y = -scrollPos.current;
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

useGLTF.preload("/models/tizzano/tizzano-1.glb");

/* =========================
   FLOATING TEXT
========================= */

function FloatingText() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    ref.current.position.y = Math.sin(t * 1.2) * 0.25;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.4;
    ref.current.rotation.x = Math.cos(t * 0.3) * 0.1;
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
      Stylist • Creative Director • Consultant
    </Text>
  );
}

/* =========================
   SCENE
========================= */

export default function ModelScene2() {
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        dpr={[1, 1.5]} // limita pixel ratio (mobile boost)
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Model file="/models/tizzano/tizzano-1.glb" />
        <FloatingText />
      </Canvas>
    </div>
  );
}

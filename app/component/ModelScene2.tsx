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

export default function ModelScene2() {
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model file="/models/tizzano/tizzano-1.glb" />

        {/* Testo 3D */}
        {/*   <Text
          position={[0, -2, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          stylist art director consultant
        </Text> */}
      </Canvas>
    </div>
  );
}

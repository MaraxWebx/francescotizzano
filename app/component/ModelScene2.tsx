"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Definiamo il tipo globale per la funzione di clear
declare global {
  interface Window {
    __clearDrawing?: () => void;
  }
}

/* ---- Model semplice ---- */
function Model({ file }: { file: string }) {
  const { scene } = useGLTF(file);
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}

/* ---- DrawingPlane ---- */
function DrawingPlane({ distance = 0.6 }: { distance?: number }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;
    textureRef.current = texture;

    const ctx = canvas.getContext("2d")!;

    const start = (e: PointerEvent) => {
      e.preventDefault();
      drawingRef.current = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      texture.needsUpdate = true;
    };
    const end = () => {
      drawingRef.current = false; // rimosso il parametro inutilizzato
    };

    window.addEventListener("pointerdown", start, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);

    // funzione globale sicura senza any
    window.__clearDrawing = () => {
      const c = canvasRef.current;
      const t = textureRef.current;
      if (!c || !t) return;
      const ctx2 = c.getContext("2d")!;
      ctx2.clearRect(0, 0, c.width, c.height);
      t.needsUpdate = true;
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      delete window.__clearDrawing;
      texture.dispose();
    };
  }, []);

  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    const texture = textureRef.current;
    const canvas = canvasRef.current;
    if (!mesh || !texture || !canvas) return;

    const fov = (camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * distance;
    const width = height * camera.aspect;
    mesh.scale.set(width, height, 1);

    mesh.position.copy(camera.position);
    mesh.quaternion.copy(camera.quaternion);
    mesh.translateZ(-distance);

    const mat = mesh.material as THREE.MeshBasicMaterial;
    if (mat.map !== texture) {
      mat.map = texture;
      mat.transparent = true;
      mat.depthTest = false;
      mat.depthWrite = false;
      mat.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={999}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

/* ---- Componente scena ---- */
export default function SceneWithDrawing() {
  return (
    <div className="h-screen w-screen relative bg-black">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model file="/models/tizzano/tizzano-1.glb" />
        <DrawingPlane distance={0.6} />
      </Canvas>
    </div>
  );
}

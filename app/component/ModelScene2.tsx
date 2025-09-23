"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ---- Model semplice ---- */
function Model({ file }: { file: string }) {
  const { scene } = useGLTF(file);
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}

/* ---- DrawingPlane: canvas offscreen -> CanvasTexture su Plane ---- */
function DrawingPlane({ distance = 0.6 }: { distance?: number }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    // crea canvas offscreen
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
      // scala il contesto in modo da poter usare clientX/clientY in CSS px
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white";
      // non riempire: vogliamo trasparenza di default
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // texture three.js dalla canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;
    textureRef.current = texture;

    const ctx = canvas.getContext("2d")!;

    // gestione disegno con pointer events (mouse+touch unify)
    const start = (e: PointerEvent) => {
      // non bloccare altrove ma impediamo comportamento di default
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
    const end = (e?: PointerEvent) => {
      drawingRef.current = false;
    };

    window.addEventListener("pointerdown", start, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);

    // expose clear function (pratico per il bottone "Clear")
    (window as any).__clearDrawing = () => {
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
      delete (window as any).__clearDrawing;
      texture.dispose();
    };
  }, []);

  // posiziona e scala il piano per coprire lo schermo alla distanza scelta
  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    const texture = textureRef.current;
    const canvas = canvasRef.current;
    if (!mesh || !texture || !canvas) return;

    // calcola dimensione del frustum al dato "distance"
    const fov = (camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * distance;
    const width = height * camera.aspect;
    mesh.scale.set(width, height, 1);

    // posiziona davanti alla camera orientandosi su di essa
    mesh.position.copy(camera.position);
    mesh.quaternion.copy(camera.quaternion);
    mesh.translateZ(-distance);

    // assicurati che la material abbia la texture
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
      {/* material usato; map assegnata in useFrame */}
      <meshBasicMaterial />
    </mesh>
  );
}

/* ---- Componente scena completa con bottone Clear ---- */
export default function SceneWithDrawing() {
  return (
    <div className="h-screen w-screen relative bg-black">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model file="/models/tizzano/tizzano-1.glb" />
        <DrawingPlane distance={0.6} />
      </Canvas>

      {/* Bottone DOM per cancellare la lavagna */}
      {/*  <button
        onClick={() => (window as any).__clearDrawing?.()}
        className="absolute top-4 right-4 z-50 bg-white text-black px-3 py-1 rounded"
        style={{ pointerEvents: "auto" }}
      >
        Clear
      </button> */}
    </div>
  );
}

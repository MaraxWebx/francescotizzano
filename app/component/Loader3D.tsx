"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, Box3, Vector3 } from "three";

function useAutoModelLoader(file: string) {
  const ext = file.split(".").pop()?.toLowerCase();

  return useLoader(
    ext === "glb" || ext === "gltf" ? GLTFLoader : OBJLoader,
    file
  );
}

function FloatingObj({ file }: { file: string }) {
  const model = useAutoModelLoader(file);
  const object = (model as any).scene || model; // glb usa scene
  const ref = useRef<Mesh>(null!);

  // centra il modello
  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current);
      const center = new Vector3();
      box.getCenter(center);
      ref.current.position.sub(center);
    }
  }, [model]);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

    const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    ref.current.scale.set(scale, scale, scale);
  });

  return <primitive ref={ref} object={object} />;
}

export default function Loader3D({ onFinish }: { onFinish: () => void }) {
  const files = [
    "/models/tizzano/maxo.obj",
    "/models/n4.glb",
    "/models/n1.glb",
    "/models/tizzano/mesh_vertex_colors.obj",
    /*    "/models/n5.glb", */
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % files.length);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, files.length * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <FloatingObj file={files[current]} />
      </Canvas>
    </div>
  );
}

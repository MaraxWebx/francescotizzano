"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, Box3, Vector3, Object3D } from "three";

function useAutoModelLoader(file: string): GLTF | Object3D {
  const ext = file.split(".").pop()?.toLowerCase();

  return useLoader(
    ext === "glb" || ext === "gltf" ? GLTFLoader : OBJLoader,
    file
  ) as GLTF | Object3D;
}

function FloatingObj({ file }: { file: string }) {
  const model = useAutoModelLoader(file);

  // se GLB → usa model.scene, se OBJ → usa model stesso
  const object = "scene" in model ? model.scene : model;

  const ref = useRef<Mesh>(null!);

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
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

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
  }, [onFinish, files.length]);

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

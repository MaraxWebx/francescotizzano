"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { Mesh, Box3, Vector3 } from "three";

function FloatingObj({ file }: { file: string }) {
  const obj = useLoader(OBJLoader, file);
  const ref = useRef<Mesh>(null!);

  // centra il modello una volta caricato
  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current);
      const center = new Vector3();
      box.getCenter(center);
      ref.current.position.sub(center); // sposta il modello in modo che il centro sia (0,0,0)
    }
  }, [obj]);

  useFrame((state) => {
    if (ref.current) {
      // rotazioni leggere
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // zoom avanti/indietro (scala)
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return <primitive ref={ref} object={obj} />;
}

export default function Loader3D({ onFinish }: { onFinish: () => void }) {
  const files = [/* "/models/maretta-11.obj", */ "/models/tizzano/maxo.obj"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % files.length);
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, files.length * 2000);

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

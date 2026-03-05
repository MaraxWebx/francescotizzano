"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* =========================
   MODEL
========================= */

function Model({ hit }: { hit: number }) {
  const { scene } = useGLTF("/models/francesco_tizzano_bio.glb");
  const ref = useRef<THREE.Object3D>(null!);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  useEffect(() => {
    if (!ref.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const center = new THREE.Vector3();
    box.getCenter(center);

    ref.current.position.sub(center);
    ref.current.position.y -= 1.2;

    ref.current.scale.set(2.5, 2.5, 2.5);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    const { x, y } = state.pointer;

    ref.current.rotation.y += 0.008;

    // segue il cursore con inerzia
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      y * 0.8,
      0.08,
    );

    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -x * 0.8,
      0.08,
    );

    // colpo al click
    if (impulse.current > 0.001) {
      ref.current.position.y =
        -1.2 + Math.sin(state.clock.elapsedTime * 25) * 0.25 * impulse.current;

      impulse.current *= 0.9;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

useGLTF.preload("/models/francesco_tizzano_bio.glb");

/* =========================
   MATRIX TEXT
========================= */

function MatrixText({ hit }: { hit: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  const columns = 14;

  useFrame((state, delta) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;

      mesh.position.y -= delta * 0.8;

      if (mesh.position.y < -3) {
        mesh.position.y = 3;
      }

      if (impulse.current > 0.001) {
        mesh.rotation.z =
          Math.sin(state.clock.elapsedTime * 20 + i) * 0.2 * impulse.current;

        impulse.current *= 0.9;
      }
    });
  });

  return (
    <>
      {Array.from({ length: columns }).map((_, i) => (
        <Text
          key={i}
          ref={(el) => (refs.current[i] = el!)}
          position={[i * 0.5 - 3.5, Math.random() * 3, -3]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ⣿⣿⣿ ⣿⣿⣿ ⣿⣿⣿
        </Text>
      ))}
    </>
  );
}

/* =========================
   SCENE
========================= */

export default function BioScene() {
  const [hit, setHit] = useState(0);

  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        onPointerDown={() => setHit((h) => h + 1)}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} />

        <MatrixText hit={hit} />
        <Model hit={hit} />
      </Canvas>
    </div>
  );
}

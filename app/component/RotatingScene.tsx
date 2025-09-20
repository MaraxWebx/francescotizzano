"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";

function SceneGLB({ file }: { file: string }) {
  const groupRef = useRef<Group>(null!);

  // carica modello + animazioni
  const { scene, animations } = useGLTF(file);
  const { actions } = useAnimations(animations, groupRef);

  const cameraRadius = 6; // quanto la camera si muove dal centro
  const cameraSpeed = 0.3; // velocità rotazione
  const baseHeight = 2; // altezza "media" della camera

  // avvia la prima animazione del glb
  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }
  }, [actions]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime * cameraSpeed;

    // movimento circolare attorno al centro
    const x = Math.sin(elapsed) * cameraRadius;
    const z = Math.cos(elapsed) * cameraRadius;

    // oscillazioni come camminata
    const y = baseHeight + Math.sin(elapsed * 2) * 0.2; // su/giù
    const strafe = Math.sin(elapsed * 1.5) * 0.5; // sinistra/destra

    // posiziona la camera con offset "camminata"
    state.camera.position.set(x + strafe, y, z);
    state.camera.lookAt(0, 1, 0); // guarda al centro (il mostro)
  });

  return <primitive ref={groupRef} object={scene} />;
}

export default function RotatingScene({ onFinish }: { onFinish: () => void }) {
  // cambia modello ogni 2 secondi
  useEffect(() => {
    // fine ciclo dopo 3 modelli * 2s = 6s
    const timeout = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onFinish]);
  return (
    <div className="h-screen w-screen border-0 bg-black">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <SceneGLB file="/models/matrix_void.glb" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

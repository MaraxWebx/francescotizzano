"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { OBJLoader } from "three/examples/jsm/Addons.js";

function SideObj() {
  const obj = useLoader(OBJLoader, "/models/tizzano/mesh_vertex_colors.obj");
  const ref = useRef<Mesh>(null!);

  // parametri di oscillazione
  const amplitudeX = 2; // larghezza massima spostamento sx-dx
  const amplitudeY = 1.5; // altezza massima spostamento su-giù
  const speedX = 0.5; // velocità movimento orizzontale
  const speedY = 1; // velocità movimento verticale
  const speedRot = 0.5; // velocità oscillazione rotazione

  useFrame((state) => {
    if (ref.current) {
      // oscillazioni libere
      ref.current.position.x =
        Math.sin(state.clock.elapsedTime * speedX) * amplitudeX;
      ref.current.position.y =
        Math.sin(state.clock.elapsedTime * speedY) * amplitudeY;

      // oscillazione rotazione leggera
      ref.current.rotation.y =
        Math.sin(state.clock.elapsedTime * speedRot) * 0.3;
      ref.current.rotation.x =
        Math.sin(state.clock.elapsedTime * speedRot * 0.5) * 0.1;
    }
  });

  return <primitive ref={ref} object={obj} scale={1} />;
}

export default function FloatingModel() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <SideObj />
      </Canvas>
    </div>
  );
}

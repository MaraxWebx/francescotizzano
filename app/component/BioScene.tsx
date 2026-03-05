"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

/* =========================
   AUTO LOADER
========================= */
function useAutoModel(file: string): THREE.Object3D {
  const ext = useMemo(() => file.split(".").pop()?.toLowerCase(), [file]);

const loaded = useLoader(
  ext === "glb" || ext === "gltf" ? GLTFLoader : OBJLoader,
  file
) as GLTF | THREE.Object3D;

if ((loaded as GLTF).scene) {
  return (loaded as GLTF).scene;
}

return loaded as THREE.Object3D;

/* =========================
   MODELLO (NO OVERRIDE)
========================= */
function Model({ file, hit }: { file: string; hit: number }) {
  const object = useAutoModel(file);
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
    // abbassa il modello
    ref.current.position.y -= 1.2;

    // 🔥 SCALE FORZATO
    ref.current.scale.set(2.5, 2.5, 2.5);
  }, [object]);
  useFrame((state) => {
    if (!ref.current) return;

    const { x, y } = state.pointer;

    // rotazione base
    ref.current.rotation.y += 0.008;

    // rotazione guidata dal cursore
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

    // impulso quando clicchi
    if (impulse.current > 0.001) {
      ref.current.position.y =
        -1.2 + Math.sin(state.clock.elapsedTime * 25) * 0.25 * impulse.current;

      impulse.current *= 0.9;
    }
  });

  return <primitive ref={ref} object={object} />;
}
function fadeByY(y: number, min: number, max: number) {
  if (y < min || y > max) return 0;

  const fadeSize = 0.5; // quanto è morbido il fade
  if (y < min + fadeSize) return (y - min) / fadeSize;
  if (y > max - fadeSize) return (max - y) / fadeSize;

  return 1;
}

/* =========================
   TESTO
========================= */
function ScrollingTexts() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.y += delta * 0.3;
    if (ref.current.position.y > 2) {
      ref.current.position.y = -2;
    }
    const opacity = fadeByY(ref.current.position.y, -1.6, 1.6);
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = opacity;
    material.transparent = true;
  });
  return (
    <Text
      ref={ref}
      position={[0, -2, -3]}
      fontSize={0.2}
      color="#ffffff"
      maxWidth={4}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷ T̷I̷Z̷Z̷A̷N̷O̷F̷R̷A̷N̷C̷E̷S̷C̷O̷
      T̷I̷Z̷Z̷A̷N̷O̷{" "}
    </Text> /* <Text ref={ref} position={[0, -2, -3]} fontSize={0.2} color="#ffffff" maxWidth={4} textAlign="center" anchorX="center" anchorY="middle" > Stylist e Art Director con base tra moda, immagine e cultura visiva contemporanea. Il suo lavoro nasce dall’incontro tra estetica editoriale, ricerca concettuale e sensibilità narrativa, con un approccio che fonde rigore visivo e istinto creativo. Ha collaborato con brand, artisti e creativi sviluppando identità visive, styling per progetti editoriali, campagne e consulenze d’immagine. Il suo linguaggio attraversa moda, arte e design, esplorando silhouette, texture e simboli come strumenti di racconto. Ogni progetto è pensato come un sistema coerente, dove immagine, corpo e spazio dialogano in equilibrio tra sperimentazione e raffinatezza. Attento ai dettagli e alla direzione creativa complessiva, lavora per costruire visioni riconoscibili, essenziali e senza tempo. </Text> */
  );
}
function ScrollingText({ hit }: { hit: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.position.y += delta * 0.3;

    if (ref.current.position.y > 2) {
      ref.current.position.y = -2;
    }

    if (impulse.current > 0.001) {
      ref.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 20) * 0.25 * impulse.current;

      ref.current.position.x =
        Math.sin(state.clock.elapsedTime * 15) * 0.4 * impulse.current;

      impulse.current *= 0.9;
    }

    const opacity = fadeByY(ref.current.position.y, -1.6, 1.6);
    const material = ref.current.material as THREE.MeshBasicMaterial;

    material.opacity = opacity;
    material.transparent = true;
  });

  return (
    <Text
      ref={ref}
      position={[0, -2, -3]}
      fontSize={0.2}
      color="#ffffff"
      maxWidth={4}
      textAlign="center"
      anchorX="right"
      anchorY="middle"
    >
      ⣶⡿⢟⣫⣽⣶⣶⡿⣿⣿⣶⣶⣦⣭⣙⠺⢼⣾⡿⢋⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣴⣿⣿⣿⣿⣿⣷
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣿⣷
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣴⣿⣿⣿⣿⣿⣷
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
      ⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧⣴⣿⣿⣿⣿⣿⣷ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⢿⣿⣧
    </Text>
  );
}
function MatrixText({ hit }: { hit: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  const columns = 12;

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
          position={[i * 0.5 - 3, Math.random() * 3, -3]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣿⣿⣿
        </Text>
      ))}
    </>
  );
}
/* =========================
   SCENA
========================= */
export default function BioScene() {
  const [hit, setHit] = useState(0);
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        onPointerDown={() => setHit((h) => h + 1)}
        gl={{
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {/* LUCI SOFT (NON INVASIVE) */}
        <ambientLight intensity={0.3} />
        {/*  <directionalLight position={[5, 6, 4]} intensity={0.9} />
        <directionalLight position={[-5, -3, 6]} intensity={0.4} /> */}
        <directionalLight position={[5, 5, 5]} />
        {/* ENVIRONMENT = fondamentale per PBR */}
        <ScrollingText hit={hit} />
        <MatrixText hit={hit} />
        <Model file="/models/francesco_tizzano_bio.glb" hit={hit} />{" "}
      </Canvas>
    </div>
  );
}

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

function MatrixTexts({ hit }: { hit: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  const columns = 1;

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
          fontSize={0.1}
          maxWidth={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Francesco Tizzano è uno stylist * napoletano o di base a napoli
          indipendente che ha scelto di lavorare fuori dalle dinamiche
          mainstream, *allontanandosi dai circuiti standardizzati della moda e
          dalle sue logiche economiche. *Rifiutando di riprodurre
          pedissequamente modelli chiusi e gerarchie di visibilità, dove tutto
          ciò che nasce in periferia o fuori dal centro del mercato viene letto
          come derivato, secondario o semplicemente *escluso, il suo lavoro
          parte invece dal basso: l’occhio si incastra nella strada, nella
          radice, nei contesti in cui le trasformazioni avvengono prima di
          essere riconosciute come linguaggio. Se la struttura sociale è
          testimoniata da chi la vive, la moda non fa eccezione: sono i corpi
          reali, gli ambienti quotidiani, le situazioni non codificate a essere
          i primi testimoni dei cambiamenti nelle rappresentazioni sociali e nel
          mondo che ci circonda. Le immagini di Tizzano nascono da ciò che
          esiste già, da ciò che si muove ai margini, da ciò che non è ancora
          stato assorbito dal linguaggio del mercato. Lo styling diventa
          un’invenzione, un artefatto che si costruisce assemblandosi, e che
          allo stesso tempo porta alla luce ciò che resta invisibile nelle
          rappresentazioni dominanti, fino a spettacolarizzare il dettaglio già
          presente nel quotidiano. Ogni corpo, ogni fenomeno, ogni briciola di
          vivente contiene un potenziale di eccelso, una materia scintillante e
          trasformabile. *apertura con slancio al futuro
        </Text>
      ))}
    </>
  );
}
function MatrixText({ hit }: { hit: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const speeds = useRef<number[]>([]);
  const impulse = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  const text = `
  Francesco Tizzano è uno stylist napoletano o di base a napoli
  indipendente che ha scelto di lavorare fuori dalle dinamiche mainstream
  allontanandosi dai circuiti standardizzati della moda e dalle sue logiche
  economiche Rifiutando di riprodurre pedissequamente modelli chiusi e
  gerarchie di visibilità dove tutto ciò che nasce in periferia o fuori dal
  centro del mercato viene letto come derivato secondario o semplicemente
  escluso il suo lavoro parte invece dal basso l’occhio si incastra nella
  strada nella radice nei contesti in cui le trasformazioni avvengono prima
  di essere riconosciute come linguaggio Se la struttura sociale è
  testimoniata da chi la vive la moda non fa eccezione sono i corpi reali
  gli ambienti quotidiani le situazioni non codificate a essere i primi
  testimoni dei cambiamenti nelle rappresentazioni sociali e nel mondo che
  ci circonda Le immagini di Tizzano nascono da ciò che esiste già da ciò
  che si muove ai margini da ciò che non è ancora stato assorbito dal
  linguaggio del mercato Lo styling diventa un’invenzione un artefatto
  che si costruisce assemblandosi e che allo stesso tempo porta alla luce
  ciò che resta invisibile nelle rappresentazioni dominanti fino a
  spettacolarizzare il dettaglio già presente nel quotidiano Ogni corpo
  ogni fenomeno ogni briciola di vivente contiene un potenziale di eccelso
  una materia scintillante e trasformabile apertura con slancio al futuro
  `;

  const words = text
    .replace(/[^\wàèéìòùç']/gi, " ")
    .split(/\s+/)
    .filter(Boolean);

  const columns = 30;

  useEffect(() => {
    speeds.current = Array.from({ length: columns }).map(
      () => 2 + Math.random() * 1,
    );
  }, []);

  useFrame((state, delta) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;

      mesh.position.y -= delta * speeds.current[i];

      if (mesh.position.y < -4) {
        mesh.position.y = 4;
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
          position={[(i - columns / 2) * 0.35, Math.random() * 4 - 2, -3]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {words[Math.floor(Math.random() * words.length)]}
        </Text>
      ))}
    </>
  );
}

/* =========================
   SCENE
========================= */
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

      impulse.current *= 0.9;
    }
  });

  return (
    <Text
      ref={ref}
      position={[0, -2, -3]} // centrato e dietro il modello
      fontSize={0.2}
      color="#ffffff"
      maxWidth={4}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      Francesco Tizzano è uno stylist * napoletano o di base a napoli
      indipendente che ha scelto di lavorare fuori dalle dinamiche mainstream,
      *allontanandosi dai circuiti standardizzati della moda e dalle sue logiche
      economiche. *Rifiutando di riprodurre pedissequamente modelli chiusi e
      gerarchie di visibilità, dove tutto ciò che nasce in periferia o fuori dal
      centro del mercato viene letto come derivato, secondario o semplicemente
      *escluso, il suo lavoro parte invece dal basso: l’occhio si incastra nella
      strada, nella radice, nei contesti in cui le trasformazioni avvengono
      prima di essere riconosciute come linguaggio. Se la struttura sociale è
      testimoniata da chi la vive, la moda non fa eccezione: sono i corpi reali,
      gli ambienti quotidiani, le situazioni non codificate a essere i primi
      testimoni dei cambiamenti nelle rappresentazioni sociali e nel mondo che
      ci circonda. Le immagini di Tizzano nascono da ciò che esiste già, da ciò
      che si muove ai margini, da ciò che non è ancora stato assorbito dal
      linguaggio del mercato. Lo styling diventa un’invenzione, un artefatto che
      si costruisce assemblandosi, e che allo stesso tempo porta alla luce ciò
      che resta invisibile nelle rappresentazioni dominanti, fino a
      spettacolarizzare il dettaglio già presente nel quotidiano. Ogni corpo,
      ogni fenomeno, ogni briciola di vivente contiene un potenziale di eccelso,
      una materia scintillante e trasformabile. *apertura con slancio al futuro
    </Text>
  );
}

export default function BioScene() {
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, []);
  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        onPointerDown={() => setHit((h) => h + 1)}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} />
        <ScrollingText hit={hit} />
        <MatrixText hit={hit} />

        <Model hit={hit} />
      </Canvas>
    </div>
  );
}

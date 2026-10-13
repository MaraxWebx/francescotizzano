"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* =========================
   MODEL
========================= */

type Holding = { current: boolean };

function Model({ hit, holding }: { hit: number; holding: Holding }) {
  const { scene } = useGLTF("/models/francesco_tizzano_bio.glb");
  const ref = useRef<THREE.Object3D>(null!);
  const impulse = useRef(0);
  const chaos = useRef(0);

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

    // tenendo premuto accelera in modo graduale, e rallenta al rilascio
    chaos.current = THREE.MathUtils.lerp(
      chaos.current,
      holding.current ? 1 : 0,
      0.06,
    );
    const c = chaos.current;

    ref.current.rotation.y += 0.008 + c * 0.25;

    // segue il cursore con inerzia (+ scossa quando si tiene premuto)
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      y * 0.8 + (Math.random() - 0.5) * 0.6 * c,
      0.08,
    );

    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -x * 0.8 + (Math.random() - 0.5) * 0.6 * c,
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
const MATRIX_TEXT = `
Francesco Tizzano è uno stylist indipendente di Napoli, con una lunga esperienza nel mondo della moda, da cui nasce un percorso personale che si sviluppa come ampliamento delle possibilità dello styling e come apertura verso nuovi contesti, nuovi corpi e nuovi spazi di ricerca, dentro e attorno alle dinamiche del settore e alle sue logiche economiche.
Integrando alla pratica della moda elementi che nascono anche fuori dai circuiti più standardizzati, il suo lavoro si costruisce a partire dal basso: l’occhio si incastra nella strada, nella radice, nei contesti in cui le trasformazioni avvengono prima di essere riconosciute come linguaggio, dove tutto ciò che nasce in periferia o fuori dal centro del mercato viene spesso letto come derivato, secondario. 
Se la struttura sociale è testimoniata da chi la vive, la moda non fa eccezione: sono i corpi reali, gli ambienti quotidiani, le situazioni non codificate a essere i primi testimoni dei cambiamenti nelle rappresentazioni sociali e nel mondo che ci circonda.
Le immagini di Tizzano nascono da ciò che esiste già, da ciò che si muove ai margini, da ciò che non è ancora stato assorbito dal linguaggio del mercato.
Lo styling diventa un’invenzione, un artefatto che si costruisce assemblandosi, e che allo stesso tempo porta alla luce ciò che resta invisibile nelle rappresentazioni dominanti, fino a spettacolarizzare il dettaglio già presente nel quotidiano. Ogni corpo, ogni fenomeno, ogni briciola di vivente contiene un potenziale di eccelso, una materia scintillante e trasformabile. Il lavoro si sviluppa come apertura verso nuove possibilità di costruzione dell’immagine, in una direzione che guarda al futuro come spazio di trasformazione, ricerca e collaborazione, mantenendo lo styling come pratica viva, in continua evoluzione.
  `;

const MATRIX_WORDS = MATRIX_TEXT.replace(/[^\wàèéìòùç']/gi, " ")
  .split(/\s+/)
  .filter(Boolean);

const COLUMNS = 30;

function MatrixText({ hit, holding }: { hit: number; holding: Holding }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const impulse = useRef(0);
  const chaos = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  // generate una volta sola: così un re-render (es. al tap) non fa saltare le parole
  const columns = useMemo(
    () =>
      Array.from({ length: COLUMNS }).map((_, i) => ({
        x: (i - COLUMNS / 2) * 0.35,
        y: Math.random() * 4 - 2,
        speed: 2 + Math.random() * 1,
        word: MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)],
      })),
    [],
  );

  useFrame((state, delta) => {
    chaos.current = THREE.MathUtils.lerp(
      chaos.current,
      holding.current ? 1 : 0,
      0.08,
    );
    const c = chaos.current;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;

      // più veloci e a scatti quando si tiene premuto
      mesh.position.y -= delta * columns[i].speed * (1 + c * 4 * Math.random());

      if (mesh.position.y < -4) {
        mesh.position.y = 4;
      }

      let wave = 0;
      if (impulse.current > 0.001) {
        wave =
          Math.sin(state.clock.elapsedTime * 20 + i) * 0.2 * impulse.current;

        impulse.current *= 0.9;
      }

      // confusione: tremolio, rotazioni, scala e sfarfallio casuali
      mesh.position.x = columns[i].x + (Math.random() - 0.5) * 0.4 * c;
      mesh.rotation.z = wave + (Math.random() - 0.5) * 1.5 * c;
      mesh.scale.setScalar(1 + (Math.random() - 0.5) * 1.2 * c);
      mesh.visible = Math.random() > 0.2 * c;
    });
  });

  return (
    <>
      {columns.map((col, i) => (
        <Text
          key={i}
          ref={(el) => (refs.current[i] = el!)}
          position={[col.x, col.y, -3]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {col.word}
        </Text>
      ))}
    </>
  );
}

/* =========================
   SCENE
========================= */
function ScrollingText({ hit, holding }: { hit: number; holding: Holding }) {
  const ref = useRef<THREE.Mesh>(null!);
  const impulse = useRef(0);
  const chaos = useRef(0);

  useEffect(() => {
    impulse.current = 1;
  }, [hit]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    chaos.current = THREE.MathUtils.lerp(
      chaos.current,
      holding.current ? 1 : 0,
      0.08,
    );
    const c = chaos.current;

    ref.current.position.y += delta * 0.3 * (1 + c * 3);

    if (ref.current.position.y > 2) {
      ref.current.position.y = -2;
    }

    let wave = 0;
    if (impulse.current > 0.001) {
      wave = Math.sin(state.clock.elapsedTime * 20) * 0.25 * impulse.current;

      impulse.current *= 0.9;
    }

    // confusione: scosse laterali e rotazioni a scatti
    ref.current.position.x = (Math.random() - 0.5) * 0.3 * c;
    ref.current.rotation.z = wave + (Math.random() - 0.5) * 0.4 * c;
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
      Francesco Tizzano è uno stylist indipendente di Napoli, con una lunga
      esperienza nel mondo della moda, da cui nasce un percorso personale che si
      sviluppa come ampliamento delle possibilità dello styling e come apertura
      verso nuovi contesti, nuovi corpi e nuovi spazi di ricerca, dentro e
      attorno alle dinamiche del settore e alle sue logiche economiche.
      Integrando alla pratica della moda elementi che nascono anche fuori dai
      circuiti più standardizzati, il suo lavoro si costruisce a partire dal
      basso: l’occhio si incastra nella strada, nella radice, nei contesti in
      cui le trasformazioni avvengono prima di essere riconosciute come
      linguaggio, dove tutto ciò che nasce in periferia o fuori dal centro del
      mercato viene spesso letto come derivato, secondario. Se la struttura
      sociale è testimoniata da chi la vive, la moda non fa eccezione: sono i
      corpi reali, gli ambienti quotidiani, le situazioni non codificate a
      essere i primi testimoni dei cambiamenti nelle rappresentazioni sociali e
      nel mondo che ci circonda. Le immagini di Tizzano nascono da ciò che
      esiste già, da ciò che si muove ai margini, da ciò che non è ancora stato
      assorbito dal linguaggio del mercato. Lo styling diventa un’invenzione, un
      artefatto che si costruisce assemblandosi, e che allo stesso tempo porta
      alla luce ciò che resta invisibile nelle rappresentazioni dominanti, fino
      a spettacolarizzare il dettaglio già presente nel quotidiano. Ogni corpo,
      ogni fenomeno, ogni briciola di vivente contiene un potenziale di eccelso,
      una materia scintillante e trasformabile. Il lavoro si sviluppa come
      apertura verso nuove possibilità di costruzione dell’immagine, in una
      direzione che guarda al futuro come spazio di trasformazione, ricerca e
      collaborazione, mantenendo lo styling come pratica viva, in continua
      evoluzione.
    </Text>
  );
}

/* =========================
   SOUND
========================= */

// curva di distorsione "hard" per sporcare il suono
function makeDistortion(amount: number) {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
  }
  return curve;
}

function useHitSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const masterRef = useRef<AudioNode | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // l'AudioContext va creato dentro un gesto dell'utente (iOS/Safari)
  const getAudio = () => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();

      // buffer di rumore bianco riutilizzato da ogni tap
      const noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      // catena master: distorsione -> compressore -> volume
      const shaper = ctx.createWaveShaper();
      shaper.curve = makeDistortion(40);
      const comp = ctx.createDynamicsCompressor();
      const out = ctx.createGain();
      out.gain.value = 0.35;
      shaper.connect(comp).connect(out).connect(ctx.destination);

      ctxRef.current = ctx;
      noiseRef.current = noise;
      masterRef.current = shaper;
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    return { ctx, noise: noiseRef.current!, master: masterRef.current! };
  };

  // 1. stutter: frammenti di rumore filtrati a frequenze casuali, con buchi in mezzo
  const stutter = (slices: number) => {
    const { ctx, noise, master } = getAudio();
    let t = ctx.currentTime;
    for (let i = 0; i < slices; i++) {
      const len = 0.01 + Math.random() * 0.035;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 600 + Math.random() * 5000;
      bp.Q.value = 4 + Math.random() * 10;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.9, t);
      g.gain.setValueAtTime(0, t + len);
      src.connect(bp).connect(g).connect(master);
      src.start(t, Math.random() * 0.4, len);
      t += len + Math.random() * 0.03;
    }
  };

  // 2. colpo basso: sub che cade di pitch, tipo martello su lamiera
  const thud = (level: number) => {
    const { ctx, master } = getAudio();
    const now = ctx.currentTime;
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "triangle";
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    subGain.gain.setValueAtTime(level, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    sub.connect(subGain).connect(master);
    sub.start(now);
    sub.stop(now + 0.25);
  };

  // 3. clang metallico: tre onde quadre a rapporto non armonico
  const clang = () => {
    const { ctx, master } = getAudio();
    const now = ctx.currentTime;
    const base = 180 + Math.random() * 220;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1200;
    const metalGain = ctx.createGain();
    metalGain.gain.setValueAtTime(0.25, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    hp.connect(metalGain).connect(master);
    [1, 1.483, 2.17].forEach((ratio) => {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = base * ratio;
      o.connect(hp);
      o.start(now);
      o.stop(now + 0.12);
    });
  };

  // finché si tiene premuto: glitch continui a intervalli irregolari
  const loop = () => {
    stutter(2 + Math.floor(Math.random() * 3));
    if (Math.random() < 0.3) clang();
    if (Math.random() < 0.15) thud(0.5);
    holdTimer.current = setTimeout(loop, 70 + Math.random() * 110);
  };

  const stop = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const start = () => {
    stop();
    // colpo pieno al tap
    stutter(3 + Math.floor(Math.random() * 4));
    thud(0.8);
    clang();
    // se il dito resta giù, parte il loop dopo un attimo
    holdTimer.current = setTimeout(loop, 250);
  };

  useEffect(() => {
    // rilascio ovunque nella pagina (anche fuori dal canvas)
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      stop();
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);

  return start;
}

export default function BioScene() {
  const [hit, setHit] = useState(0);
  const playHit = useHitSound();
  // ref e non state: le animazioni lo leggono a ogni frame senza re-render
  const holding = useRef(false);

  useEffect(() => {
    const release = () => (holding.current = false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, []);

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
        onPointerDown={() => {
          holding.current = true;
          setHit((h) => h + 1);
          playHit();
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} />
        <ScrollingText hit={hit} holding={holding} />
        <MatrixText hit={hit} holding={holding} />

        <Model hit={hit} holding={holding} />
      </Canvas>
    </div>
  );
}

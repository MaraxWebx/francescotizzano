"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function SpotNegativeDraw({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white"; // white → negative under blend mode
    ctx.lineWidth = 40; // brush size
  }, [isClient]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = containerRef.current;
    if (!canvas || !ctx || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const startDraw = (e: React.PointerEvent) => {
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = containerRef.current;

    if (!canvas || !ctx || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  if (!isClient) {
    return (
      <Image
        src={src}
        alt=""
        width={600}
        height={800}
        className="w-full h-auto object-cover"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onPointerDown={startDraw}
      onPointerMove={handlePointerMove}
      onPointerUp={endDraw}
      onPointerLeave={endDraw}
    >
      {/* IMMAGINE */}
      <Image
        src={src}
        alt=""
        width={600}
        height={800}
        className="w-full h-auto object-cover"
      />

      {/* CANVAS DISEGNO NEGATIVO */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-difference pointer-events-auto"
      />
    </div>
  );
}

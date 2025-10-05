'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMouse } from '@uidotdev/usehooks';

// Linear interpolation
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface StarfieldProps {
  starCount?: number;
  starColor?: [number, number, number];
  speedFactor?: number;
  backgroundColor?: string;
}

export default function Starfield({
  starCount = 500,
  starColor = [255, 255, 255],
  speedFactor = 0.05,
  backgroundColor = 'black',
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const { elX, elY, elW, elH } = useMouse();

  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const tempStars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * 2 - 1, // Range: -1 to 1
      y: Math.random() * 2 - 1, // Range: -1 to 1
      z: Math.random(), // Range: 0 to 1
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.01 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
    setStars(tempStars);
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const render = (time: number) => {
      // Lerp mouse position for smooth movement
      const targetX = elX !== null ? (elX - elW / 2) / (elW / 2) : 0;
      const targetY = elY !== null ? (elY - elH / 2) / (elH / 2) : 0;
      mousePos.current.x = lerp(mousePos.current.x, targetX, 0.05);
      mousePos.current.y = lerp(mousePos.current.y, targetY, 0.05);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const [r, g, b] = starColor;

      stars.forEach((star) => {
        const parallaxX = star.x * (canvas.width / 2);
        const parallaxY = star.y * (canvas.height / 2);

        // Z-based parallax effect
        const depthX = mousePos.current.x * speedFactor * (1 - star.z) * 100;
        const depthY = mousePos.current.y * speedFactor * (1 - star.z) * 100;

        const x = canvas.width / 2 + parallaxX - depthX;
        const y = canvas.height / 2 + parallaxY - depthY;

        // Twinkling effect
        const twinkle =
          Math.sin(star.twinklePhase + time * star.twinkleSpeed) * 0.5 + 0.5;
        const opacity = star.opacity * twinkle;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size * star.z, 0, 2 * Math.PI);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [stars, backgroundColor, starColor, speedFactor, elX, elY, elW, elH]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}

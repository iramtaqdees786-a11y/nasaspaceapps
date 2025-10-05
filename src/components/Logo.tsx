'use client';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Logo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accentColor, setAccentColor] = useState('hsl(180 100% 65%)');
  const [primaryColor, setPrimaryColor] = useState('hsl(320 100% 70%)');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const computedStyle = getComputedStyle(document.documentElement);
      
      const convertHslString = (hslString: string) => {
        if (!hslString) return '';
        const [h, s, l] = hslString.trim().split(' ').map(parseFloat);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      
      try {
        const accent = computedStyle.getPropertyValue('--accent-dark').trim();
        const primary = computedStyle.getPropertyValue('--primary-dark').trim();
        setAccentColor(convertHslString(accent));
        setPrimaryColor(convertHslString(primary));
      } catch (e) {
        console.error("Failed to parse CSS variables for canvas:", e);
      }
    }
  }, []);


  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = 0, height = 0;

    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
            width = parent.offsetWidth * dpr;
            height = parent.offsetHeight * dpr;
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${parent.offsetWidth}px`;
            canvas.style.height = `${parent.offsetHeight}px`;
        }
    };
    resizeCanvas();
    
    let targetMouseX = 0.5, targetMouseY = 0.5;
    let currentMouseX = 0.5, currentMouseY = 0.5;
    let time = 0;
    let hoverTime = 0;
    
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleMouseMove = (e: MouseEvent) => {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = e.clientY / window.innerHeight;
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const parentEl = canvas.parentElement;
    if (parentEl) {
        parentEl.addEventListener('mouseenter', handleMouseEnter);
        parentEl.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('mousemove', handleMouseMove);

    const draw = (timestamp: number) => {
      time = timestamp / 1000;
      
      currentMouseX = lerp(currentMouseX, targetMouseX, 0.05);
      currentMouseY = lerp(currentMouseY, targetMouseY, 0.05);

      const tiltX = (currentMouseY - 0.5) * 0.7; // Vertical tilt
      const tiltY = -(currentMouseX - 0.5) * 0.7; // Horizontal tilt
      
      if (isHovering) {
        hoverTime = Math.min(hoverTime + 0.03, 1);
      } else {
        hoverTime = Math.max(hoverTime - 0.03, 0);
      }
      const warpSpeed = hoverTime * hoverTime;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const radius = Math.min(width, height) / 4;

      // Central Orb
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 40 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(1, primaryColor);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();


      // Rings
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.transform(1, tiltX, tiltY, 1, 0, 0); // Apply shear transform for 3D effect
      
      const drawRing = (rotation: number, color: string, lineWidth: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth * dpr;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 * dpr;

        const ringRadius = radius * 1.5;
        const totalPoints = 100;
        
        for (let i = 0; i <= totalPoints; i++) {
          const angle = (i / totalPoints) * Math.PI * 2;
          const rotationAngle = time * (0.5 + warpSpeed * 3) + rotation;

          const x = ringRadius * Math.cos(angle);
          const y = ringRadius * Math.sin(angle) * Math.cos(rotationAngle);
          const z = ringRadius * Math.sin(angle) * Math.sin(rotationAngle);

          const scale = 1 + z / (ringRadius * 2);

          if (i === 0) {
            ctx.moveTo(x * scale, y * scale);
          } else {
            ctx.lineTo(x * scale, y * scale);
          }
        }
        ctx.stroke();
      };

      drawRing(0, primaryColor, 3);
      drawRing(Math.PI / 3, accentColor, 2);
      drawRing(Math.PI / 1.5, 'rgba(255, 255, 255, 0.5)', 1.5);
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };
    draw(0);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (parentEl) {
        parentEl.removeEventListener('mouseenter', handleMouseEnter);
        parentEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [accentColor, primaryColor, isHovering]);

  return (
    <div className="relative h-40 w-40 md:h-56 md:w-56 cursor-pointer">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
};

export default Logo;

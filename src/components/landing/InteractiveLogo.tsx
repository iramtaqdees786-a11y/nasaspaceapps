'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMouse } from '@uidotdev/usehooks';
import { motion, useAnimation } from 'framer-motion';

// Linear interpolation for smooth movement
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

const InteractiveLogo = () => {
  const [isHovering, setIsHovering] = useState(false);
  const rotation = useRef({ x: 0, y: 0 });
  const { elX, elY, elW, elH } = useMouse();
  const controls = useAnimation();

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      // Target rotation based on mouse position
      const targetX = elX !== null ? ((elY - elH / 2) / (elH / 2)) * -25 : 0; // Invert and scale
      const targetY = elX !== null ? ((elX - elW / 2) / (elW / 2)) * 25 : 0;

      // Lerp for smooth rotation
      rotation.current.x = lerp(rotation.current.x, targetX, 0.05);
      rotation.current.y = lerp(rotation.current.y, targetY, 0.05);

      controls.set({
        rotateX: rotation.current.x,
        rotateY: rotation.current.y,
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [elX, elY, elW, elH, controls]);

  const ringVariants = {
    initial: { rotate: 0 },
    warp: (i: number) => ({
      rotate: 360 * (i % 2 === 0 ? -1 : 1),
      transition: {
        duration: 0.5 + i * 0.1,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
    slow: (i: number) => ({
        rotate: 360 * (i % 2 === 0 ? 1 : -1),
        transition: {
          duration: 30 + i * 10,
          repeat: Infinity,
          ease: 'linear',
        },
      }),
  };

  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
      style={{ perspective: 1000 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={controls}
      >
        {/* Rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full border-2 rounded-full"
            style={{
              borderColor: `hsla(180, 100%, 50%, ${0.6 - i * 0.15})`,
              transform: `rotateX(75deg) scale(${1 - i * 0.25})`,
            }}
            variants={ringVariants}
            initial="slow"
            animate={isHovering ? 'warp' : 'slow'}
            custom={i}
          />
        ))}

        {/* Central Sphere */}
        <motion.div
          className="absolute w-1/4 h-1/4 rounded-full"
          style={{
            background:
              'radial-gradient(circle, hsl(320, 100%, 50%) 0%, hsl(270, 50%, 20%) 100%)',
            boxShadow:
              '0 0 20px hsl(320, 100%, 70%), 0 0 40px hsl(320, 100%, 50%)',
            top: '37.5%',
            left: '37.5%',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default InteractiveLogo;

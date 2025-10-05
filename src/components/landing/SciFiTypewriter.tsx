'use client';

import React, { useState, useEffect, useRef } from 'react';

const chars = '!<>-_\\/[]{}—=+*^?#________';

interface SciFiTypewriterProps {
  text: string;
  className?: string;
}

const SciFiTypewriter: React.FC<SciFiTypewriterProps> = ({ text, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const elementRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    let frameRequest: number;
    let frame = 0;
    let queue: { from: string; to: string; start: number; end: number }[] = [];

    const scramble = () => {
      let output = '';
      let complete = 0;

      for (let i = 0, n = queue.length; i < n; i++) {
        const { from, to, start, end } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          const progress = (frame - start) / (end - start);
          if (progress < 1) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            output += randomChar;
          } else {
            output += to;
          }
        } else {
          output += from;
        }
      }

      setDisplayedText(output);

      if (complete === queue.length) {
        setIsAnimating(false);
        return;
      }

      frameRequest = requestAnimationFrame(scramble);
      frame++;
    };

    queue = text.split('').map((char, i) => {
      const from = ' ';
      const to = char;
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      return { from, to, start, end };
    });

    scramble();

    return () => cancelAnimationFrame(frameRequest);
  }, [text]);

  return (
    <p ref={elementRef} className={className}>
      {displayedText}
    </p>
  );
};

export default SciFiTypewriter;

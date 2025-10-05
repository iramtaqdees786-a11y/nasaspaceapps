// This is the new landing page component.
// I am keeping the old page content in a separate file `src/app/home/page.tsx`
// and will create the new landing page experience here.

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '@/components/landing/Starfield';
import InteractiveLogo from '@/components/landing/InteractiveLogo';
import Typewriter from '@/components/landing/Typewriter';
import SciFiTypewriter from '@/components/landing/SciFiTypewriter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);

  const handleStartAdventure = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) {
      const timer = setTimeout(() => {
        setShowMain(true);
      }, 500); // Corresponds to the fade-out duration
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-foreground-dark overflow-hidden font-body">
      <Starfield
        starCount={2000}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        backgroundColor="black"
      />
      <main className="relative z-10 flex-grow flex items-center justify-center">
        <AnimatePresence onExitComplete={() => setShowMain(true)}>
          {showIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <InteractiveLogo />
              <h1 className="font-headline text-4xl md:text-6xl font-bold mt-8">
                <Typewriter text="Cellestial: Where Cells Meet the Cosmos" />
              </h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.5 }}
              >
                <Button
                  onClick={handleStartAdventure}
                  className="mt-12 text-lg"
                  size="lg"
                  variant="futuristic"
                >
                  Start the Adventure
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMain && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center p-4 max-w-4xl"
            >
              <h2 className="font-headline text-3xl md:text-5xl font-bold mb-8">Welcome, Explorer.</h2>
              <p className="text-lg md:text-xl text-muted-foreground-dark leading-relaxed">
                <SciFiTypewriter text="You have arrived at the nexus of biology and the vast expanse of space. Cellestial is your AI-powered portal to NASA's groundbreaking research, transforming complex data into celestial knowledge. Discover the secrets of life beyond Earth." />
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 6.5, duration: 0.5 }}
              >
                 <Button asChild size="lg" variant="futuristic" className="mt-12 text-lg">
                    <Link href="/home">Enter Cellestial</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

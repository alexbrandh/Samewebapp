'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LOGO_LETTERS = ['S', 'A', 'M', 'E', '.'];

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.18,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: LOGO_LETTERS.length * 0.18 + 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ clipPath: 'circle(150% at 58% 50.5%)' }}
          exit={{ clipPath: 'circle(0% at 56.3% 51.5%)' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">
            {/* Letras del logo aparecen una por una */}
            <div className="flex items-baseline">
              {LOGO_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground select-none"
                  style={{ display: 'inline-block' }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Línea que se expande debajo del logo */}
            <motion.div
              variants={underlineVariants}
              initial="hidden"
              animate="visible"
              className="h-px w-full bg-foreground/40 mt-3 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

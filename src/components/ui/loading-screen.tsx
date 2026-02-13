'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
        >
          {/* Logo animado */}
          <div className="flex flex-col items-center gap-8">
            {/* Logo con animación de fade y escala */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 1, 1],
                scale: [0.8, 1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut'
              }}
              className="relative"
            >
              <Image
                src="/2.png"
                alt="SAME."
                width={180}
                height={40}
                className="h-10 w-auto dark:hidden"
                priority
              />
              <Image
                src="/2B.png"
                alt="SAME."
                width={180}
                height={40}
                className="h-10 w-auto hidden dark:block"
                priority
              />
            </motion.div>

            {/* Barra de progreso animada */}
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>

            {/* Texto de carga */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-sm text-muted-foreground font-medium tracking-wide"
            >
              Loading luxury fragrances...
            </motion.p>
          </div>

          {/* Partículas decorativas opcionales */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                }}
                initial={{ 
                  y: -20,
                  opacity: 0 
                }}
                animate={{ 
                  y: '100vh',
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'linear'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

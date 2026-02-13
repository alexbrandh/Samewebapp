"use client";

import { motion } from "framer-motion";
import { Sparkle, MagnifyingGlass, Heart } from "phosphor-react";

interface QuizIntroProps {
  onStart: () => void;
}

export default function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 pt-24"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkle size={64} weight="fill" className="text-primary" />
              </motion.div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Find Your
            <span className="text-primary block">Perfect Scent</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Answer a few simple questions and discover the perfect fragrance
            that matches your personality and style
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
        >
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MagnifyingGlass size={24} weight="bold" className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Discover</h3>
            <p className="text-sm text-muted-foreground">
              Explore unique fragrances based on your preferences
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart size={24} weight="fill" className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Personalize</h3>
            <p className="text-sm text-muted-foreground">
              Personalized answers just for you
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkle size={24} weight="fill" className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Find</h3>
            <p className="text-sm text-muted-foreground">
              Your perfect perfume is just a few clicks away
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10">Start Quiz</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
            <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <p className="text-sm text-muted-foreground mt-4">
            Only takes 2 minutes ⏱️
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

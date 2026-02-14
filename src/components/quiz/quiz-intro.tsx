"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import type { QuizDefinition } from "@/lib/data/quiz-data";

interface QuizIntroProps {
  quiz: QuizDefinition;
  onStart: () => void;
  onBack: () => void;
}

export default function QuizIntro({ quiz, onStart, onBack }: QuizIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 pt-28 pb-20"
    >
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex justify-start"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} weight="light" />
            <span>Volver</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-5"
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
            {quiz.intro.heading}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {quiz.intro.subheading}
          </p>

          <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
            {quiz.intro.description}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wide uppercase text-primary-foreground bg-foreground rounded-full transition-all duration-300 hover:opacity-90"
          >
            <span>Comenzar</span>
            <ArrowRight
              size={16}
              weight="light"
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>

          <p className="text-xs text-muted-foreground/50 tracking-wide">
            {quiz.questionCount} preguntas · ~2 min
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

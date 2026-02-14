"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "phosphor-react";
import { QUIZ_DEFINITIONS, type QuizDefinition } from "@/lib/data/quiz-data";

interface QuizHubProps {
  onSelectQuiz: (quizId: string) => void;
}

export default function QuizHub({ onSelectQuiz }: QuizHubProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 pt-28 pb-20"
    >
      <div className="max-w-3xl w-full space-y-16">
        {/* Header */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center space-y-3"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            SAME.
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Descúbrete
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            No eliges un perfume al azar. Eliges la energía que proyectas.
          </p>
        </motion.div>

        {/* Quiz Cards */}
        <div className="space-y-4">
          {QUIZ_DEFINITIONS.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              index={index}
              onSelect={() => onSelectQuiz(quiz.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function QuizCard({
  quiz,
  index,
  onSelect,
}: {
  quiz: QuizDefinition;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className="group w-full flex items-center gap-6 bg-card border border-border hover:border-foreground/20 rounded-xl px-6 py-5 md:px-8 md:py-6 text-left transition-all duration-300"
    >
      {/* Number */}
      <span className="text-3xl md:text-4xl font-serif font-bold text-muted-foreground/30 group-hover:text-foreground/60 transition-colors shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold tracking-tight group-hover:text-foreground transition-colors">
          {quiz.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
          {quiz.subtitle}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/60">
          <span>{quiz.questionCount} preguntas</span>
          <span className="w-px h-3 bg-border" />
          <span>
            {quiz.resultCount === 1
              ? "1 fragancia"
              : `${quiz.resultCount} fragancias`}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={20}
        weight="light"
        className="shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300"
      />
    </motion.button>
  );
}

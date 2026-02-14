"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "phosphor-react";
import { QuizQuestion as QuizQuestionType, QuizAnswer } from "@/lib/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  answer?: QuizAnswer;
  onAnswer: (questionId: string, answer: QuizAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export default function QuizQuestion({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack,
  progress,
  currentStep,
  totalSteps,
}: QuizQuestionProps) {
  const [localAnswer, setLocalAnswer] = useState<QuizAnswer>(
    answer || (question.type === "multi-choice" ? [] : "")
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    setLocalAnswer(answer || (question.type === "multi-choice" ? [] : ""));
    if (question.type === "email" && typeof answer === "string") {
      setEmail(answer);
    }
  }, [question.id, answer, question.type]);

  const handleSingleChoice = (value: string) => {
    setLocalAnswer(value);
    onAnswer(question.id, value);
    setTimeout(() => onNext(), 350);
  };

  const handleMultiChoice = (value: string) => {
    const currentSelections = Array.isArray(localAnswer) ? localAnswer : [];
    const isSelected = currentSelections.includes(value);
    let newSelections: string[];
    if (isSelected) {
      newSelections = currentSelections.filter((v) => v !== value);
    } else {
      if (
        question.maxSelections &&
        currentSelections.length >= question.maxSelections
      )
        return;
      newSelections = [...currentSelections, value];
    }
    setLocalAnswer(newSelections);
    onAnswer(question.id, newSelections);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLocalAnswer(value);
    onAnswer(question.id, value);
  };

  const canProceed = () => {
    if (question.type === "multi-choice")
      return Array.isArray(localAnswer) && localAnswer.length > 0;
    if (question.type === "email")
      return email.includes("@") && email.includes(".");
    return localAnswer !== "";
  };

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] flex flex-col pt-20"
    >
      {/* Progress */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-wide text-muted-foreground/60 uppercase">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="w-full h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full space-y-10">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="text-2xl md:text-3xl font-serif font-bold text-center leading-snug"
          >
            {question.question}
          </motion.h2>

          {/* Single choice */}
          {question.type === "single-choice" && (
            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const selected = localAnswer === option.value;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSingleChoice(option.value)}
                    className={`group w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 ${
                      selected
                        ? "border-foreground bg-foreground/3"
                        : "border-border hover:border-foreground/30"
                    }`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-semibold shrink-0 transition-all duration-200 ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground group-hover:border-foreground/40"
                      }`}
                    >
                      {selected ? (
                        <Check size={14} weight="bold" />
                      ) : (
                        optionLetters[index] || index + 1
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Multi choice */}
          {question.type === "multi-choice" && (
            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const isSelected =
                  Array.isArray(localAnswer) &&
                  localAnswer.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleMultiChoice(option.value)}
                    className={`group w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "border-foreground bg-foreground/3"
                        : "border-border hover:border-foreground/30"
                    }`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-md border text-xs font-semibold shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check size={14} weight="bold" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
              <p className="text-center text-xs text-muted-foreground/50 pt-2">
                {Array.isArray(localAnswer) ? localAnswer.length : 0} /{" "}
                {question.maxSelections || "∞"} seleccionados
              </p>
            </div>
          )}

          {/* Email */}
          {question.type === "email" && (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={question.placeholder}
                className="w-full px-5 py-3.5 text-sm rounded-xl border border-border bg-card focus:border-foreground focus:ring-0 focus:outline-none transition-all"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur-md border-t border-border/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={!canGoBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={16} weight="light" />
              <span>Anterior</span>
            </button>

            {(question.type === "multi-choice" ||
              question.type === "email") && (
              <button
                onClick={onNext}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span>
                  {question.type === "email" ? "Ver resultados" : "Continuar"}
                </span>
                <ArrowRight size={16} weight="light" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

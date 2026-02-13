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
  const [localAnswer, setLocalAnswer] = useState<QuizAnswer>(answer || (question.type === "multi-choice" ? [] : ""));
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
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const handleMultiChoice = (value: string) => {
    const currentSelections = Array.isArray(localAnswer) ? localAnswer : [];
    const isSelected = currentSelections.includes(value);
    
    let newSelections: string[];
    if (isSelected) {
      newSelections = currentSelections.filter((v) => v !== value);
    } else {
      if (question.maxSelections && currentSelections.length >= question.maxSelections) {
        return;
      }
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
    if (question.type === "multi-choice") {
      return Array.isArray(localAnswer) && localAnswer.length > 0;
    }
    if (question.type === "email") {
      return email.includes("@") && email.includes(".");
    }
    return localAnswer !== "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-[calc(100vh-80px)] flex flex-col pt-20"
    >
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-3xl w-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              {question.question}
            </h2>
          </motion.div>

          {/* Single choice options */}
          {question.type === "single-choice" && (
            <motion.div
              className="grid gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {question.options?.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSingleChoice(option.value)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                    localAnswer === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {option.label}
                      </h3>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        localAnswer === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground group-hover:border-primary"
                      }`}
                    >
                      {localAnswer === option.value && (
                        <Check size={16} weight="bold" className="text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Multi choice options */}
          {question.type === "multi-choice" && (
            <>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.options?.map((option, index) => {
                  const isSelected = Array.isArray(localAnswer) && localAnswer.includes(option.value);
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleMultiChoice(option.value)}
                      className={`group relative p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-left flex-1">
                            {option.label}
                          </h3>
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ml-2 ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground group-hover:border-primary"
                            }`}
                          >
                            {isSelected && (
                              <Check size={14} weight="bold" className="text-primary-foreground" />
                            )}
                          </div>
                        </div>
                        {option.description && (
                          <p className="text-xs text-muted-foreground text-left">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
              <p className="text-center text-sm text-muted-foreground">
                Selected: {Array.isArray(localAnswer) ? localAnswer.length : 0} of {question.maxSelections || "∞"}
              </p>
            </>
          )}

          {/* Email input */}
          {question.type === "email" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={question.placeholder}
                className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-border bg-card focus:border-primary focus:ring-0 focus:outline-none transition-all"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onPrevious}
              disabled={!canGoBack}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={20} weight="bold" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {question.type === "multi-choice" && (
              <button
                onClick={onNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <span>Continue</span>
                <ArrowRight size={20} weight="bold" />
              </button>
            )}

            {question.type === "email" && (
              <button
                onClick={onNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <span>View Results</span>
                <ArrowRight size={20} weight="bold" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

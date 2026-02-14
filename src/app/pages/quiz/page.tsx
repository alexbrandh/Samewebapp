"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { motion, AnimatePresence } from "framer-motion";
import QuizHub from "@/components/quiz/quiz-hub";
import QuizIntro from "@/components/quiz/quiz-intro";
import QuizQuestion from "@/components/quiz/quiz-question";
import QuizResults from "@/components/quiz/quiz-results";
import { Footer } from "@/components/sections/footer";
import { QuizAnswer } from "@/lib/types/quiz";
import {
  QUIZ_DEFINITIONS,
  type QuizDefinition,
  type QuizQuestionDef,
} from "@/lib/data/quiz-data";

type Phase = "hub" | "intro" | "questions" | "results";

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("hub");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDefinition | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Get current questions based on quiz + answers (handles gender branching for Test 2)
  const questions: QuizQuestionDef[] = useMemo(() => {
    if (!selectedQuiz) return [];
    return selectedQuiz.getQuestions(answers);
  }, [selectedQuiz, answers]);

  // Adapt QuizQuestionDef to the format QuizQuestion component expects
  const currentQuestionForComponent = useMemo(() => {
    if (currentStep < 0 || currentStep >= questions.length) return null;
    const q = questions[currentStep];
    return {
      id: q.id,
      question: q.question,
      type: "single-choice" as const,
      options: q.options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        description: opt.description,
      })),
    };
  }, [questions, currentStep]);

  const progress = questions.length > 0
    ? ((currentStep + 1) / questions.length) * 100
    : 0;

  // --- Handlers ---

  const handleSelectQuiz = (quizId: string) => {
    const quiz = QUIZ_DEFINITIONS.find((q) => q.id === quizId);
    if (!quiz) return;
    setSelectedQuiz(quiz);
    setAnswers({});
    setCurrentStep(0);
    setPhase("intro");
  };

  const handleStartQuiz = () => {
    setPhase("questions");
  };

  const handleAnswer = (questionId: string, answer: QuizAnswer) => {
    const value = typeof answer === "string" ? answer : "";
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    // After answering, check if we need to reload questions (for gender branching in Test 2)
    // The questions memo will automatically update based on new answers
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setPhase("results");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleBackToHub = () => {
    setPhase("hub");
    setSelectedQuiz(null);
    setAnswers({});
    setCurrentStep(0);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setPhase("intro");
  };

  return (
    <>
      <PageContainer>
        <AnimatePresence mode="wait">
          {phase === "hub" && (
            <QuizHub key="hub" onSelectQuiz={handleSelectQuiz} />
          )}

          {phase === "intro" && selectedQuiz && (
            <QuizIntro
              key="intro"
              quiz={selectedQuiz}
              onStart={handleStartQuiz}
              onBack={handleBackToHub}
            />
          )}

          {phase === "questions" && currentQuestionForComponent && (
            <QuizQuestion
              key={`question-${currentStep}-${currentQuestionForComponent.id}`}
              question={currentQuestionForComponent}
              answer={answers[currentQuestionForComponent.id]}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoBack={currentStep > 0}
              progress={progress}
              currentStep={currentStep + 1}
              totalSteps={questions.length}
            />
          )}

          {phase === "results" && selectedQuiz && (
            <QuizResults
              key="results"
              quizDefinition={selectedQuiz}
              answers={answers}
              questions={questions}
              onRestart={handleRestart}
              onBackToHub={handleBackToHub}
            />
          )}
        </AnimatePresence>
      </PageContainer>
      <Footer />
    </>
  );
}

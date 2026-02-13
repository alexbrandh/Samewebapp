"use client";

import { useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { motion, AnimatePresence } from "framer-motion";
import QuizIntro from "@/components/quiz/quiz-intro";
import QuizQuestion from "@/components/quiz/quiz-question";
import QuizResults from "@/components/quiz/quiz-results";
import { Footer } from "@/components/sections/footer";
import { QuizState, QuizAnswer } from "@/lib/types/quiz";

const QUIZ_QUESTIONS = [
  {
    id: "purchased-before",
    question: "Have you purchased a perfume with us before?",
    type: "single-choice" as const,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "has-favorites",
    question: "Do you already have one or more favorite fragrances?",
    type: "single-choice" as const,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "scent-preferences",
    question: "Choose up to three scents you like:",
    type: "multi-choice" as const,
    maxSelections: 3,
    options: [
      { value: "floral", label: "Floral", description: "Rose, jasmine, lavender" },
      { value: "woody", label: "Woody", description: "Sandalwood, cedar, vetiver" },
      { value: "citrus", label: "Citrus", description: "Lemon, bergamot, orange" },
      { value: "oriental", label: "Oriental", description: "Vanilla, spices, amber" },
      { value: "fresh", label: "Fresh", description: "Marine, aquatic, mint" },
      { value: "fruity", label: "Fruity", description: "Apple, peach, berries" },
      { value: "spicy", label: "Spicy", description: "Pepper, cinnamon, ginger" },
      { value: "sweet", label: "Sweet", description: "Caramel, honey, vanilla" },
    ],
  },
  {
    id: "scent-dislikes",
    question: "Choose up to three scents you DON'T like:",
    type: "multi-choice" as const,
    maxSelections: 3,
    options: [
      { value: "floral", label: "Floral" },
      { value: "woody", label: "Woody" },
      { value: "citrus", label: "Citrus" },
      { value: "oriental", label: "Oriental" },
      { value: "fresh", label: "Fresh" },
      { value: "fruity", label: "Fruity" },
      { value: "spicy", label: "Spicy" },
      { value: "sweet", label: "Sweet" },
    ],
  },
  {
    id: "fragrance-intensity",
    question: "I want my fragrance to...",
    type: "single-choice" as const,
    options: [
      { value: "expressive", label: "BE BOLD & EXPRESSIVE", description: "Make a statement and leave a lasting impression" },
      { value: "subtle", label: "BE SOFT & SUBTLE", description: "Delicate and discreet" },
    ],
  },
  {
    id: "exploration",
    question: "I'm looking for something...",
    type: "single-choice" as const,
    options: [
      { value: "similar", label: "Similar to my favorite perfume" },
      { value: "different", label: "New and different" },
    ],
  },
  {
    id: "gender-preference",
    question: "I prefer:",
    type: "single-choice" as const,
    options: [
      { value: "feminine", label: "A feminine fragrance" },
      { value: "masculine", label: "A masculine fragrance" },
      { value: "unisex", label: "A unisex fragrance" },
      { value: "any", label: "Any possibility" },
    ],
  },
  {
    id: "presentation",
    question: "Do you prefer long-lasting perfumes?",
    type: "single-choice" as const,
    options: [
      { value: "classic", label: "Classic (8 to 12 hours)", description: "Perfect for daily use" },
      { value: "extrait", label: "Extrait (12 to 18 hours)", description: "Higher concentration for maximum duration" },
    ],
  },
  {
    id: "email",
    question: "Enter your email to discover your new favorite perfume",
    type: "email" as const,
    placeholder: "your@email.com",
  },
];

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: -1, // -1 means intro
    answers: {},
    completed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitQuiz = async (email: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answers: quizState.answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      setQuizState({ ...quizState, completed: true });
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert("Something went wrong saving your results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStart = () => {
    setQuizState({ ...quizState, currentStep: 0 });
  };

  const handleAnswer = (questionId: string, answer: QuizAnswer) => {
    setQuizState({
      ...quizState,
      answers: { ...quizState.answers, [questionId]: answer },
    });
  };

  const handleNext = () => {
    const currentQuestion = QUIZ_QUESTIONS[quizState.currentStep];

    // If we are on the email step (last step), submit the quiz
    if (currentQuestion.id === "email") {
      const emailAnswer = quizState.answers["email"];
      // Email validation is already done in QuizQuestion but double check here
      if (typeof emailAnswer === "string" && emailAnswer.includes("@")) {
        submitQuiz(emailAnswer);
      }
      return;
    }

    if (quizState.currentStep < QUIZ_QUESTIONS.length - 1) {
      setQuizState({ ...quizState, currentStep: quizState.currentStep + 1 });
    } else {
      setQuizState({ ...quizState, completed: true });
    }
  };

  const handlePrevious = () => {
    if (quizState.currentStep > 0) {
      setQuizState({ ...quizState, currentStep: quizState.currentStep - 1 });
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentStep: -1,
      answers: {},
      completed: false,
    });
  };

  const currentQuestion = QUIZ_QUESTIONS[quizState.currentStep];
  const progress = ((quizState.currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <>
      <LoadingScreen isLoading={isSubmitting} />
      <PageContainer className="bg-linear-to-br from-background via-background to-accent/10">
        <AnimatePresence mode="wait">
          {quizState.currentStep === -1 && (
            <QuizIntro key="intro" onStart={handleStart} />
          )}

          {quizState.currentStep >= 0 && !quizState.completed && (
            <QuizQuestion
              key={`question-${quizState.currentStep}`}
              question={currentQuestion}
              answer={quizState.answers[currentQuestion.id]}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoBack={quizState.currentStep > 0}
              progress={progress}
              currentStep={quizState.currentStep + 1}
              totalSteps={QUIZ_QUESTIONS.length}
            />
          )}

          {quizState.completed && (
            <QuizResults
              key="results"
              answers={quizState.answers}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </PageContainer>
      <Footer />
    </>
  );
}

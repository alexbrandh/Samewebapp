export type QuizAnswer = string | string[];

export interface QuizState {
  currentStep: number;
  answers: Record<string, QuizAnswer>;
  completed: boolean;
}

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "single-choice" | "multi-choice" | "email";
  options?: QuizOption[];
  maxSelections?: number;
  placeholder?: string;
}

export interface PerfumeRecommendation {
  id: string;
  name: string;
  description: string;
  notes: string[];
  price: number;
  image: string;
  match: number;
}

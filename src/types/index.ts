export type Option = {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
};

export type Question = {
  id: string;
  text: string;
  imageUrl?: string;
  options: Option[];
  correctAnswerId?: string; // Optional for practice, but normally required
};

export type QuestionSet = {
  id: string;
  name: string;
  questions: Question[];
};

export type Answer = {
  questionId: string;
  selectedOptionId: string | null;
  timeTakenMs?: number;
};

export type TestResult = {
  score: number; // +1 for correct, -0.4 for incorrect, 0 for empty
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalQuestions: number;
  answers: Answer[];
};

export type TestState = 'HOME' | 'INPUT' | 'TAKING' | 'RESULT';

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

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED' | 'MARKETPLACE';

export type User = {
  id: string;
  name: string;
  password?: string; // For the prototype auth
  isAdmin: boolean;
};

export type QuestionSet = {
  id: string;
  name: string;
  ownerId: string;
  coAdminIds: string[]; // Additional users who can manage the set
  questions: Question[];
  visibility: Visibility;
  allowedIds?: string[]; // Used only if visibility is RESTRICTED
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

export type TestState = 'LOGIN' | 'HOME' | 'INPUT' | 'TAKING' | 'RESULT' | 'MANAGE_SET' | 'EDIT_SET';

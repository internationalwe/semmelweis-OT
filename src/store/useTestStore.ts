import { create } from 'zustand';
import type { Question, Answer, TestState } from '../types';

interface TestStore {
  // Test Data
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;

  // App State
  testState: TestState;
  setTestState: (state: TestState) => void;

  // Taking State
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemainingSeconds: number;
  timerActive: boolean;
  
  startTest: () => void;
  submitAnswer: (questionId: string, selectedOptionId: string | null) => void;
  nextQuestion: () => void;
  tickTimer: () => void;
  finishTest: () => void;
  resetTest: () => void;
}

const TOTAL_TIME_SECONDS = 20 * 60; // 20 minutes

export const useTestStore = create<TestStore>((set) => ({
  questions: [],
  testState: 'INPUT',
  currentQuestionIndex: 0,
  answers: [],
  timeRemainingSeconds: TOTAL_TIME_SECONDS,
  timerActive: false,

  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  
  setTestState: (testState) => set({ testState }),

  startTest: () => set({
    testState: 'TAKING',
    currentQuestionIndex: 0,
    answers: [],
    timeRemainingSeconds: TOTAL_TIME_SECONDS,
    timerActive: true,
  }),

  submitAnswer: (questionId, selectedOptionId) => set((state) => {
    const existingIndex = state.answers.findIndex(a => a.questionId === questionId);
    let newAnswers = [...state.answers];
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { ...newAnswers[existingIndex], selectedOptionId };
    } else {
      newAnswers.push({ questionId, selectedOptionId });
    }
    return { answers: newAnswers };
  }),

  nextQuestion: () => set((state) => {
    // Determine if test is finished
    if (state.currentQuestionIndex >= state.questions.length - 1) {
      return { 
        testState: 'RESULT', 
        timerActive: false 
      };
    }
    return {
      currentQuestionIndex: state.currentQuestionIndex + 1
    };
  }),

  tickTimer: () => set((state) => {
    if (!state.timerActive) return state;
    if (state.timeRemainingSeconds <= 1) {
      return { timeRemainingSeconds: 0, timerActive: false, testState: 'RESULT' };
    }
    return { timeRemainingSeconds: state.timeRemainingSeconds - 1 };
  }),

  finishTest: () => set({ testState: 'RESULT', timerActive: false }),

  resetTest: () => set({
    testState: 'INPUT',
    currentQuestionIndex: 0,
    answers: [],
    timeRemainingSeconds: TOTAL_TIME_SECONDS,
    timerActive: false,
    questions: []
  })
}));

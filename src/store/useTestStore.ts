import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Answer, TestState, QuestionSet } from '../types';

interface TestStore {
  // Test Data
  questionSets: QuestionSet[];
  addQuestionSet: (set: QuestionSet) => void;
  selectSetAndStart: (setId: string) => void;
  deleteQuestionSet: (setId: string) => void;
  
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

export const useTestStore = create<TestStore>()(
  persist(
    (set) => ({
  questionSets: [],
  questions: [],
  testState: 'HOME',
  currentQuestionIndex: 0,
  answers: [],
  timeRemainingSeconds: TOTAL_TIME_SECONDS,
  timerActive: false,

  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  
  addQuestionSet: (newSet) => set((state) => ({ 
    questionSets: [...state.questionSets, newSet],
    testState: 'HOME'
  })),

  deleteQuestionSet: (setId) => set((state) => ({
    questionSets: state.questionSets.filter(s => s.id !== setId)
  })),

  selectSetAndStart: (setId) => set((state) => {
    const setObj = state.questionSets.find(s => s.id === setId);
    if (!setObj) return state;
    return {
      questions: setObj.questions,
      testState: 'TAKING',
      currentQuestionIndex: 0,
      answers: [],
      timeRemainingSeconds: TOTAL_TIME_SECONDS,
      timerActive: true,
    };
  }),

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
    testState: 'HOME',
    currentQuestionIndex: 0,
    answers: [],
    timeRemainingSeconds: TOTAL_TIME_SECONDS,
    timerActive: false,
    questions: []
  })
    }),
    {
      name: 'online-test-store',
      partialize: (state) => ({ questionSets: state.questionSets }),
    }
  )
);

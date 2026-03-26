import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Answer, TestState, QuestionSet, Visibility, User } from '../types';

export const INITIAL_ADMINS: User[] = [
  { id: 'admin', name: 'System Admin (👑)', password: 'admin', isAdmin: true },
];

interface TestStore {
  // Auth
  users: User[];
  currentUser: User | null;
  login: (id: string, pw: string) => boolean;
  register: (id: string, pw: string, name: string) => boolean;
  logout: () => void;
  
  // Set Management
  transferOwnership: (setId: string, newOwnerId: string) => boolean;
  addCoAdmin: (setId: string, newAdminId: string) => boolean;
  removeCoAdmin: (setId: string, adminIdToRemove: string) => void;

  // Test Data
  questionSets: QuestionSet[];
  addQuestionSet: (set: QuestionSet) => void;
  selectSetAndStart: (setId: string) => void;
  
  managingSetId: string | null;
  openManageSet: (setId: string) => void;
  updateSetVisibility: (setId: string, visibility: Visibility, allowedIds: string[]) => void;
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
    (set, get) => ({
  users: INITIAL_ADMINS,
  currentUser: null,
  
  login: (id, pw) => {
    const user = get().users.find(u => u.id === id && u.password === pw);
    if (user) {
      set({ currentUser: user, testState: 'HOME' });
      return true;
    }
    return false;
  },

  register: (id, pw, name) => {
    const exists = get().users.some(u => u.id === id);
    if (exists) return false;
    const newUser: User = { id, password: pw, name, isAdmin: false };
    set(state => ({ users: [...state.users, newUser], currentUser: newUser, testState: 'HOME' }));
    return true;
  },

  logout: () => set({ currentUser: null, testState: 'LOGIN' }),
  
  transferOwnership: (setId, newOwnerId) => {
    const userExists = get().users.some(u => u.id === newOwnerId);
    if (!userExists) return false;
    
    set((state) => ({
      questionSets: state.questionSets.map(qs =>
        qs.id === setId ? { ...qs, ownerId: newOwnerId, coAdminIds: qs.coAdminIds.filter(id => id !== newOwnerId) } : qs
      )
    }));
    return true;
  },

  addCoAdmin: (setId, newAdminId) => {
    const userExists = get().users.some(u => u.id === newAdminId);
    if (!userExists) return false;

    set((state) => ({
      questionSets: state.questionSets.map(qs => {
        if (qs.id === setId && qs.ownerId !== newAdminId && !qs.coAdminIds.includes(newAdminId)) {
          return { ...qs, coAdminIds: [...qs.coAdminIds, newAdminId] };
        }
        return qs;
      })
    }));
    return true;
  },

  removeCoAdmin: (setId, adminIdToRemove) => {
    set((state) => ({
      questionSets: state.questionSets.map(qs =>
        qs.id === setId ? { ...qs, coAdminIds: qs.coAdminIds.filter(id => id !== adminIdToRemove) } : qs
      )
    }));
  },

  questionSets: [],
  managingSetId: null,
  questions: [],
  testState: 'LOGIN',
  currentQuestionIndex: 0,
  answers: [],
  timeRemainingSeconds: TOTAL_TIME_SECONDS,
  timerActive: false,

  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  
  openManageSet: (setId) => set({ managingSetId: setId, testState: 'MANAGE_SET' }),
  
  updateSetVisibility: (setId, visibility, allowedIds) => set((state) => ({
    questionSets: state.questionSets.map(qs => 
      qs.id === setId ? { ...qs, visibility, allowedIds } : qs
    )
  })),

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
    questions: [],
    managingSetId: null
  })
    }),
    {
      name: 'online-test-store',
      partialize: (state) => ({ questionSets: state.questionSets }),
    }
  )
);

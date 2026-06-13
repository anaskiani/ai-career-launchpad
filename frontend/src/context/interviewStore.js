import { create } from 'zustand';
import interviewService from '../services/interviewService';

export const useInterviewStore = create((set, get) => ({
  roles: [],
  currentInterview: null,
  history: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.getRoles();
      set({ roles: res.data.roles, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to load interview roles',
        isLoading: false,
      });
    }
  },

  fetchHistory: async () => {
    try {
      const res = await interviewService.getHistory();
      set({ history: res.data.history || [] });
    } catch (err) {
      console.error('Failed to load interview history', err);
    }
  },

  startInterview: async (role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.startInterview(role);
      set({ currentInterview: res.data.interview, isLoading: false });
      await get().fetchHistory();
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to start interview',
        isLoading: false,
      });
      return false;
    }
  },

  updateAnswer: (index, answer) =>
    set((state) => ({
      currentInterview: state.currentInterview
        ? {
            ...state.currentInterview,
            questions: state.currentInterview.questions.map((item, itemIndex) =>
              itemIndex === index ? { ...item, answer } : item
            ),
          }
        : null,
    })),

  saveAnswers: async () => {
    const currentInterview = get().currentInterview;

    if (!currentInterview?._id) {
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      const res = await interviewService.saveAnswers(currentInterview._id, {
        questions: currentInterview.questions,
      });
      set({ currentInterview: res.data.interview, isSaving: false });
      await get().fetchHistory();
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to save answers',
        isSaving: false,
      });
      return false;
    }
  },

  submitInterview: async () => {
    const currentInterview = get().currentInterview;

    if (!currentInterview?._id) {
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await interviewService.saveAnswers(currentInterview._id, {
        questions: currentInterview.questions,
      });
      const res = await interviewService.submitInterview(currentInterview._id, {
        questions: currentInterview.questions,
      });
      set({ currentInterview: res.data.interview, isSaving: false });
      await get().fetchHistory();
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to submit interview',
        isSaving: false,
      });
      return false;
    }
  },

  loadInterview: async (interviewId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.getSession(interviewId);
      set({ currentInterview: res.data.interview, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to load interview session',
        isLoading: false,
      });
    }
  },

  clearCurrentInterview: () => set({ currentInterview: null }),
}));

import { create } from 'zustand';
import skillService from '../services/skillService';

export const useSkillStore = create((set) => ({
  roles: [],
  analysis: null,
  history: [],
  isLoading: false,
  isAnalyzing: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await skillService.getRoles();
      set({ roles: res.data.roles, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Failed to load roles', isLoading: false });
    }
  },

  analyzeGap: async (targetRole) => {
    set({ isAnalyzing: true, error: null, analysis: null });
    try {
      const res = await skillService.analyzeGap(targetRole);
      set({ analysis: res.data.analysis, isAnalyzing: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Analysis failed', isAnalyzing: false });
      return false;
    }
  },

  fetchHistory: async () => {
    try {
      const res = await skillService.getHistory();
      set({ history: res.data.history });
    } catch (err) {
      console.error('Failed to load history', err);
    }
  },

  loadAnalysis: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await skillService.getAnalysis(id);
      set({ analysis: res.data.analysis, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Failed to load analysis', isLoading: false });
    }
  },

  deleteFromHistory: async (id) => {
    try {
      await skillService.deleteAnalysis(id);
      set((state) => ({ history: state.history.filter((h) => h._id !== id) }));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  },

  clearAnalysis: () => set({ analysis: null, error: null }),
}));

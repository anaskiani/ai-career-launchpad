import { create } from 'zustand';
import jobService from '../services/jobService';

const DEFAULT_FILTERS = {
  keyword: '',
  location: '',
  type: 'all',
  page: 1,
  limit: 6,
};

export const useJobStore = create((set, get) => ({
  filters: DEFAULT_FILTERS,
  jobs: [],
  savedJobs: [],
  selectedJob: null,
  pagination: null,
  source: null,
  fallbackUsed: false,
  isLoading: false,
  isSaving: false,
  error: null,

  setFilters: (updates) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
      },
    })),

  fetchJobs: async (overrides = {}) => {
    const filters = {
      ...get().filters,
      ...overrides,
    };

    set({
      isLoading: true,
      error: null,
      filters,
    });

    try {
      const res = await jobService.searchJobs(filters);
      set({
        jobs: res.data.jobs,
        pagination: res.data.pagination,
        source: res.data.source,
        fallbackUsed: res.data.fallbackUsed,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to search jobs',
        isLoading: false,
      });
    }
  },

  fetchSavedJobs: async () => {
    try {
      const res = await jobService.getSavedJobs();
      set({ savedJobs: res.data.jobs || [] });
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    }
  },

  selectJob: async (job) => {
    set({ selectedJob: job });

    try {
      const res = await jobService.getJobDetails(job.jobId);
      set({ selectedJob: res.data.job });
    } catch (err) {
      console.error('Failed to load job details', err);
    }
  },

  clearSelectedJob: () => set({ selectedJob: null }),

  toggleSaveJob: async (job) => {
    set({ isSaving: true, error: null });

    try {
      if (job.isSaved) {
        await jobService.unsaveJob(job.jobId);
      } else {
        await jobService.saveJob(job);
      }

      set((state) => ({
        jobs: state.jobs.map((item) =>
          item.jobId === job.jobId ? { ...item, isSaved: !item.isSaved } : item
        ),
        selectedJob:
          state.selectedJob?.jobId === job.jobId
            ? { ...state.selectedJob, isSaved: !job.isSaved }
            : state.selectedJob,
        isSaving: false,
      }));

      await get().fetchSavedJobs();
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to update saved jobs',
        isSaving: false,
      });
      return false;
    }
  },
}));

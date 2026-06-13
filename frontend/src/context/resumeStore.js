import { create } from 'zustand';
import resumeService from '../services/resumeService';

const emptyResume = {
  title: 'My Resume',
  personalInfo: {
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', github: '', summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

export const useResumeStore = create((set, get) => ({
  resume: null,
  form: { ...emptyResume },
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
  hasChanges: false,

  fetchResume: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await resumeService.getResume();
      const data = res.data;
      if (data) {
        set({
          resume: data,
          form: {
            title: data.title || 'My Resume',
            personalInfo: { ...emptyResume.personalInfo, ...data.personalInfo },
            experiences: data.experiences || [],
            education: data.education || [],
            skills: data.skills || [],
            certifications: data.certifications || [],
            projects: data.projects || [],
          },
          isLoading: false,
        });
      } else {
        set({ resume: null, form: { ...emptyResume }, isLoading: false });
      }
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to load resume',
        isLoading: false,
      });
    }
  },

  saveResume: async () => {
    const { resume, form } = get();
    set({ isSaving: true, error: null, successMessage: null });
    try {
      let res;
      if (resume && resume._id) {
        res = await resumeService.updateResume(resume._id, form);
      } else {
        res = await resumeService.createResume(form);
      }
      set({
        resume: res.data.resume,
        isSaving: false,
        hasChanges: false,
        successMessage: 'Resume saved successfully!',
      });
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error?.message ||
        'Failed to save resume';
      set({ error: msg, isSaving: false });
      return false;
    }
  },

  updateField: (path, value) => {
    set((state) => {
      const newForm = { ...state.form };
      // Handle nested paths like 'personalInfo.fullName'
      const keys = path.split('.');
      if (keys.length === 1) {
        newForm[keys[0]] = value;
      } else if (keys.length === 2) {
        newForm[keys[0]] = { ...newForm[keys[0]], [keys[1]]: value };
      }
      return { form: newForm, hasChanges: true };
    });
  },

  updateSection: (section, value) => {
    set((state) => ({
      form: { ...state.form, [section]: value },
      hasChanges: true,
    }));
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));

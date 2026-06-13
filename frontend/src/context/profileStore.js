import { create } from 'zustand';
import profileService from '../services/profileService';

export const useProfileStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getProfile();
      set({ profile: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to load profile',
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ isSaving: true, error: null, successMessage: null });
    try {
      const res = await profileService.updateProfile(data);
      set({
        profile: res.data.user,
        isSaving: false,
        successMessage: 'Profile updated successfully!',
      });
      return true;
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error?.message ||
        'Failed to update profile';
      set({ error: message, isSaving: false });
      return false;
    }
  },

  uploadAvatar: async (file) => {
    set({ isSaving: true, error: null, successMessage: null });
    try {
      const res = await profileService.uploadAvatar(file);
      set((state) => ({
        profile: { ...state.profile, profileImage: res.data.profileImage },
        isSaving: false,
        successMessage: 'Avatar uploaded!',
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to upload avatar',
        isSaving: false,
      });
      return false;
    }
  },

  deleteAvatar: async () => {
    set({ isSaving: true, error: null, successMessage: null });
    try {
      await profileService.deleteAvatar();
      set((state) => ({
        profile: { ...state.profile, profileImage: '' },
        isSaving: false,
        successMessage: 'Avatar removed',
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || 'Failed to delete avatar',
        isSaving: false,
      });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));

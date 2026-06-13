import api from './api';

const profileService = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAvatar: () => api.delete('/users/profile/avatar'),

  deleteAccount: () => api.delete('/users/account'),
};

export default profileService;

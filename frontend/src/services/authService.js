import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  login: (credentials) => api.post('/auth/login', credentials),
  verifySecurityQuestion: (data) => api.post('/auth/verify-security-question', data),
  verifySecurityPIN: (data) => api.post('/auth/verify-security-pin', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const jobService = {
  searchJobs: (params) => api.get('/jobs/search', { params }),
  getSavedJobs: () => api.get('/jobs/saved'),
  saveJob: (jobId) => api.post(`/jobs/save/${jobId}`),
};

export const interviewService = {
  getQuestions: (params) => api.get('/interviews/questions', { params }),
  startInterview: (data) => api.post('/interviews/start', data),
  submitInterview: (data) => api.post('/interviews/submit', data),
};

import api from './api';

const interviewService = {
  getRoles: () => api.get('/interviews/roles'),
  getQuestions: (role) => api.get('/interviews/questions', { params: { role } }),
  startInterview: (role) => api.post('/interviews/start', { role }),
  saveAnswers: (interviewId, payload) => api.put(`/interviews/${interviewId}/answers`, payload),
  submitInterview: (interviewId, payload) => api.post(`/interviews/${interviewId}/submit`, payload),
  getHistory: () => api.get('/interviews/history'),
  getSession: (interviewId) => api.get(`/interviews/${interviewId}`),
};

export default interviewService;

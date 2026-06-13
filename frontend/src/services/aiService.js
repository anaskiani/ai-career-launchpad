import api from './api';

export const aiService = {
  chat: (message, context) => api.post('/ai/chat', { message, topic: context?.topic }),
  getHistory: () => api.get('/ai/history'),
  getRecommendations: (skills) => api.post('/ai/recommendations', { skills }),
  analyzeResume: (resumeText) => api.post('/ai/analyze-resume', { resumeText }),
};

import api from './api';

const skillService = {
  getRoles: () => api.get('/skills/roles'),
  getRoleSkills: (role) => api.get(`/skills/roles/${encodeURIComponent(role)}`),
  analyzeGap: (targetRole) => api.post('/skills/analyze', { targetRole }),
  getHistory: () => api.get('/skills/history'),
  getAnalysis: (id) => api.get(`/skills/analysis/${id}`),
  deleteAnalysis: (id) => api.delete(`/skills/analysis/${id}`),
};

export default skillService;

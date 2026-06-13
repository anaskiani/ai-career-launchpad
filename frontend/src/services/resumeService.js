import api from './api';

const resumeService = {
  getResume: () => api.get('/resume'),
  createResume: (data) => api.post('/resume', data),
  updateResume: (id, data) => api.put(`/resume/${id}`, data),
  deleteResume: (id) => api.delete(`/resume/${id}`),
};

export default resumeService;

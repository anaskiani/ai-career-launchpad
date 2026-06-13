import api from './api';

const jobService = {
  searchJobs: (params) => api.get('/jobs/search', { params }),
  getSavedJobs: () => api.get('/jobs/saved'),
  getJobDetails: (jobId) => api.get(`/jobs/${jobId}`),
  saveJob: (job) => api.post(`/jobs/save/${job.jobId}`, { job }),
  unsaveJob: (jobId) => api.delete(`/jobs/save/${jobId}`),
};

export default jobService;

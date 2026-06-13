import axios from 'axios';
import { fallbackJobs } from '../data/fallbackJobs.js';
import { getCache, setCache } from './simpleCache.js';

const JOB_SEARCH_TTL = 5 * 60 * 1000;
const JOB_DETAILS_TTL = 10 * 60 * 1000;

const normalizeRemotiveJob = (job) => {
  return {
    jobId: job.id.toString(),
    title: job.title || 'Untitled role',
    company: job.company_name || 'Unknown company',
    location: job.candidate_required_location || 'Remote',
    type: job.job_type ? job.job_type.replace('_', '-') : 'Full-time',
    description: job.description || 'No description available.',
    skills: job.tags || [],
    salary: { min: null, max: null, currency: job.salary ? job.salary : 'USD' },
    postedDate: job.publication_date ? new Date(job.publication_date).toISOString() : new Date().toISOString(),
    applicationDeadline: null,
    url: job.url || '#',
    source: 'remotive',
    isRemote: true,
  };
};

const paginate = (items, page, limit) => {
  const startIndex = (page - 1) * limit;
  const results = items.slice(startIndex, startIndex + limit);

  return {
    results,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
      hasNextPage: startIndex + limit < items.length,
      hasPrevPage: page > 1,
    },
  };
};

const filterFallbackJobs = ({ keyword, location, type }) => {
  const keywordText = keyword.trim().toLowerCase();
  const locationText = location.trim().toLowerCase();
  const normalizedType = type.toLowerCase();

  return fallbackJobs.filter((job) => {
    const jobText = [job.title, job.company, job.description, ...(job.skills || [])]
      .join(' ')
      .toLowerCase();

    const terms = keywordText.split(/\s+/).filter(Boolean);
    const matchesKeyword = terms.length === 0 || terms.every(term => jobText.includes(term));

    const matchesLocation =
      !locationText || job.location.toLowerCase().includes(locationText);

    const matchesType =
      normalizedType === 'all' ||
      (normalizedType === 'internship'
        ? job.type.toLowerCase() === 'internship' || jobText.includes('intern')
        : job.type.toLowerCase() !== 'internship' && !jobText.includes('intern'));

    return matchesKeyword && matchesLocation && matchesType;
  });
};

const getFallbackResults = ({ keyword = '', location = '', type = 'all', page = 1, limit = 6 }) => {
  const filtered = filterFallbackJobs({ keyword, location, type });
  const paginated = paginate(filtered, page, limit);

  return {
    ...paginated,
    source: 'fallback',
    fallbackUsed: true,
  };
};

export const searchJobsFromProvider = async ({
  keyword = '',
  location = '',
  type = 'all',
  page = 1,
  limit = 6,
}) => {
  const cacheKey = `jobs:search:remotive:${keyword}:${location}:${type}:${page}:${limit}`;
  const cached = getCache(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get('https://remotive.com/api/remote-jobs', {
      params: {
        search: keyword || undefined,
        limit: 50, // Remotive allows returning a chunk of jobs
      },
      timeout: 12000,
    });

    const rawJobs = response.data?.jobs || [];
    let normalizedJobs = rawJobs.map(normalizeRemotiveJob);

    // Apply local filters if the user requested any
    if (keyword || location || type !== 'all') {
      const keywordText = keyword.trim().toLowerCase();
      const locationText = location.trim().toLowerCase();
      const normalizedType = type.toLowerCase();

      normalizedJobs = normalizedJobs.filter((job) => {
        const jobText = [job.title, job.company, job.description, ...(job.skills || [])]
          .join(' ')
          .toLowerCase();

        const terms = keywordText.split(/\s+/).filter(Boolean);
        const matchesKeyword = terms.length === 0 || terms.every(term => jobText.includes(term));

        const matchesLocation =
          !locationText || job.location.toLowerCase().includes(locationText);

        const matchesType =
          normalizedType === 'all' ||
          (normalizedType === 'internship'
            ? job.type.toLowerCase() === 'internship' || jobText.includes('intern')
            : job.type.toLowerCase() !== 'internship' && !jobText.includes('intern'));

        return matchesKeyword && matchesLocation && matchesType;
      });
    }

    // Since we filtered locally, we might not have enough results for a full page.
    // If the results are empty, we fall back to mock data to ensure the UI always looks populated.
    if (normalizedJobs.length === 0) {
      return getFallbackResults({ keyword, location, type, page, limit });
    }

    // If no filters were applied, we use the API's pagination.
    // If filters were applied, we just paginate the filtered chunk we got.
    const results = {
      results: normalizedJobs.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: normalizedJobs.length,
        totalPages: Math.max(1, Math.ceil(normalizedJobs.length / limit)),
        hasNextPage: page * limit < normalizedJobs.length,
        hasPrevPage: page > 1,
      },
      source: 'remotive',
      fallbackUsed: false,
    };

    setCache(cacheKey, results, JOB_SEARCH_TTL);

    normalizedJobs.forEach((job) => {
      setCache(`jobs:detail:${job.jobId}`, job, JOB_DETAILS_TTL);
    });

    return results;
  } catch (error) {
    const fallback = getFallbackResults({ keyword, location, type, page, limit });
    setCache(cacheKey, fallback, JOB_SEARCH_TTL);
    return fallback;
  }
};

export const getJobDetailsFromCache = (jobId) => getCache(`jobs:detail:${jobId}`);

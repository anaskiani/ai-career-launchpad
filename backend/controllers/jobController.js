import { getPool } from '../config/mysql.js';
import { AppError } from '../middleware/errorHandler.js';
import { getJobDetailsFromCache, searchJobsFromProvider } from '../utils/jobProvider.js';
import { fromJson, toJson } from '../utils/dbHelpers.js';

const mapJobRow = (row) => ({
  jobId: row.job_id,
  title: row.title,
  company: row.company,
  location: row.location,
  type: row.type,
  description: row.description,
  skills: fromJson(row.skills_json, []),
  salary: fromJson(row.salary_json, {}),
  postedDate: row.posted_date,
  applicationDeadline: row.application_deadline,
  url: row.url,
  source: row.source,
  isRemote: Boolean(row.is_remote),
  createdAt: row.created_at,
});

export const searchJobs = async (req, res, next) => {
  try {
    const {
      keyword = '',
      location = '',
      type = 'all',
      page = '1',
      limit = '6',
    } = req.query;

    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(12, Math.max(1, Number.parseInt(limit, 10) || 6));

    const providerResults = await searchJobsFromProvider({
      keyword,
      location,
      type,
      page: currentPage,
      limit: pageSize,
    });

    const pool = getPool();
    const ids = providerResults.results.map((job) => job.jobId);
    let savedSet = new Set();
    if (ids.length > 0) {
      const placeholders = ids.map(() => '?').join(', ');
      const [savedRows] = await pool.query(
        `SELECT job_id FROM saved_jobs WHERE user_id = ? AND job_id IN (${placeholders})`,
        [req.user.userId, ...ids]
      );
      savedSet = new Set(savedRows.map((row) => row.job_id));
    }

    res.json({
      jobs: providerResults.results.map((job) => ({
        ...job,
        isSaved: savedSet.has(job.jobId),
      })),
      pagination: providerResults.pagination,
      source: providerResults.source,
      fallbackUsed: providerResults.fallbackUsed,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT j.* FROM jobs j
       INNER JOIN saved_jobs sj ON sj.job_id = j.job_id
       WHERE sj.user_id = ?
       ORDER BY sj.created_at DESC`,
      [req.user.userId]
    );

    res.json({
      jobs: rows.map((row) => ({
        ...mapJobRow(row),
        isSaved: true,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const pool = getPool();

    const [rows] = await pool.query('SELECT * FROM jobs WHERE job_id = ? LIMIT 1', [jobId]);
    const [savedRows] = await pool.query(
      'SELECT job_id FROM saved_jobs WHERE user_id = ? AND job_id = ? LIMIT 1',
      [req.user.userId, jobId]
    );
    const cachedJob = getJobDetailsFromCache(jobId);
    const job = rows.length ? mapJobRow(rows[0]) : cachedJob;

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json({
      job: {
        ...job,
        isSaved: savedRows.length > 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const jobPayload = req.body.job;
    const pool = getPool();

    if (!jobPayload || !jobPayload.title) {
      return next(new AppError('Job payload is required to save a job', 400));
    }

    await pool.query(
      `INSERT INTO jobs (
        job_id, title, company, location, type, description, skills_json, salary_json,
        posted_date, application_deadline, url, source, is_remote
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        company = VALUES(company),
        location = VALUES(location),
        type = VALUES(type),
        description = VALUES(description),
        skills_json = VALUES(skills_json),
        salary_json = VALUES(salary_json),
        posted_date = VALUES(posted_date),
        application_deadline = VALUES(application_deadline),
        url = VALUES(url),
        source = VALUES(source),
        is_remote = VALUES(is_remote)`,
      [
        jobId,
        jobPayload.title,
        jobPayload.company || '',
        jobPayload.location || '',
        jobPayload.type || 'Full-time',
        jobPayload.description || '',
        toJson(jobPayload.skills, []),
        toJson(jobPayload.salary, {}),
        jobPayload.postedDate || null,
        jobPayload.applicationDeadline || null,
        jobPayload.url || '',
        jobPayload.source || 'external',
        jobPayload.isRemote ? 1 : 0,
      ]
    );

    await pool.query(
      'INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE job_id = VALUES(job_id)',
      [req.user.userId, jobId]
    );

    const [rows] = await pool.query('SELECT * FROM jobs WHERE job_id = ? LIMIT 1', [jobId]);
    const job = mapJobRow(rows[0]);

    res.json({
      message: 'Job saved successfully',
      job: {
        ...job,
        isSaved: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const pool = getPool();
    const [jobRows] = await pool.query('SELECT job_id FROM jobs WHERE job_id = ? LIMIT 1', [jobId]);
    if (jobRows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    await pool.query('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [req.user.userId, jobId]);

    res.json({
      message: 'Job removed from saved list',
      jobId,
    });
  } catch (error) {
    next(error);
  }
};

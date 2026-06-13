import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  Briefcase,
  Building2,
  ChevronRight,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useJobStore } from '../../context/jobStore';

const typeOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'job', label: 'Jobs' },
  { value: 'internship', label: 'Internships' },
];

const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) {
    return 'Salary not listed';
  }

  const parts = [salary.min, salary.max].filter(Boolean).map((value) => value.toLocaleString());
  return `${salary.currency || 'USD'} ${parts.join(' - ')}`;
};

export const JobFinder = () => {
  const {
    filters,
    jobs,
    selectedJob,
    pagination,
    fallbackUsed,
    isLoading,
    isSaving,
    error,
    setFilters,
    fetchJobs,
    fetchSavedJobs,
    selectJob,
    clearSelectedJob,
    toggleSaveJob,
  } = useJobStore();

  const [draftFilters, setDraftFilters] = useState({
    keyword: filters.keyword,
    location: filters.location,
    type: filters.type,
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [fetchJobs, fetchSavedJobs]);

  const resultSummary = useMemo(() => {
    if (!pagination) {
      return 'Search jobs and internships';
    }

    return `${pagination.total} results found`;
  }, [pagination]);

  const handleSearch = (event) => {
    event.preventDefault();
    setFilters({
      ...draftFilters,
      page: 1,
    });
    fetchJobs({
      ...draftFilters,
      page: 1,
    });
  };

  const handleToggleSave = async (job, event) => {
    event?.stopPropagation();
    await toggleSaveJob(job);
  };

  const goToPage = (page) => {
    fetchJobs({ page });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
          <Briefcase size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job & Internship Finder</h1>
          <p className="text-sm text-gray-500">Search roles, compare opportunities, and bookmark openings.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={draftFilters.keyword}
                onChange={(e) => setDraftFilters((state) => ({ ...state, keyword: e.target.value }))}
                className="input pl-10"
                placeholder="e.g. frontend developer, data analyst"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              value={draftFilters.location}
              onChange={(e) => setDraftFilters((state) => ({ ...state, location: e.target.value }))}
              className="input"
              placeholder="e.g. Lahore, Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={draftFilters.type}
              onChange={(e) => setDraftFilters((state) => ({ ...state, type: e.target.value }))}
              className="input"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="text-sm text-gray-500">{resultSummary}</div>
          <button type="submit" className="btn btn-primary inline-flex items-center justify-center gap-2">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>

        {fallbackUsed && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            External job API is unavailable or rate-limited, so fallback sample jobs are being shown.
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </form>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <Loader2 size={28} className="animate-spin mx-auto text-blue-600 mb-3" />
          <p className="text-gray-500">Searching opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">No jobs found</p>
          <p className="text-gray-500">Try a broader keyword, a different location, or switch between jobs and internships.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.jobId}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {job.type}
                    </span>
                    {job.isRemote && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        Remote
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-2"><Building2 size={15} /> {job.company}</p>
                    <p className="flex items-center gap-2"><MapPin size={15} /> {job.location}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => handleToggleSave(job, event)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                  disabled={isSaving}
                  aria-label={job.isSaved ? 'Remove saved job' : 'Save job'}
                >
                  <Bookmark size={18} className={job.isSaved ? 'fill-current' : ''} />
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                {job.description ? job.description.replace(/<[^>]*>?/gm, '') : ''}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(job.skills || []).slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">{formatSalary(job.salary)}</span>
                <span className="text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</span>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => selectJob(job)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedJob.company} · {selectedJob.location}</p>
              </div>
              <button onClick={clearSelectedJob} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">{selectedJob.type}</span>
                {selectedJob.isRemote && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">Remote</span>
                )}
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  {formatSalary(selectedJob.salary)}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Description</h3>
                <div 
                  className="text-sm text-gray-700 leading-6"
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedJob.skills || []).length > 0 ? (
                    selectedJob.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleToggleSave(selectedJob)}
                  className="btn btn-primary inline-flex items-center justify-center gap-2"
                  disabled={isSaving}
                >
                  <Bookmark size={16} className={selectedJob.isSaved ? 'fill-current' : ''} />
                  {selectedJob.isSaved ? 'Saved' : 'Save job'}
                </button>
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Apply Now <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

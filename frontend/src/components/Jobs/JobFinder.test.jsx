import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JobFinder } from './JobFinder';
import { useJobStore } from '../../context/jobStore';

vi.mock('../../context/jobStore', () => ({
  useJobStore: vi.fn(),
}));

const baseStore = {
  filters: { keyword: '', location: '', type: 'all' },
  jobs: [],
  selectedJob: null,
  pagination: null,
  fallbackUsed: false,
  isLoading: false,
  isSaving: false,
  error: null,
  setFilters: vi.fn(),
  fetchJobs: vi.fn(),
  fetchSavedJobs: vi.fn(),
  selectJob: vi.fn(),
  clearSelectedJob: vi.fn(),
  toggleSaveJob: vi.fn(),
};

const sampleJobs = [
  {
    jobId: 'job-1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build modern UIs with React',
    skills: ['React', 'JavaScript', 'CSS'],
    salary: { min: 50000, max: 80000, currency: 'USD' },
    postedDate: '2025-06-01',
    url: 'https://example.com/apply',
    isRemote: true,
    isSaved: false,
  },
  {
    jobId: 'job-2',
    title: 'Backend Engineer',
    company: 'DataInc',
    location: 'Lahore',
    type: 'Internship',
    description: 'Work with Node.js and databases',
    skills: ['Node.js', 'MySQL'],
    salary: { min: null, max: null, currency: 'USD' },
    postedDate: '2025-05-15',
    url: '#',
    isRemote: false,
    isSaved: true,
  },
];

describe('JobFinder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useJobStore.mockReturnValue(baseStore);
  });

  it('fetches jobs and saved jobs on mount', () => {
    render(<JobFinder />);
    expect(baseStore.fetchJobs).toHaveBeenCalledTimes(1);
    expect(baseStore.fetchSavedJobs).toHaveBeenCalledTimes(1);
  });

  it('renders the page heading and search form', () => {
    render(<JobFinder />);
    expect(screen.getByText('Job & Internship Finder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/frontend developer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows "No jobs found" when there are no results', () => {
    render(<JobFinder />);
    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('renders job cards when jobs are available', () => {
    useJobStore.mockReturnValue({ ...baseStore, jobs: sampleJobs });
    render(<JobFinder />);
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('DataInc')).toBeInTheDocument();
  });

  it('shows Remote badge for remote jobs', () => {
    useJobStore.mockReturnValue({ ...baseStore, jobs: sampleJobs });
    render(<JobFinder />);
    expect(screen.getAllByText('Remote').length).toBeGreaterThan(0);
  });

  it('shows job type badges', () => {
    useJobStore.mockReturnValue({ ...baseStore, jobs: sampleJobs });
    render(<JobFinder />);
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Internship')).toBeInTheDocument();
  });

  it('shows skill tags on job cards', () => {
    useJobStore.mockReturnValue({ ...baseStore, jobs: sampleJobs });
    render(<JobFinder />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('calls fetchJobs with filters when search is submitted', async () => {
    const user = userEvent.setup();
    render(<JobFinder />);

    await user.type(screen.getByPlaceholderText(/frontend developer/i), 'react');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(baseStore.setFilters).toHaveBeenCalled();
    expect(baseStore.fetchJobs).toHaveBeenCalled();
  });

  it('shows fallback warning when external API is unavailable', () => {
    useJobStore.mockReturnValue({ ...baseStore, fallbackUsed: true, jobs: sampleJobs });
    render(<JobFinder />);
    expect(screen.getByText(/fallback sample jobs/i)).toBeInTheDocument();
  });

  it('shows error message when error occurs', () => {
    useJobStore.mockReturnValue({ ...baseStore, error: 'Network error' });
    render(<JobFinder />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('calls selectJob when "View details" is clicked', async () => {
    const user = userEvent.setup();
    useJobStore.mockReturnValue({ ...baseStore, jobs: sampleJobs });
    render(<JobFinder />);

    const viewButtons = screen.getAllByText(/view details/i);
    await user.click(viewButtons[0]);
    expect(baseStore.selectJob).toHaveBeenCalledWith(sampleJobs[0]);
  });

  it('renders job detail modal when selectedJob is set', () => {
    useJobStore.mockReturnValue({ ...baseStore, selectedJob: sampleJobs[0] });
    render(<JobFinder />);
    expect(screen.getAllByText(/DESCRIPTION/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Apply Now/i).length).toBeGreaterThan(0);
  });

  it('renders pagination when pagination data exists', () => {
    useJobStore.mockReturnValue({
      ...baseStore,
      jobs: sampleJobs,
      pagination: { page: 1, totalPages: 3, hasNextPage: true, hasPrevPage: false, total: 15 },
    });
    render(<JobFinder />);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('15 results found')).toBeInTheDocument();
  });

  it('shows loading state when searching', () => {
    useJobStore.mockReturnValue({ ...baseStore, isLoading: true });
    render(<JobFinder />);
    expect(screen.getByText(/searching opportunities/i)).toBeInTheDocument();
  });
});

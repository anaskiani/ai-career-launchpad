import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResumeBuilder } from './ResumeBuilder';
import { useResumeStore } from '../../context/resumeStore';

vi.mock('../../context/resumeStore', () => ({
  useResumeStore: vi.fn(),
}));

// Mock jsPDF to avoid canvas errors in jsdom
vi.mock('../../utils/generateResumePDF', () => ({
  generateResumePDF: vi.fn(),
}));

const emptyResume = {
  title: '',
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

const filledResume = {
  title: 'My Resume',
  personalInfo: {
    fullName: 'Muhammad Anas',
    email: 'anas@example.com',
    phone: '03001234567',
    location: 'Lahore',
    linkedin: 'linkedin.com/in/anas',
    github: 'github.com/anas',
    summary: 'Full-stack developer',
  },
  experiences: [{ title: 'Intern', company: 'TechCo', startDate: '2024-01', endDate: '2024-06', current: false, description: 'Built APIs' }],
  education: [{ institution: 'FAST', degree: 'BS', field: 'CS', startYear: 2021, endYear: 2025, current: false }],
  skills: ['JavaScript', 'React', 'Node.js'],
  certifications: [{ name: 'AWS Cloud', issuer: 'Amazon', date: '2024-05', url: '' }],
  projects: [{ name: 'Portfolio', description: 'Personal website', technologies: ['React', 'Vite'], url: '' }],
};

const baseStore = {
  form: emptyResume,
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: '',
  fetchResume: vi.fn(),
  updateField: vi.fn(),
  updateSection: vi.fn(),
  saveResume: vi.fn(),
  resetResume: vi.fn(),
  clearMessages: vi.fn(),
};

describe('ResumeBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useResumeStore.mockReturnValue(baseStore);
  });

  it('fetches resume data on mount', () => {
    render(<ResumeBuilder />);
    expect(baseStore.fetchResume).toHaveBeenCalledTimes(1);
  });

  it('renders the resume builder heading', () => {
    render(<ResumeBuilder />);
    expect(screen.getByRole('heading', { name: /resume/i })).toBeInTheDocument();
  });

  it('renders the personal info section with input fields', () => {
    render(<ResumeBuilder />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders the save button', () => {
    render(<ResumeBuilder />);
    const saveButtons = screen.getAllByRole('button').filter((btn) =>
      btn.textContent.toLowerCase().includes('save'),
    );
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it('calls updateField when personal info is edited', async () => {
    render(<ResumeBuilder />);
    const nameInput = screen.getByLabelText(/full name/i);

    const user = userEvent.setup();
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Name');

    expect(baseStore.updateField).toHaveBeenCalled();
  });

  it('shows success message after save', () => {
    useResumeStore.mockReturnValue({
      ...baseStore,
      successMessage: 'Resume saved successfully!',
    });
    render(<ResumeBuilder />);
    expect(screen.getByText(/resume saved/i)).toBeInTheDocument();
  });

  it('shows error message when save fails', () => {
    useResumeStore.mockReturnValue({
      ...baseStore,
      error: 'Failed to save resume',
    });
    render(<ResumeBuilder />);
    expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
  });

  it('renders resume preview section', () => {
    useResumeStore.mockReturnValue({ ...baseStore, form: filledResume });
    render(<ResumeBuilder />);
    // The preview should show the name from personal info
    expect(screen.getAllByText('Muhammad Anas').length).toBeGreaterThan(0);
  });

  it('displays loading state', () => {
    useResumeStore.mockReturnValue({ ...baseStore, isLoading: true });
    render(<ResumeBuilder />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

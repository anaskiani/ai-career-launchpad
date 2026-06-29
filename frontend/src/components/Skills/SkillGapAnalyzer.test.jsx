import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SkillGapAnalyzer } from './SkillGapAnalyzer';
import { useSkillStore } from '../../context/skillStore';

vi.mock('../../context/skillStore', () => ({
  useSkillStore: vi.fn(),
}));

const baseStore = {
  roles: ['Frontend Developer', 'Backend Developer', 'Data Scientist'],
  analysis: null,
  history: [],
  isLoading: false,
  isAnalyzing: false,
  error: null,
  fetchRoles: vi.fn(),
  analyzeGap: vi.fn(),
  fetchHistory: vi.fn(),
  loadAnalysis: vi.fn(),
  deleteFromHistory: vi.fn(),
  clearAnalysis: vi.fn(),
};

describe('SkillGapAnalyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSkillStore.mockReturnValue(baseStore);
  });

  it('fetches roles and history on mount', () => {
    render(<SkillGapAnalyzer />);
    expect(baseStore.fetchRoles).toHaveBeenCalledTimes(1);
    expect(baseStore.fetchHistory).toHaveBeenCalledTimes(1);
  });

  it('renders the page heading and role selector', () => {
    render(<SkillGapAnalyzer />);
    expect(screen.getByText('Skill Gap Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Choose a role...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze skills/i })).toBeInTheDocument();
  });

  it('shows all available roles in the dropdown', () => {
    render(<SkillGapAnalyzer />);
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText('Data Scientist')).toBeInTheDocument();
  });

  it('disables analyze button when no role is selected', () => {
    render(<SkillGapAnalyzer />);
    expect(screen.getByRole('button', { name: /analyze skills/i })).toBeDisabled();
  });

  it('calls analyzeGap when a role is selected and button clicked', async () => {
    const user = userEvent.setup();
    baseStore.analyzeGap.mockResolvedValue(true);
    render(<SkillGapAnalyzer />);

    await user.selectOptions(screen.getByRole('combobox'), 'Frontend Developer');
    await user.click(screen.getByRole('button', { name: /analyze skills/i }));

    expect(baseStore.analyzeGap).toHaveBeenCalledWith('Frontend Developer');
  });

  it('displays analysis results when available', () => {
    const storeWithResults = {
      ...baseStore,
      analysis: {
        matchPercentage: 70,
        matchingSkills: ['JavaScript', 'React'],
        missingSkills: ['TypeScript', 'Testing'],
        missingDetails: [
          { name: 'TypeScript', category: 'Language', priority: 'essential', resource: null },
          { name: 'Testing', category: 'Skill', priority: 'recommended', resource: null },
        ],
        roadmap: [],
        recommendations: ['Learn TypeScript first'],
      },
    };
    useSkillStore.mockReturnValue(storeWithResults);

    render(<SkillGapAnalyzer />);
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0); // matching skills count
    expect(screen.getAllByText('Skills You Have').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Skills to Learn').length).toBeGreaterThan(0);
  });

  it('shows matching skills badges', () => {
    const storeWithResults = {
      ...baseStore,
      analysis: {
        matchPercentage: 50,
        matchingSkills: ['HTML', 'CSS'],
        missingSkills: ['Vue'],
        missingDetails: [],
        roadmap: [],
        recommendations: [],
      },
    };
    useSkillStore.mockReturnValue(storeWithResults);
    render(<SkillGapAnalyzer />);
    expect(screen.getByText(/✓ HTML/)).toBeInTheDocument();
    expect(screen.getByText(/✓ CSS/)).toBeInTheDocument();
  });

  it('displays error message when error is set', () => {
    useSkillStore.mockReturnValue({ ...baseStore, error: 'Analysis failed' });
    render(<SkillGapAnalyzer />);
    expect(screen.getByText('Analysis failed')).toBeInTheDocument();
  });

  it('renders analysis history entries', () => {
    const storeWithHistory = {
      ...baseStore,
      history: [
        {
          _id: 'h1',
          targetRole: 'Frontend Developer',
          matchPercentage: 80,
          matchingSkills: ['React'],
          missingSkills: ['Vue'],
          createdAt: '2025-06-01',
        },
      ],
    };
    useSkillStore.mockReturnValue(storeWithHistory);
    render(<SkillGapAnalyzer />);
    expect(screen.getByText('Recent Analyses')).toBeInTheDocument();
    expect(screen.getAllByText('Frontend Developer').length).toBeGreaterThan(1);
  });

  it('calls loadAnalysis when a history entry is clicked', async () => {
    const user = userEvent.setup();
    const storeWithHistory = {
      ...baseStore,
      history: [
        {
          _id: 'h1',
          targetRole: 'Backend Developer',
          matchPercentage: 60,
          matchingSkills: [],
          missingSkills: [],
          createdAt: '2025-06-01',
        },
      ],
    };
    useSkillStore.mockReturnValue(storeWithHistory);
    render(<SkillGapAnalyzer />);

    await user.click(screen.getByRole('button', { name: /Backend Developer/i }));
    expect(storeWithHistory.loadAnalysis).toHaveBeenCalledWith('h1');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import { useFetch } from '../../hooks/useFetch';

vi.mock('../../hooks/useFetch', () => ({
  useFetch: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
}));

const mockDashboardData = {
  summary: {
    user: { name: 'Anas Kiani', profileCompletion: 75, targetRole: 'Frontend Developer', skillsCount: 5 },
    resume: { exists: true, title: 'My Resume', lastUpdated: '2025-06-01' },
    jobs: { savedCount: 3 },
    skillGap: { matchPercentage: 80, targetRole: 'Frontend Developer' },
    interviews: { totalSessions: 5, completedSessions: 3, totalQuestionsAnswered: 15 },
    chatbot: { totalMessages: 20, assistantReplies: 10 },
  },
  charts: {
    overview: [
      { name: 'Saved Jobs', value: 3 },
      { name: 'Skills', value: 5 },
      { name: 'Interviews', value: 5 },
      { name: 'Chat Replies', value: 10 },
    ],
    completion: [
      { name: 'Profile', value: 75 },
      { name: 'Skill Match', value: 80 },
    ],
  },
  recentActivity: {
    interviews: [
      { _id: 'int1', role: 'Frontend Developer', status: 'completed', createdAt: '2025-06-01', answeredCount: 5 },
    ],
    chatbot: [
      { _id: 'chat1', topic: 'career-guidance', content: 'Practice coding daily', createdAt: '2025-06-01' },
    ],
  },
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    useFetch.mockReturnValue({ data: null, loading: true, error: null });
    render(<Dashboard />);
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('shows error message when data fails to load', () => {
    useFetch.mockReturnValue({ data: null, loading: false, error: 'Network error' });
    render(<Dashboard />);
    expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
  });

  it('renders welcome message with user name', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard-welcome')).toHaveTextContent('Welcome, Anas Kiani!');
  });

  it('renders all 6 summary cards', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText('Profile Completion')).toBeInTheDocument();
    expect(screen.getByText('Resume Status')).toBeInTheDocument();
    expect(screen.getByText('Saved Jobs')).toBeInTheDocument();
    expect(screen.getAllByText('Skill Match').length).toBeGreaterThan(0);
    expect(screen.getByText('Interview Sessions')).toBeInTheDocument();
    expect(screen.getByText('Chatbot Activity')).toBeInTheDocument();
  });

  it('shows correct values in summary cards', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getAllByText('75%').length).toBeGreaterThan(0);
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getAllByText('80%').length).toBeGreaterThan(0);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows "Missing" for resume when user has no resume', () => {
    const noResumeData = {
      ...mockDashboardData,
      summary: {
        ...mockDashboardData.summary,
        resume: { exists: false, title: '', lastUpdated: null },
      },
    };
    useFetch.mockReturnValue({ data: noResumeData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText('Missing')).toBeInTheDocument();
  });

  it('renders chart sections', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText('Activity Overview')).toBeInTheDocument();
    expect(screen.getByText('Readiness Snapshot')).toBeInTheDocument();
  });

  it('renders recent interview activity', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText('Recent Interviews')).toBeInTheDocument();
    expect(screen.getAllByText('Frontend Developer').length).toBeGreaterThan(0);
  });

  it('renders recent chatbot activity', () => {
    useFetch.mockReturnValue({ data: mockDashboardData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText('Recent Chatbot Activity')).toBeInTheDocument();
    expect(screen.getByText('Practice coding daily')).toBeInTheDocument();
  });

  it('shows empty states when no activity exists', () => {
    const emptyActivityData = {
      ...mockDashboardData,
      recentActivity: { interviews: [], chatbot: [] },
    };
    useFetch.mockReturnValue({ data: emptyActivityData, loading: false, error: null });
    render(<Dashboard />);
    expect(screen.getByText(/no interview practice yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no chatbot activity yet/i)).toBeInTheDocument();
  });
});

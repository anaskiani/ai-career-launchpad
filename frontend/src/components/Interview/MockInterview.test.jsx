import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockInterview } from './MockInterview';
import { useInterviewStore } from '../../context/interviewStore';

vi.mock('../../context/interviewStore', () => ({
  useInterviewStore: vi.fn(),
}));

const baseStore = {
  roles: ['Frontend Developer', 'Backend Developer'],
  currentInterview: null,
  history: [],
  isLoading: false,
  isSaving: false,
  error: null,
  fetchRoles: vi.fn(),
  fetchHistory: vi.fn(),
  startInterview: vi.fn(),
  updateAnswer: vi.fn(),
  saveAnswers: vi.fn(),
  submitInterview: vi.fn(),
  loadInterview: vi.fn(),
  clearCurrentInterview: vi.fn(),
};

describe('MockInterview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInterviewStore.mockReturnValue(baseStore);
  });

  it('loads roles and history when mounted', async () => {
    render(<MockInterview />);

    await waitFor(() => {
      expect(baseStore.fetchRoles).toHaveBeenCalledTimes(1);
      expect(baseStore.fetchHistory).toHaveBeenCalledTimes(1);
    });
  });

  it('starts an interview only after a role is selected', async () => {
    const user = userEvent.setup();
    render(<MockInterview />);

    await user.selectOptions(screen.getByRole('combobox'), 'Frontend Developer');
    await user.click(screen.getByRole('button', { name: /start interview/i }));

    expect(baseStore.startInterview).toHaveBeenCalledWith('Frontend Developer');
  });

  it('renders active questions and saves typed answers through the store', async () => {
    const user = userEvent.setup();
    const store = {
      ...baseStore,
      currentInterview: {
        _id: 'interview-1',
        role: 'Frontend Developer',
        status: 'in-progress',
        questions: [
          {
            question: 'Explain React state.',
            category: 'Technical',
            answer: '',
          },
        ],
      },
    };
    useInterviewStore.mockReturnValue(store);

    render(<MockInterview />);

    expect(screen.getByRole('heading', { name: 'Frontend Developer' })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/write your answer/i), {
      target: { value: 'State stores UI data' },
    });
    await user.click(screen.getByRole('button', { name: /save responses/i }));

    expect(store.updateAnswer).toHaveBeenCalledWith(0, 'State stores UI data');
    expect(store.saveAnswers).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AIChatbot } from './AIChatbot';
import { aiService } from '../../services/aiService';

vi.mock('../../services/aiService', () => ({
  aiService: {
    chat: vi.fn(),
    getHistory: vi.fn(),
  },
}));

describe('AIChatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    aiService.getHistory.mockResolvedValue({ data: { messages: [] } });
  });

  it('renders the chatbot heading and form', async () => {
    render(<AIChatbot />);
    expect(screen.getByText('AI Career Chatbot')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask about your resume/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('shows empty state when there are no messages', async () => {
    render(<AIChatbot />);
    await waitFor(() => {
      expect(screen.getByText(/start your first conversation/i)).toBeInTheDocument();
    });
  });

  it('loads and displays chat history on mount', async () => {
    aiService.getHistory.mockResolvedValue({
      data: {
        messages: [
          { _id: 'msg1', role: 'user', topic: 'resume', content: 'Help with my resume' },
          { _id: 'msg2', role: 'assistant', topic: 'resume', content: 'Sure, share your resume details.' },
        ],
      },
    });

    render(<AIChatbot />);
    await waitFor(() => {
      expect(screen.getByText('Help with my resume')).toBeInTheDocument();
      expect(screen.getByText('Sure, share your resume details.')).toBeInTheDocument();
    });
  });

  it('sends a message and displays the assistant reply', async () => {
    const user = userEvent.setup();
    aiService.chat.mockResolvedValue({
      data: {
        reply: 'Focus on quantifying your achievements.',
        topic: 'resume',
        fallbackUsed: false,
      },
    });

    render(<AIChatbot />);
    await waitFor(() => expect(aiService.getHistory).toHaveBeenCalled());

    const textarea = screen.getByPlaceholderText(/ask about your resume/i);
    await user.type(textarea, 'How do I improve my resume?');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('How do I improve my resume?')).toBeInTheDocument();
      expect(screen.getByText('Focus on quantifying your achievements.')).toBeInTheDocument();
    });

    expect(aiService.chat).toHaveBeenCalledWith('How do I improve my resume?', { topic: 'career-guidance' });
  });

  it('does not send an empty message', async () => {
    const user = userEvent.setup();
    render(<AIChatbot />);
    await waitFor(() => expect(aiService.getHistory).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: /send/i }));
    expect(aiService.chat).not.toHaveBeenCalled();
  });

  it('shows fallback warning when fallback is used', async () => {
    const user = userEvent.setup();
    aiService.chat.mockResolvedValue({
      data: { reply: 'Offline tip here', topic: 'resume', fallbackUsed: true },
    });

    render(<AIChatbot />);
    await waitFor(() => expect(aiService.getHistory).toHaveBeenCalled());

    await user.type(screen.getByPlaceholderText(/ask about your resume/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/static fallback/i)).toBeInTheDocument();
    });
  });

  it('shows error message when chat fails', async () => {
    const user = userEvent.setup();
    aiService.chat.mockRejectedValue({
      response: { data: { error: { message: 'Failed to send message' } } },
    });

    render(<AIChatbot />);
    await waitFor(() => expect(aiService.getHistory).toHaveBeenCalled());

    await user.type(screen.getByPlaceholderText(/ask about your resume/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument();
    });
  });

  it('has a topic selector with all 5 topics', () => {
    render(<AIChatbot />);
    expect(screen.getByText('Resume feedback')).toBeInTheDocument();
    expect(screen.getByText('Interview help')).toBeInTheDocument();
    expect(screen.getByText('Skill roadmap')).toBeInTheDocument();
    expect(screen.getByText('Job advice')).toBeInTheDocument();
    expect(screen.getByText('Career guidance')).toBeInTheDocument();
  });

  it('distinguishes user and assistant message styles', async () => {
    aiService.getHistory.mockResolvedValue({
      data: {
        messages: [
          { _id: 'u1', role: 'user', topic: 'resume', content: 'My question' },
          { _id: 'a1', role: 'assistant', topic: 'resume', content: 'My answer' },
        ],
      },
    });

    render(<AIChatbot />);
    await waitFor(() => {
      expect(screen.getByText('You')).toBeInTheDocument();
      expect(screen.getByText('Career Assistant')).toBeInTheDocument();
    });
  });
});

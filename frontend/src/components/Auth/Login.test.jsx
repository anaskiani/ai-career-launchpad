import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from './Login';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const navigate = vi.fn();
const login = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    verifyEmail: vi.fn(),
  },
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login });
  });

  it('logs in and redirects when backend marks authentication complete', async () => {
    const user = userEvent.setup();
    authService.login.mockResolvedValue({
      data: {
        step: 'complete',
        user: { name: 'Dev User', email: 'dev@localhost.com' },
        token: 'token-123',
      },
    });

    renderLogin();
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        { name: 'Dev User', email: 'dev@localhost.com' },
        'token-123',
      );
      expect(navigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows a readable error when credentials are rejected', async () => {
    const user = userEvent.setup();
    authService.login.mockRejectedValue({
      response: { data: { error: { message: 'Invalid credentials' } } },
    });

    renderLogin();
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

});

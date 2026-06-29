import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForgotPassword } from './ForgotPassword';
import { authService } from '../../services/authService';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../../services/authService', () => ({
  authService: {
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

const renderForgotPassword = () =>
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  );

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email request form initially', () => {
    renderForgotPassword();
    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset code/i })).toBeInTheDocument();
  });

  it('transitions to reset form after requesting OTP', async () => {
    const user = userEvent.setup();
    authService.forgotPassword.mockResolvedValue({
      data: { message: 'Reset code sent' },
    });

    renderForgotPassword();

    await user.type(screen.getByLabelText(/email/i), 'anas@test.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/reset code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });
  });

  it('shows success message after sending reset code', async () => {
    const user = userEvent.setup();
    authService.forgotPassword.mockResolvedValue({
      data: { message: 'Reset code sent to your email.' },
    });

    renderForgotPassword();
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));

    expect(await screen.findByText(/reset code sent/i)).toBeInTheDocument();
  });

  it('shows dev OTP when provided in dev mode', async () => {
    const user = userEvent.setup();
    authService.forgotPassword.mockResolvedValue({
      data: { message: 'Code generated', devOtp: '654321' },
    });

    renderForgotPassword();
    await user.type(screen.getByLabelText(/email/i), 'dev@localhost.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));

    expect(await screen.findByText('654321')).toBeInTheDocument();
  });

  it('shows error when request fails', async () => {
    const user = userEvent.setup();
    authService.forgotPassword.mockRejectedValue({
      response: { data: { error: { message: 'Request failed' } } },
    });

    renderForgotPassword();
    await user.type(screen.getByLabelText(/email/i), 'bad@test.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));

    expect(await screen.findByText('Request failed')).toBeInTheDocument();
  });

  it('shows error when reset fails with invalid OTP', async () => {
    const user = userEvent.setup();
    authService.forgotPassword.mockResolvedValue({ data: { message: 'Code sent' } });
    authService.resetPassword.mockRejectedValue({
      response: { data: { error: { message: 'Invalid or expired reset code' } } },
    });

    renderForgotPassword();
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));

    await waitFor(() => expect(screen.getByLabelText(/reset code/i)).toBeInTheDocument());

    await user.type(screen.getByLabelText(/reset code/i), '000000');
    await user.type(screen.getByLabelText(/new password/i), 'newpass123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText('Invalid or expired reset code')).toBeInTheDocument();
  });

  it('contains a back to login link', () => {
    renderForgotPassword();
    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute('href', '/login');
  });
});

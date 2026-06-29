import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Register } from './Register';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const navigate = vi.fn();
const login = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/authService', () => ({
  authService: {
    register: vi.fn(),
    verifyEmail: vi.fn(),
    googleLogin: vi.fn(),
  },
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <button>Mock Google Login</button>,
}));

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login });
  });

  it('renders the registration form with name, email, and password fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows OTP verification step after successful registration', async () => {
    const user = userEvent.setup();
    authService.register.mockResolvedValue({ data: { message: 'OTP sent' } });

    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Anas Kiani');
    await user.type(screen.getByLabelText(/email/i), 'anas@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter the otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when registration fails', async () => {
    const user = userEvent.setup();
    authService.register.mockRejectedValue({
      response: { data: { error: { message: 'User already exists' } } },
    });

    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'existing@test.com');
    await user.type(screen.getByLabelText(/password/i), 'pass123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
  });

  it('navigates to login page after successful OTP verification', async () => {
    const user = userEvent.setup();
    authService.register.mockResolvedValue({ data: { message: 'OTP sent' } });
    authService.verifyEmail.mockResolvedValue({ data: { message: 'Verified' } });

    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Anas');
    await user.type(screen.getByLabelText(/email/i), 'anas@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(screen.getByLabelText(/otp/i)).toBeInTheDocument());

    await user.type(screen.getByLabelText(/otp/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error when OTP verification fails', async () => {
    const user = userEvent.setup();
    authService.register.mockResolvedValue({ data: {} });
    authService.verifyEmail.mockRejectedValue({
      response: { data: { error: { message: 'Invalid or expired OTP' } } },
    });

    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test');
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'pass123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(screen.getByLabelText(/otp/i)).toBeInTheDocument());
    await user.type(screen.getByLabelText(/otp/i), '000000');
    await user.click(screen.getByRole('button', { name: /verify/i }));

    expect(await screen.findByText('Invalid or expired OTP')).toBeInTheDocument();
  });

  it('contains a link to the login page', () => {
    renderRegister();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  it('strips non-alpha characters from the name field', async () => {
    const user = userEvent.setup();
    renderRegister();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'Anas123');

    // Digits should be stripped, only "Anas" remains
    expect(nameInput).toHaveValue('Anas');
  });
});

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const DEV_EMAIL = import.meta.env.VITE_DEV_LOGIN_EMAIL || 'dev@localhost.com';
const DEV_PASSWORD = import.meta.env.VITE_DEV_LOGIN_PASSWORD || 'devpassword';
const IS_DEV = import.meta.env.DEV;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState(IS_DEV ? DEV_EMAIL : '');
  const [password, setPassword] = useState(IS_DEV ? DEV_PASSWORD : '');
  const [otp, setOtp] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityPIN, setSecurityPIN] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });

      if (response.data.step === 'complete') {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
        return;
      }

      if (response.data.step === 'emailVerification') {
        setStep('emailVerification');
      } else if (response.data.step === 'securityQuestion') {
        setUserId(response.data.userId);
        setSecurityQuestion(response.data.securityQuestion);
        setStep('securityQuestion');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.googleLogin({ token: credentialResponse.credential });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login failed');
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.verifyEmail({ email, otp });
      setStep('credentials');
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.verifySecurityQuestion({ userId, answer: securityAnswer });
      setStep('securityPIN');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityPIN = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.verifySecurityPIN({ userId, pin: securityPIN });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Login</h1>

        {error && (
          <div
            data-testid="login-error"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </div>
        )}

        {IS_DEV && step === 'credentials' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg mb-4 text-sm">
            <p className="font-medium">Development login (no OTP / security steps)</p>
            <p className="mt-1">
              Email: <span className="font-mono">{DEV_EMAIL}</span>
            </p>
            <p>
              Password: <span className="font-mono">{DEV_PASSWORD}</span>
            </p>
          </div>
        )}

        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                data-testid="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                data-testid="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              data-testid="login-submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            </div>
          </form>
        )}

        {step === 'emailVerification' && (
          <form onSubmit={handleEmailVerification} className="space-y-4">
            <p className="text-gray-600">Enter the OTP sent to your email</p>
            <div>
              <label className="block text-sm font-medium mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
                placeholder="000000"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}

        {step === 'securityQuestion' && (
          <form onSubmit={handleSecurityQuestion} className="space-y-4">
            <p className="text-gray-600 font-medium">{securityQuestion}</p>
            <div>
              <label htmlFor="security-answer" className="block text-sm font-medium mb-2">Your Answer</label>
              <input
                id="security-answer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'securityPIN' && (
          <form onSubmit={handleSecurityPIN} className="space-y-4">
            <p className="text-gray-600">Enter your Security PIN</p>
            <div>
              <label className="block text-sm font-medium mb-2">Security PIN</label>
              <input
                type="password"
                value={securityPIN}
                onChange={(e) => setSecurityPIN(e.target.value)}
                className="input"
                placeholder="0000"
                maxLength="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Logging in...' : 'Complete Login'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-4">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </p>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

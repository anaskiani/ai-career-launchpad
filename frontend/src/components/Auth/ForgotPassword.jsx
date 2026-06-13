import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../../services/authService';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setDevOtp('');

    try {
      const res = await authService.forgotPassword({ email });
      setMessage(res.data.message);
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.resetPassword({ email, otp, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">Reset password</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          {step === 'request' ? 'We will email you a reset code.' : 'Enter the code and your new password.'}
        </p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
        {devOtp && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg mb-4 text-sm">
            Dev reset code: <span className="font-mono font-bold">{devOtp}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Sending...' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reset code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
                placeholder="000000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                minLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

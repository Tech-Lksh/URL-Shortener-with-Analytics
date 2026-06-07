import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const Auth = ({ mode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Local state for authentication forms
  const [authState, setAuthState] = useState(mode || 'login');
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Tokens (for verify / reset)
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devToken, setDevToken] = useState(''); // Dev helper token

  // Auto-detect token from URL query params (if any)
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      // If reset-password URL:
      if (window.location.pathname.includes('reset-password')) {
        setAuthState('reset-password');
      } else {
        setAuthState('verify-email');
      }
    } else {
      setAuthState(mode);
    }
    setError('');
    setSuccessMsg('');
    setDevToken('');
  }, [mode, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authState === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } 
      
      else if (authState === 'register') {
        const res = await register(email, password, passwordConfirm, firstName, lastName);
        if (res.success) {
          const fetchedDevToken = res.data._devVerificationToken || '';
          setDevToken(fetchedDevToken);
          setSuccessMsg('Registration successful! Verification token generated.');
          
          // Redirect to verify-email view after 1.5 seconds and pre-populate token
          setTimeout(() => {
            if (fetchedDevToken) {
              setToken(fetchedDevToken);
            }
            setAuthState('verify-email');
            setSuccessMsg('');
          }, 1500);
        }
      } 
      
      else if (authState === 'verify-email') {
        const res = await api.post('/auth/verify-email', { token });
        if (res.data.success) {
          setSuccessMsg('Email verified successfully! You can now login.');
          setTimeout(() => {
            setAuthState('login');
            setEmail(email || res.data.data.user.email);
            setToken('');
            setSuccessMsg('');
          }, 2000);
        }
      } 
      
      else if (authState === 'forgot-password') {
        const res = await api.post('/auth/forgot-password', { email });
        if (res.data.success) {
          const fetchedDevReset = res.data._devResetToken || '';
          setDevToken(fetchedDevReset);
          setSuccessMsg('Reset request submitted successfully.');
          
          setTimeout(() => {
            if (fetchedDevReset) {
              setToken(fetchedDevReset);
            }
            setAuthState('reset-password');
            setSuccessMsg('');
          }, 1500);
        }
      } 
      
      else if (authState === 'reset-password') {
        const res = await api.post('/auth/reset-password', {
          token,
          newPassword,
          passwordConfirm
        });
        if (res.data.success) {
          setSuccessMsg('Password has been reset successfully! Redirecting to login...');
          setTimeout(() => {
            setAuthState('login');
            setToken('');
            setNewPassword('');
            setPasswordConfirm('');
            setSuccessMsg('');
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6">
      <div className="w-full max-w-md glass-card relative overflow-hidden">
        {/* Decorative ambient spots */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/15 rounded-full blur-2xl -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl -ml-8 -mb-8" />

        {/* Back Link */}
        {authState !== mode && (
          <button
            onClick={() => setAuthState('login')}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 mb-6 transition-colors font-bold uppercase tracking-wider relative z-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white capitalize">
            {authState === 'login' && 'Welcome Back'}
            {authState === 'register' && 'Create Account'}
            {authState === 'verify-email' && 'Verify Email'}
            {authState === 'forgot-password' && 'Forgot Password'}
            {authState === 'reset-password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {authState === 'login' && 'Enter your credentials to access your dashboard'}
            {authState === 'register' && 'Get started with SnapCut premium link management'}
            {authState === 'verify-email' && 'Verify your registration to activate account'}
            {authState === 'forgot-password' && 'Enter your email to request reset token'}
            {authState === 'reset-password' && 'Enter your token and set a new password'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start space-x-2 animate-fadeIn relative z-10">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-start space-x-2 animate-fadeIn relative z-10">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span>{successMsg}</span>
              {devToken && (
                <div className="mt-2 bg-dark-900/60 p-2 rounded border border-emerald-500/10 text-xs font-mono select-all break-all text-slate-200">
                  Dev Token: <span className="font-bold text-emerald-400">{devToken}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {authState === 'login' && (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setAuthState={setAuthState}
            />
          )}

          {authState === 'register' && (
            <RegisterForm
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
            />
          )}

          {authState === 'verify-email' && (
            <VerifyEmailForm
              token={token}
              setToken={setToken}
            />
          )}

          {authState === 'forgot-password' && (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
            />
          )}

          {authState === 'reset-password' && (
            <ResetPasswordForm
              token={token}
              setToken={setToken}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/25 flex items-center justify-center space-x-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>
                {authState === 'login' && 'Sign In'}
                {authState === 'register' && 'Create Account'}
                {authState === 'verify-email' && 'Verify Token'}
                {authState === 'forgot-password' && 'Send Reset Token'}
                {authState === 'reset-password' && 'Save Password'}
              </span>
            )}
          </button>
        </form>

        {/* Switch Link footer */}
        <div className="mt-6 text-center text-xs text-slate-400 relative z-10">
          {authState === 'login' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthState('register')} className="text-primary-400 hover:underline font-bold">
                Sign Up
              </button>
            </p>
          )}

          {authState === 'register' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthState('login')} className="text-primary-400 hover:underline font-bold">
                Sign In
              </button>
            </p>
          )}

          {authState === 'forgot-password' && (
            <button onClick={() => setAuthState('login')} className="text-primary-400 hover:underline font-bold">
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

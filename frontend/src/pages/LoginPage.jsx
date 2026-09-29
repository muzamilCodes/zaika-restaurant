import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Mail, KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const passwordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [authMode, setAuthMode] = useState('otp'); // 'otp' or 'password'
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const { register, handleSubmit } = useForm({ resolver: zodResolver(passwordSchema) });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setSubmitError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await authService.sendOtp({ email, name: fullName });
      setOtpSent(true);
      setSuccessMsg(response.data?.message || 'OTP sent successfully!');
      if (response.data?.devOtp) {
        setDevOtpHint(response.data.devOtp);
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setSubmitError('Please enter the 6-digit OTP.');
      return;
    }

    setSubmitError('');
    setLoading(true);

    try {
      const response = await authService.verifyOtp({ email, otp, name: fullName });
      setAuth(response.data);
      const role = String(response.data?.user?.role || '').replace(/["']/g, '').trim().toLowerCase();
      const isAdmin = role.includes('admin') || response.data?.user?.isAdmin === true || response.data?.user?.admin === true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setSubmitError('');
    setLoading(true);

    try {
      const response = await authService.login(values);
      setAuth(response.data);
      const role = String(response.data?.user?.role || '').replace(/["']/g, '').trim().toLowerCase();
      const isAdmin = role.includes('admin') || response.data?.user?.isAdmin === true || response.data?.user?.admin === true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Login" description="Login to your Zaika Restaurant account with One-Time Password (OTP) or Password." />
      <GlassCard className="mx-auto w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Welcome to Zaika</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] text-gold">
            <Sparkles size={11} /> OTP Secured
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">Sign in</h1>

        {/* Auth Mode Toggle */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1 border border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setSubmitError(''); }}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
              authMode === 'otp' ? 'bg-gold text-surface-900 font-semibold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} /> Login with OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setSubmitError(''); }}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
              authMode === 'password' ? 'bg-gold text-surface-900 font-semibold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <KeyRound size={14} /> Password
          </button>
        </div>

        {/* OTP AUTH FLOW */}
        {authMode === 'otp' && (
          <div className="mt-6">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pl-10 text-white placeholder-white/30 outline-none focus:border-gold"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-white/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muzamil War"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-gold"
                  />
                </div>

                {submitError && <p className="text-xs text-red-400">{submitError}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] disabled:opacity-60"
                >
                  {loading ? 'Sending OTP...' : 'Send Login OTP'} <ArrowRight size={15} className="ml-1.5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-3 text-center">
                  <p className="text-xs text-white/80">OTP sent to:</p>
                  <p className="text-sm font-semibold text-gold">{email}</p>
                </div>

                {devOtpHint && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-xs text-emerald-300">
                    Dev Code: <span className="font-bold tracking-widest text-emerald-200">{devOtpHint}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-gold placeholder-white/20 outline-none focus:border-gold"
                  />
                </div>

                {submitError && <p className="text-xs text-red-400">{submitError}</p>}
                {successMsg && <p className="text-xs text-emerald-400">{successMsg}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </Button>

                <div className="flex justify-between items-center text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setSubmitError(''); }}
                    className="text-white/60 hover:text-white"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-gold hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PASSWORD AUTH FLOW */}
        {authMode === 'password' && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onPasswordSubmit)}>
            <FormField label="Email" {...register('email')} />
            <FormField label="Password" type="password" {...register('password')} />
            {submitError && <p className="text-xs text-red-400">{submitError}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in with Password'}
            </Button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between border-t border-white/10 pt-4 text-xs text-white/60">
          <Link to="/forgot-password" className="hover:text-gold">Forgot password?</Link>
          <Link to="/register" className="text-gold hover:underline">Don&apos;t have an account? Sign up</Link>
        </div>
      </GlassCard>
    </>
  );
}

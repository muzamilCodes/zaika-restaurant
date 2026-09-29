import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, KeyRound, Mail, User, Phone, ArrowRight, RotateCcw, Sparkles, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const passwordSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password')
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'password'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setSubmitError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await authService.sendOtp({
        email: email.trim().toLowerCase(),
        name: fullName.trim(),
        phone: phone.trim() || undefined
      });
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
      setSubmitError('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    setSubmitError('');
    setLoading(true);

    try {
      const response = await authService.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        name: fullName.trim()
      });
      setAuth(response.data);
      const role = String(response.data?.user?.role || '').replace(/["']/g, '').trim().toLowerCase();
      const isAdmin = role.includes('admin') || response.data?.user?.isAdmin === true || response.data?.user?.admin === true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setSubmitError('');
    setLoading(true);

    try {
      const response = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });

      setAuth(response.data);
      const role = String(response.data?.user?.role || '').replace(/["']/g, '').trim().toLowerCase();
      const isAdmin = role.includes('admin') || response.data?.user?.isAdmin === true || response.data?.user?.admin === true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Register" description="Create your Zaika Restaurant account with One-Time Password (OTP) or Password." />
      <GlassCard className="mx-auto w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Join Zaika</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] text-gold">
            <Sparkles size={11} /> OTP Secured
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">Create account</h1>

        {/* Auth Mode Toggle */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1 border border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setSubmitError(''); }}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
              authMode === 'otp' ? 'bg-gold text-surface-900 font-semibold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} /> Register with OTP
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

        {/* OTP REGISTRATION FLOW */}
        {authMode === 'otp' && (
          <div className="mt-6">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muzamil War"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold focus:bg-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold focus:bg-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Phone Number <span className="text-white/40 text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold focus:bg-white/10"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] py-3 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Sending OTP...'
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold mb-2">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-xs text-white/60">Verification code sent to</p>
                  <p className="text-sm font-semibold text-gold mt-0.5">{email}</p>
                </div>

                {devOtpHint && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-center text-xs text-amber-200">
                    ⚡ Dev Code: <strong className="tracking-widest text-gold text-sm ml-1">{devOtpHint}</strong>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full tracking-[0.5em] text-center font-mono text-2xl font-bold rounded-xl border border-white/15 bg-white/10 py-3 text-gold placeholder-white/20 outline-none transition focus:border-gold focus:bg-white/15"
                  />
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] py-3 text-sm font-semibold"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </Button>

                <div className="flex items-center justify-between text-xs text-white/60 pt-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setSubmitError(''); }}
                    className="text-white/60 hover:text-white underline"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOtp}
                    className="flex items-center gap-1 text-gold hover:underline"
                  >
                    <RotateCcw size={12} /> Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PASSWORD REGISTRATION FLOW */}
        {authMode === 'password' && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onPasswordSubmit)}>
            <FormField label="Full Name" error={errors.name?.message} {...register('name')} />
            <FormField label="Email" error={errors.email?.message} {...register('email')} />
            <FormField label="Password" type="password" error={errors.password?.message} {...register('password')} />
            <FormField
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
            <Button disabled={loading} className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </GlassCard>
    </>
  );
}

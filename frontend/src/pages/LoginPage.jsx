import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore.js';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (values) => {
    setSubmitError('');

    try {
      const response = await authService.login(values);
      setAuth(response.data);
      const role = String(response.data?.user?.role || '').replace(/["']/g, '').trim().toLowerCase();
      const isAdmin = role.includes('admin') || response.data?.user?.isAdmin === true || response.data?.user?.admin === true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <Seo title="Login" description="Login to your Zaika Restaurant account." />
      <GlassCard className="mx-auto w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Welcome back</p>
        <h1 className="mt-3 font-display text-4xl">Login</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" {...register('email')} />
          <FormField label="Password" type="password" {...register('password')} />
          {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Sign in</Button>
        </form>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
          <Link to="/forgot-password">Forgot password</Link>
          <Link to="/register">Create account</Link>
        </div>
      </GlassCard>
    </>
  );
}

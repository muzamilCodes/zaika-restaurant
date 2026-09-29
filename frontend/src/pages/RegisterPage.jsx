import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z
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
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (values) => {
    setSubmitError('');

    try {
      const response = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });

      setAuth(response.data);
      navigate('/');
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Seo title="Register" description="Create your Zaika Restaurant account." />
      <GlassCard className="mx-auto w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Join Zaika</p>
        <h1 className="mt-3 font-display text-4xl">Create account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Create account</Button>
        </form>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
          <Link to="/login">Already have an account?</Link>
        </div>
      </GlassCard>
    </>
  );
}

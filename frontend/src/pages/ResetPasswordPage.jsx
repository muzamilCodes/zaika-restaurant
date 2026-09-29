import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const token = searchParams.get('token') || '';

  const onSubmit = async (values) => {
    await authService.resetPassword({ ...values, token });
    setMessage('Password updated successfully.');
  };

  return (
    <>
      <Seo title="Reset Password" description="Reset your Zaika Restaurant password." />
      <GlassCard className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl">Reset password</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" {...register('email')} />
          <FormField label="New password" type="password" {...register('password')} />
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Update password</Button>
        </form>
        {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
      </GlassCard>
    </>
  );
}

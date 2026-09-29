import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z.object({ email: z.string().email() });

export function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const response = await authService.forgotPassword(values);
    setMessage(response.data.message || 'Reset link prepared.');
    setDevResetLink(response.data.devResetLink || '');
  };

  return (
    <>
      <Seo title="Forgot Password" description="Reset your Zaika Restaurant password." />
      <GlassCard className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl">Forgot password</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" {...register('email')} />
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Send reset link</Button>
        </form>
        {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
        {devResetLink ? (
          <a className="mt-2 block text-sm text-white/70 underline" href={devResetLink}>
            Open dev reset link
          </a>
        ) : null}
      </GlassCard>
    </>
  );
}

import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore.js';
import { authService } from '../services/authService.js';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  });

  const onSubmit = async (values) => {
    const response = await authService.updateProfile(values);
    setAuth({ user: response.data.user, accessToken: useAuthStore.getState().accessToken });
  };

  return (
    <>
      <Seo title="Profile" description="Manage your Zaika Restaurant profile." />
      <SectionHeading eyebrow="Profile" title="Your account" />
      <GlassCard className="mt-8 max-w-2xl">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Phone" {...register('phone')} />
          <div className="md:col-span-2">
            <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Save changes</Button>
          </div>
        </form>
      </GlassCard>
    </>
  );
}

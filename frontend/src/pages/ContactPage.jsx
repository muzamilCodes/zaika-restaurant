import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FormField, FormTextArea } from '../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { contactService } from '../services/contactService.js';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export function ContactPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  const mapsEmbedUrl = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL?.trim();
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Zaika Restaurant, Handwara, Jammu & Kashmir, India')}`;

  const businessDetails = {
    name: 'Zaika Restaurant',
    address: 'Handwara, Jammu & Kashmir, India',
    phone: '+91 70000 00000',
    email: 'hello@zaikarestaurant.in',
    hours: [
      { label: 'Monday–Thursday', value: '11:30 AM – 10:30 PM' },
      { label: 'Friday–Sunday', value: '11:30 AM – 11:30 PM' }
    ]
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await contactService.sendContact(values);
      setMessage(response.data.message || 'We received your message.');
      setError('');
      reset();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send your message right now.');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Contact" description="Contact Zaika Restaurant and locate us on Google Maps." />

      <SectionHeading
        eyebrow="Contact"
        title="Reach our team"
        description="Send us a message and we’ll get back to you soon."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" {...register('name')} />
              <FormField label="Email" {...register('email')} />
            </div>

            <FormTextArea label="Message" {...register('message')} />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </form>

          {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </GlassCard>

        <GlassCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Business info</p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-lg font-semibold text-white">{businessDetails.name}</p>
            <p className="mt-2 text-sm text-white/70">{businessDetails.address}</p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
                <a href={`tel:${businessDetails.phone}`}>Call now</a>
              </Button>
              <Button asChild className="w-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                <a href={`mailto:${businessDetails.email}`}>Email us</a>
              </Button>
              <Button asChild className="w-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                <a href={directionsUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Phone</p>
              <a
                href={`tel:${businessDetails.phone}`}
                className="mt-2 block text-sm text-white/80 hover:text-gold"
              >
                {businessDetails.phone}
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Email</p>
              <a
                href={`mailto:${businessDetails.email}`}
                className="mt-2 block break-all text-sm text-white/80 hover:text-gold"
              >
                {businessDetails.email}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Opening hours</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              {businessDetails.hours.map((slot) => (
                <div key={slot.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span>{slot.label}</span>
                  <span className="text-white/90">{slot.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
            <p>Dining • Delivery • Takeaway • Friendly service in Handwara.</p>
          </div>

          {mapsEmbedUrl ? (
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Zaika restaurant map"
                src={mapsEmbedUrl}
                className="h-56 w-full sm:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <GlassCard className="border border-white/10 bg-white/5">
              <p className="text-sm text-white/70">
                Set <span className="font-semibold">VITE_GOOGLE_MAPS_EMBED_URL</span> in frontend/.env to enable
                the live Google Maps embed.
              </p>
            </GlassCard>
          )}
        </GlassCard>
      </div>
    </>
  );
}


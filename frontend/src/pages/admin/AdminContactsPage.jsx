import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Loading messages...');
  const [error, setError] = useState('');

  const loadMessages = async () => {
    const response = await api.get('/admin/contacts');
    setMessages(response.data.messages || []);
    setStatus('');
  };

  useEffect(() => {
    loadMessages().catch(() => setStatus('Contact messages could not be loaded.'));
  }, []);

  const markRead = async (id) => {
    await api.patch(`/admin/contacts/${id}/read`);
    loadMessages();
  };

  const deleteMessage = async (id) => {
    try {
      setError('');
      await api.delete(`/admin/contacts/${id}`);
      await loadMessages();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete message.');
    }
  };

  return (
    <>
      <Seo title="Admin Contact Messages" description="View Zaika Restaurant contact form messages." />
      <SectionHeading eyebrow="Contact" title="Messages" />
      {status ? <p className="mt-4 text-sm text-gold">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {messages.length ? (
          messages.map((item) => (
            <GlassCard key={item._id} className={item.status === 'new' ? 'border border-gold/30 bg-gold/5' : ''}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl">{item.name}</p>
                  <p className="mt-1 text-sm text-white/65">{item.email}</p>
                  <p className="mt-4 text-sm leading-7 text-white/75">{item.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold">
                    {item.status} - {item.emailSent ? 'email sent' : 'saved only'}
                  </p>
                </div>
                {item.status === 'new' ? (
                  <Button
                    type="button"
                    onClick={() => markRead(item._id)}
                    className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <MailCheck size={16} className="mr-2" />
                    Mark read
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => deleteMessage(item._id)}
                  className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                >
                  Delete
                </Button>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard>No contact messages yet.</GlassCard>
        )}
      </div>
    </>
  );
}

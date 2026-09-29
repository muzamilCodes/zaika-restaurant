import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.users().then((response) => setUsers(response.data.users || [])).catch(() => setError('Customers could not be loaded.'));
  }, []);

  const deleteUser = async (id) => {
    try {
      setError('');
      setStatus('');
      await adminService.deleteUser(id);
      setStatus('Customer deleted.');
      const response = await adminService.users();
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete customer.');
    }
  };

  return (
    <>
      <Seo title="Customers" description="View customer accounts and order history." />
      <SectionHeading eyebrow="Customers" title="Customer management" />
      {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {users.map((user) => (
          <GlassCard key={user._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{user.name}</p>
              <p className="mt-2 text-sm text-white/65">{user.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">{user.role || 'customer'}</p>
            </div>
            <Button
              type="button"
              onClick={() => deleteUser(user._id)}
              className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            >
              Delete
            </Button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}

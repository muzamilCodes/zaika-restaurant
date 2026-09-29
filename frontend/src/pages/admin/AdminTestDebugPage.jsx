import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export default function AdminTestDebugPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [debug, setDebug] = useState({ status: 'idle', message: '', ok: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!accessToken) {
          setDebug({ status: 'error', message: 'No accessToken in store', ok: false });
          return;
        }
        const res = await adminService.dashboard();
        if (!alive) return;
        setDebug({ status: 'success', message: 'Admin endpoint OK', ok: true, payload: res.data });
      } catch (e) {
        if (!alive) return;
        const msg = e?.response?.data?.message || e?.message || 'Admin endpoint failed';
        setDebug({ status: 'error', message: msg, ok: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, [accessToken]);

  return (
    <>
      <Seo title="Admin Debug" description="Auth/admin debug." />
      <SectionHeading eyebrow="Debug" title="Admin access debug" description="Shows what frontend store has and whether backend accepts /admin/dashboard." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Frontend store</p>
          <pre className="mt-4 overflow-auto rounded-xl bg-white/5 p-4 text-xs text-white/80">
            {JSON.stringify({ user, accessTokenPresent: !!accessToken }, null, 2)}
          </pre>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Backend response</p>
          <p className={`mt-4 text-sm ${debug.ok ? 'text-gold' : 'text-red-400'}`}>{debug.message}</p>
          {debug.payload ? (
            <pre className="mt-4 overflow-auto rounded-xl bg-white/5 p-4 text-xs text-white/80">
              {JSON.stringify(debug.payload, null, 2)}
            </pre>
          ) : null}
        </GlassCard>
      </div>
    </>
  );
}


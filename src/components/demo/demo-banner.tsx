'use client';
import { RotateCcw, LogOut, FlaskConical } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PERSONAS } from '@/lib/domain/demo-fixture';
export function DemoBanner() {
  const { session, isDemoUser, isLoading, switchDemoPersona, resetDemo, exitDemo } = useAuth();
  if (!isDemoUser) return null;
  return <div className="demo-banner"><span className="flex items-center gap-2"><FlaskConical size={18} aria-hidden="true" /><strong>Demo — illustrative</strong><span className="hidden xl:inline">Synthetic profiles. No government submission.</span></span>
    <div className="flex flex-wrap gap-2 items-center"><label className="sr-only" htmlFor="persona">Demo persona</label><select id="persona" value={session?.personaId || ''} disabled={isLoading} onChange={e => switchDemoPersona(e.target.value)}>{PERSONAS.map(p => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}</select><button disabled={isLoading} onClick={resetDemo}><RotateCcw size={16} />Reset Demo</button><button disabled={isLoading} onClick={exitDemo}><LogOut size={16} />Exit Demo</button></div>
  </div>;
}

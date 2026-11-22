'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SessionView } from './domain/model';
interface AuthContextType {
  session: SessionView | null; isLoading: boolean; isAuthenticated: boolean; isDemoUser: boolean;
  user: { name: string; email: string } | null; error: string | null; epoch: number;
  login: (email: string, password?: string, redirect?: string) => Promise<void>;
  register: (name: string, email: string, password?: string, redirect?: string) => Promise<void>;
  loginDemo: (id?: string, redirect?: string) => Promise<void>; logout: () => Promise<void>; exitDemo: () => Promise<void>;
  switchDemoPersona: (id: string) => Promise<void>; resetDemo: () => Promise<void>;
  action: (type: string, payload?: Record<string, unknown>) => Promise<boolean>;
}
class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
const Context = createContext<AuthContextType | null>(null);
async function api(url: string, body?: unknown, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: body === undefined ? 'GET' : 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error || `Request failed with status ${res.status}. Please retry.`, res.status);
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and retry.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
const safeRedirect = (path = '/app') => (path.startsWith('/app') && !path.startsWith('//')) ? path : (path.startsWith('/dashboard') ? '/app' : '/app');
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionView | null>(null), [isLoading, setLoading] = useState(true), [error, setError] = useState<string | null>(null), [epoch, setEpoch] = useState(0);
  const busy = useRef(false), generation = useRef(0); const router = useRouter();
  useEffect(() => {
    let active = true;
    const captured = generation.current;
    try { for (const key of ['adhikaar_user','adhikaar_role','adhikaar_demo_persona']) localStorage.removeItem(key); } catch { /* Browser storage may be disabled. */ }
    api('/api/session', undefined, 12000).then(data => { if (active && generation.current === captured) setSession(data); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function run(operation: () => Promise<void>) {
    if (busy.current) throw new Error('Please wait for the current action.');
    busy.current = true; setLoading(true); setError(null);
    try { await operation(); } catch (e) {
      if (e instanceof ApiError && e.status === 401) { generation.current++; setSession(null); setEpoch(n => n + 1); await api('/api/session').catch(() => {}); }
      setError(e instanceof Error ? e.message : 'Request failed.'); throw e;
    }
    finally { busy.current = false; setLoading(false); }
  }
  async function authenticate(url: string, body: unknown, redirect = '/app') {
    await run(async () => {
      const authResult = await api(url, body, 12000);
      generation.current++;
      setEpoch(n => n + 1);
      let nextSession: SessionView | null = authResult?.session || null;
      if (!nextSession) {
        nextSession = await api('/api/session', undefined, 12000);
      }
      if (!nextSession) {
        throw new Error('Session verification failed. Please retry.');
      }
      setSession(nextSession);
      // Authentication changes the cookie outside a Server Action. Discard any anonymous
      // prefetched redirects before entering the protected workspace.
      window.location.assign(safeRedirect(redirect));
    });
  }
  async function end() {
    try { await run(async () => { await api('/api/auth/logout', {}); generation.current++; setSession(null); setEpoch(n => n + 1); router.push('/sign-in'); router.refresh(); }); } catch { /* Visible global error; no fake logout. */ }
  }
  async function mutateDemo(url: string, extra = {}) {
    try { await run(async () => { const next = await api(url, { ...extra, namespace: session?.namespace, revision: session?.revision }); generation.current++; setSession(next); setEpoch(n => n + 1); }); } catch { /* error is rendered in the application shell */ }
  }
  async function action(type: string, payload = {}) {
    let ok = false; const captured = generation.current;
    try { await run(async () => { const next = await api('/api/workspace', { type, payload, namespace: session?.namespace, revision: session?.revision }); if (generation.current === captured) { setSession(next); ok = true; } }); } catch { /* preserve input and show error */ }
    return ok;
  }
  return <Context value={{ session, isLoading, error, epoch, isAuthenticated: !!session, isDemoUser: session?.role === 'DEMO_USER', user: session ? { name: session.workspace.profile.name, email: session.workspace.profile.email } : null,
    login: (email, password, redirect) => authenticate('/api/auth/login', { email, password }, redirect),
    register: (name, email, password, redirect) => authenticate('/api/auth/register', { fullName: name, email, password }, redirect),
    loginDemo: (id = 'aarohi-rao', redirect) => authenticate('/api/auth/demo', { personaId: id }, redirect), logout: end, exitDemo: end,
    switchDemoPersona: id => mutateDemo('/api/demo/switch-persona', { personaId: id }), resetDemo: () => mutateDemo('/api/demo/reset'), action }}>{children}</Context>;
}
export function useAuth() { const context = useContext(Context); if (!context) throw new Error('Auth provider missing'); return context; }

'use client';
import Link from 'next/link';
import { ConversationProvider } from '@/components/assistant/conversation';
import { useAuth } from '@/lib/auth-context';
export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const { session, isLoading, error, epoch } = useAuth();
  if (!session) return <div className="surface empty-state" role="status"><h1>{isLoading ? 'Opening your workspace…' : 'Sign in to your workspace'}</h1>{!isLoading && <Link className="action-link" href="/sign-in">Go to sign in</Link>}</div>;
  return <div key={`${session.namespace}:${epoch}`} data-reduced-motion={session.workspace.settings.reducedMotion}>
    {error && <div role="alert" className="error-banner">{error} <button onClick={() => window.location.reload()}>Reload workspace</button></div>}<ConversationProvider>{children}</ConversationProvider>
  </div>;
}

'use client';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, ExternalLink, Compass } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assess } from '@/lib/domain/eligibility';
import type { Scheme } from '@/lib/domain/model';
export const statusLabel = { POTENTIALLY_ELIGIBLE: 'Potentially eligible', MORE_INFORMATION_NEEDED: 'More information needed', NOT_ELIGIBLE_BASED_ON_KNOWN_RULES: 'Known criteria not met' };
export function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <p className="muted max-w-2xl">{children}</p>}</header>;
}
export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return <div className="surface empty-state"><Compass size={30} aria-hidden="true" /><h2>{title}</h2><p className="muted">{children}</p><Link className="action-link" href="/app/discover">Explore the catalogue</Link></div>;
}
export function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { session, action, isLoading } = useAuth();
  const saved = session?.workspace.savedSchemeIds.includes(scheme.id);
  const result = session && assess(session.workspace.profile, scheme.id);
  return <article className="surface scheme-card">
    <div className="flex items-start justify-between gap-3"><span className="pill">{scheme.category}</span><button className="icon-button" aria-label={`${saved ? 'Remove' : 'Save'} ${scheme.name}`} aria-pressed={saved} disabled={isLoading} onClick={() => action('SAVE', { schemeId: scheme.id })}>{saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}</button></div>
    <p className="metadata">{scheme.authority}</p><h2><Link href={`/app/schemes/${scheme.id}`}>{scheme.name}</Link></h2><p className="muted">{scheme.description}</p>
    {result && <span className={`pill ${result.status === 'POTENTIALLY_ELIGIBLE' ? 'success' : ''}`}>{statusLabel[result.status]}</span>}
    <div className="card-actions"><Link href={`/app/schemes/${scheme.id}`}>Criteria & documents</Link><a href={scheme.source.url} target="_blank" rel="noopener noreferrer" aria-label={`Official source for ${scheme.name}`}><ExternalLink size={18} /></a></div>
  </article>;
}

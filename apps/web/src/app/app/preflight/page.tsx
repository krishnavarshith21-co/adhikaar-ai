'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { SCHEMES } from '@/lib/domain/catalog';
import { recommendations } from '@/lib/domain/eligibility';
import { useAuth } from '@/lib/auth-context';
import { Heading } from '@/components/workspace/common';
export default function PreflightPage() {
 const { session, action, isLoading } = useAuth(); const params = useSearchParams();
 const router = useRouter();
 const id = params.get('scheme') ?? (session && recommendations(session.workspace.profile)[0]?.id) ?? '';
 const scheme = SCHEMES.find(s => s.id === id); const ready = scheme?.documents.filter(d => session?.workspace.documentStatus[`${scheme.id}:${d.id}`]).length || 0;
 return <div className="page-stack"><Heading eyebrow="Application Preflight" title="Arrive prepared.">Mark what you have, see what remains. Readiness is self-reported; no document is uploaded or government verified here.</Heading><label className="block max-w-xl">Choose a programme<select className="mt-2" value={id} onChange={e => router.replace(`/app/preflight?scheme=${encodeURIComponent(e.target.value)}`, { scroll: false })}><option value="">Select a programme</option>{SCHEMES.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label>{scheme && <div className="surface p-6 sm:p-8"><div className="section-heading"><h2>{scheme.name}</h2><span className="pill">{ready} / {scheme.documents.length} ready</span></div><progress className="readiness-progress" value={ready} max={scheme.documents.length} aria-label="Self-reported readiness" /><p className="muted my-5">{scheme.documentNote}</p><div className="document-list">{scheme.documents.map(d => <label key={d.id}><input type="checkbox" checked={!!session?.workspace.documentStatus[`${scheme.id}:${d.id}`]} disabled={isLoading} onChange={e => action('DOCUMENT', { schemeId:scheme.id, documentId:d.id, ready:e.target.checked })} /><span><strong>{d.name}</strong><small>{session?.workspace.documentStatus[`${scheme.id}:${d.id}`] ? 'You marked this ready' : 'Not marked ready'}</small></span></label>)}</div><a className="text-link" href={scheme.portal} target="_blank" rel="noopener noreferrer">Confirm the current requirements with the official service</a></div>}</div>;
}

'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SCHEMES } from '@/lib/domain/catalog';
import { assess } from '@/lib/domain/eligibility';
import { useAuth } from '@/lib/auth-context';
import { Heading, statusLabel } from '@/components/workspace/common';
export default function EligibilityPage() {
 const { session } = useAuth(); const params = useSearchParams(); if (!session) return null;
 const selected = params.get('scheme'); const schemes = selected ? SCHEMES.filter(s => s.id === selected) : SCHEMES;
 return <div className="page-stack"><Heading eyebrow="Understand the criteria" title="A considered first check.">These deterministic checks use your saved profile. They cover known preliminary criteria, not every official condition. No result is an approval or a promise of funding.</Heading><div className="surface profile-summary"><div><strong>{session.workspace.profile.name}</strong><p className="muted">{session.workspace.profile.occupation || 'Occupation not provided'} · {session.workspace.profile.state || 'State not provided'}</p></div><Link className="action-link" href="/app/profile">Update profile</Link></div>{schemes.length === 0 && <p>Programme not found. <Link href="/app/eligibility">View all assessments</Link></p>}{schemes.map(s => { const result = assess(session.workspace.profile,s.id); return <article className="surface p-6 sm:p-8" key={s.id}><span className={`pill ${result.status === 'POTENTIALLY_ELIGIBLE' ? 'success' : ''}`}>{statusLabel[result.status]}</span><h2 className="mt-4">{s.name}</h2><ul className="criteria-list">{result.reasons.map(r => <li key={r}>{r}</li>)}{result.missing.map(r => <li key={r}>{r}</li>)}</ul><p className="muted">Final checks: {s.conditions.join(' ')}</p><div className="card-actions"><Link href={`/app/preflight?scheme=${s.id}`}>Prepare documents</Link><a href={s.source.url} target="_blank" rel="noopener noreferrer">Official criteria</a></div><p className="metadata mt-3">Rule set: {result.ruleVersion}</p></article>; })}</div>;
}

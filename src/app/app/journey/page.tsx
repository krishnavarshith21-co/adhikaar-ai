'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { schemeById } from '@/lib/domain/catalog';
import { Heading, Empty } from '@/components/workspace/common';
const steps = ['Programme selected', 'Review the criteria', 'Prepare your documents', 'Preparation complete'];
export default function JourneyPage() {
 const { session, isDemoUser, isLoading, action } = useAuth();
 if (!session) return null;
 const journeys = session.workspace.journeys || [];
 return <div className="page-stack"><Heading eyebrow="One step at a time" title="Your preparation journeys.">This personal tracker does not file an application or receive government decisions. {isDemoUser && 'Demo — illustrative.'}</Heading>{!journeys.length && <Empty title="A new journey awaits">Open a programme’s details and start preparing.</Empty>}{journeys.map(j => <article className="surface p-6 sm:p-8" key={j.schemeId}><span className="pill">{isDemoUser ? 'Demo — illustrative' : 'Personal preparation'}</span><h2 className="mt-4">{schemeById(j.schemeId)?.name}</h2><ol className="journey-steps">{steps.map((step,i) => <li key={step} data-complete={i <= j.stage}><span>{i + 1}</span><strong>{step}</strong></li>)}</ol><div className="card-actions"><Link href={`/app/preflight?scheme=${j.schemeId}`}>Open Preflight</Link><Link href={`/app/assistant?scheme=${j.schemeId}`}>Ask ADHIKAAR Guide</Link></div><div className="flex flex-wrap items-center justify-between gap-4"><p className="metadata">Updated {new Date(j.updatedAt).toLocaleDateString('en-IN')} · No application submitted</p><button className="action-link" disabled={isLoading || j.stage === 3} onClick={() => action('JOURNEY', { schemeId:j.schemeId })}>{j.stage === 3 ? 'Preparation complete' : isDemoUser ? 'Simulate next preparation step' : 'Mark next preparation step complete'}</button></div></article>)}</div>; }

'use client';
import { useAuth } from '@/lib/auth-context';
import { SCHEMES } from '@/lib/domain/catalog';
import { Heading, Empty, SchemeCard } from '@/components/workspace/common';
export default function SavedPage() {
 const { session } = useAuth();
 if (!session) return null;
 const schemes = SCHEMES.filter(s => session.workspace.savedSchemeIds.includes(s.id)); return <div className="page-stack"><Heading eyebrow="Your collection" title="Worth coming back to.">{schemes.length} saved programmes in this workspace.</Heading>{schemes.length ? <div className="scheme-grid">{schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}</div> : <Empty title="Your collection starts here">Save a programme from the catalogue to keep it close.</Empty>}</div>; }

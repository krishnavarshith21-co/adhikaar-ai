'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCHEMES } from '@/lib/domain/catalog';
import { useAuth } from '@/lib/auth-context';
import { assess } from '@/lib/domain/eligibility';
import { Heading, Empty, SchemeCard } from '@/components/workspace/common';
export default function DiscoverPage() {
  const params = useSearchParams();
  const categories: Record<string, string> = { EDUCATION: 'Education', AGRICULTURE: 'Agriculture', LIVELIHOOD: 'Enterprise' };
  return <DiscoveryResults key={params.toString()} initialSearch={params.get('q') || params.get('query') || ''} initialCategory={categories[params.get('category') || ''] || 'All'} />;
}
function DiscoveryResults({ initialSearch, initialCategory }: { initialSearch: string; initialCategory: string }) {
  const [search,setSearch] = useState(initialSearch); const [category,setCategory] = useState(initialCategory); const [matches,setMatches] = useState(false); const { session } = useAuth();
  const filtered = SCHEMES.filter(s => (category === 'All' || s.category === category) && `${s.name} ${s.description} ${s.keywords.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase().replace(/vidyalakshmi|vidyalakshm[iy]/g, 'vidyalaxmi')) && (!matches || session && assess(session.workspace.profile,s.id).status === 'POTENTIALLY_ELIGIBLE'));
  return <div className="page-stack"><Heading eyebrow="The programme library" title="Discover your possibilities.">Explore a focused catalogue with official sources. Conditions and preparation checklists are preliminary; confirm current requirements with the issuing authority.</Heading><div className="surface filter-bar"><label>Search<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Programme or topic" /></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{['All','Education','Agriculture','Enterprise'].map(c => <option key={c}>{c}</option>)}</select></label><label className="checkbox-label"><input type="checkbox" checked={matches} onChange={e => setMatches(e.target.checked)} />Potential matches only</label></div><p className="metadata" role="status">{filtered.length} programmes found</p><div className="scheme-grid">{filtered.map(s => <SchemeCard key={s.id} scheme={s} />)}</div>{!filtered.length && <><Empty title="No programmes match these filters">Try a broader term or another category.</Empty><button className="action-link" onClick={() => { setSearch(''); setCategory('All'); setMatches(false); }}>Clear filters</button></>}</div>;
}

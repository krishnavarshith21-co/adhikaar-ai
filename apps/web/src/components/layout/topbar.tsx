'use client';
import Link from 'next/link';
import { Bell, Search, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { metrics } from '@/lib/domain/eligibility';
export function TopBar() {
  const { session, user } = useAuth(); const unread = session ? metrics(session.workspace).unread : 0;
  return <header className="workspace-topbar"><Link href="/app" className="wordmark lg:hidden">ADHIKAAR <span>AI</span></Link><form action="/app/discover" className="hidden md:flex items-center gap-2"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="global-search">Search schemes</label><input id="global-search" name="q" type="search" placeholder="Find a programme…" /></form><div className="flex items-center gap-2 ml-auto"><Link className="icon-button relative" href="/app/notifications" aria-label={`Notifications, ${unread} unread`}><Bell size={20} />{unread > 0 && <span className="notification-count">{unread}</span>}</Link><Link href="/app/profile" className="profile-link"><UserRound size={20} /><span className="hidden sm:inline">{user?.name || 'Your profile'}</span></Link></div></header>;
}

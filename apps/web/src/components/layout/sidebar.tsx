'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Compass, ShieldCheck, ClipboardCheck, Route, Bookmark, MessagesSquare, Bell, UserRound, Settings, CircleHelp, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
const links = [
  { href: '/app', label: 'Overview', icon: LayoutDashboard }, { href: '/app/discover', label: 'Discover', icon: Compass },
  { href: '/app/eligibility', label: 'Eligibility', icon: ShieldCheck }, { href: '/app/preflight', label: 'Preflight', icon: ClipboardCheck },
  { href: '/app/journey', label: 'Your journeys', icon: Route }, { href: '/app/saved', label: 'Saved schemes', icon: Bookmark },
  { href: '/app/assistant', label: 'ADHIKAAR Guide', icon: MessagesSquare }, { href: '/app/notifications', label: 'Notifications', icon: Bell },
  { href: '/app/profile', label: 'Your profile', icon: UserRound }, { href: '/app/settings', label: 'Settings', icon: Settings }, { href: '/app/help', label: 'Help & trust', icon: CircleHelp },
];
function NavLinks({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={close} aria-current={(href === '/app' ? pathname === href : pathname.startsWith(href)) ? 'page' : undefined}><Icon size={19} aria-hidden="true" />{label}</Link>)}</>;
}
export function Sidebar() {
  const { logout, isDemoUser, isLoading } = useAuth();
  return <aside className="workspace-sidebar"><Link className="wordmark" href="/app">ADHIKAAR <span>AI</span></Link><p className="eyebrow">Your civic companion</p><nav aria-label="Workspace"><NavLinks /></nav><div className="sidebar-bottom"><p>Clarity. Preparation.<br />Your next step.</p><button disabled={isLoading} onClick={logout}><LogOut size={18} />{isDemoUser ? 'Exit Demo' : 'Sign out'}</button></div></aside>;
}
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { logout, isLoading } = useAuth();
  const pathname = usePathname();
  return (
    <>
      <nav className="mobile-nav" aria-label="Mobile workspace">
        <Link href="/app" aria-current={pathname === '/app' ? 'page' : undefined}>
          <LayoutDashboard size={20} />
          Overview
        </Link>
        <Link href="/app/discover" aria-current={pathname.startsWith('/app/discover') ? 'page' : undefined}>
          <Compass size={20} />
          Discover
        </Link>
        <Link href="/app/assistant" aria-current={pathname.startsWith('/app/assistant') ? 'page' : undefined}>
          <MessagesSquare size={20} />
          Guide
        </Link>
        <button aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
          Menu
        </button>
      </nav>
      {open && (
        <nav className="mobile-menu" id="mobile-menu" aria-label="All pages">
          <NavLinks close={() => setOpen(false)} />
          <button disabled={isLoading} onClick={() => { setOpen(false); void logout(); }}>
            <LogOut size={18} />
            Sign out / Exit Demo
          </button>
        </nav>
      )}
    </>
  );
}

'use client';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Heading, Empty } from '@/components/workspace/common';
export default function NotificationsPage() {
 const { session, isDemoUser, isLoading, action } = useAuth();
 if (!session) return null;
 const notices = session.workspace.notifications || []; return <div className="page-stack"><Heading eyebrow="Your updates" title="Nothing important, overlooked.">Preparation reminders from your workspace. This is not an official government notification service.</Heading>{notices.some(n => !n.read) && <button className="action-link" disabled={isLoading} onClick={() => action('READ', { id: 'all' })}>Mark all as read</button>}{!notices.length ? <Empty title="You’re all caught up">There are no notifications in this account.</Empty> : notices.map(n => <article className="surface notification-row" key={n.id}><Bell size={22} /><div><span className="pill">{isDemoUser ? 'Demo — illustrative' : 'Workspace reminder'}</span><p className="mt-3">{n.text}</p></div><button className="action-link" disabled={isLoading || n.read} onClick={() => action('READ', { id:n.id })}>{n.read ? 'Read' : 'Mark read'}</button></article>)}</div>; }

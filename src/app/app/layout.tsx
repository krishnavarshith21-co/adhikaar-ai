import { Suspense } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { DemoBanner } from '@/components/demo/demo-banner';
import { WorkspaceGate } from '@/components/workspace/gate';
export const instant = false;
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="workspace"><a href="#workspace-content" className="skip-link">Skip to content</a><Suspense fallback={null}><Sidebar /></Suspense><div className="workspace-body"><DemoBanner /><TopBar /><main id="workspace-content" className="workspace-main"><WorkspaceGate><Suspense fallback={<p role="status">Loading view…</p>}>{children}</Suspense></WorkspaceGate></main></div><Suspense fallback={null}><MobileNav /></Suspense></div>;
}

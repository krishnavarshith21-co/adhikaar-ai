'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Heading } from '@/components/workspace/common';
import type { Language, Workspace } from '@/lib/domain/model';
type WorkspaceSettings = Workspace['settings'];
export default function SettingsPage() {
 const { session, action, isLoading } = useAuth();
 const defaultSettings: WorkspaceSettings = { language: 'en', reducedMotion: false };
 const [settings,setSettings] = useState<WorkspaceSettings>(session?.workspace.settings || defaultSettings);
 const [saved,setSaved] = useState(false);
 if (!session) return null;
 return <div className="page-stack max-w-2xl"><Heading eyebrow="Make yourself comfortable" title="Your preferences.">Saved to this account or demo persona only.</Heading><form className="surface p-8 space-y-6" onSubmit={async e => { e.preventDefault(); setSaved(await action('SETTINGS', settings)); }}><label className="block">Assistant language<select className="mt-2" value={settings.language} onChange={e => { setSaved(false); setSettings({ ...settings,language:e.target.value as Language }); }}><option value="en">English</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option></select></label><label className="checkbox-label"><input type="checkbox" checked={settings.reducedMotion} onChange={e => { setSaved(false); setSettings({ ...settings,reducedMotion:e.target.checked }); }} />Reduce motion</label><p className="muted">Your device’s reduced-motion setting is also respected. Voice availability depends on your browser, installed voices and the configured transcription service.</p><button className="action-link" type="submit" disabled={isLoading}>Save preferences</button>{saved && <p role="status">Preferences saved.</p>}</form></div>; }

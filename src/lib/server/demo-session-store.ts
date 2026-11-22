import { randomUUID } from 'node:crypto';
import { fixture } from '../domain/demo-fixture';
import type { SessionView, Workspace } from '../domain/model';
interface DemoSession { id: string; personaId: string; workspaces: Record<string, Workspace>; revision: number; expires: number }
const root = globalThis as typeof globalThis & { adhikaarDemoSessions?: Map<string, DemoSession> };
const sessions = root.adhikaarDemoSessions ??= new Map<string, DemoSession>();
const TTL = 8 * 60 * 60 * 1000;
export function createDemoSession(personaId: string) {
  const workspace = fixture(personaId);
  for (const [key, session] of sessions) if (session.expires < Date.now()) sessions.delete(key);
  if (sessions.size >= 2000) throw new Error('Demo capacity reached. Try later.');
  const token = `demo-${randomUUID()}`;
  sessions.set(token, { id: randomUUID(), personaId, workspaces: { [personaId]: workspace }, revision: 0, expires: Date.now() + TTL });
  return token;
}
export function getDemoSession(token: string) {
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) { sessions.delete(token); return null; }
  return session;
}
export function demoView(token: string): SessionView | null {
  const s = getDemoSession(token);
  return s ? { role: 'DEMO_USER', namespace: `demo:${s.id}:${s.personaId}`, personaId: s.personaId, revision: s.revision, workspace: s.workspaces[s.personaId] } : null;
}
export function switchDemoPersona(token: string, id: string) {
  const initial = fixture(id), session = getDemoSession(token);
  if (!session) throw new Error('Session expired.');
  session.workspaces[id] ??= initial; session.personaId = id; session.revision++;
}
export function resetDemoSession(token: string) {
  const session = getDemoSession(token);
  if (!session) throw new Error('Session expired.');
  session.workspaces[session.personaId] = fixture(session.personaId); session.revision++;
}
export function deleteDemoSession(token: string) { sessions.delete(token); }

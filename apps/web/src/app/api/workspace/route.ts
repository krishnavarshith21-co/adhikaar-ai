import { applyAction } from '@/lib/domain/actions';
import { demoView, getDemoSession } from '@/lib/server/demo-session-store';
import { backend, failure, HttpError, readJson, requireSession, sameOrigin } from '@/lib/server/session';
export async function POST(request: Request) {
  try {
    sameOrigin(request); const { token, view: initial } = await requireSession(); const body = await readJson(request);
    const view = initial.role === 'DEMO_USER' ? demoView(token) : initial;
    if (!view) throw new HttpError(401, 'Session expired.');
    if (body.namespace !== view.namespace || body.revision !== view.revision) throw new HttpError(409, 'Your profile changed. Reload and retry.');
    let workspace;
    try { workspace = applyAction(view.workspace, String(body.type), (body.payload || {}) as Record<string, unknown>); }
    catch (e) { throw new HttpError(400, e instanceof Error ? e.message : 'Invalid change.'); }
    if (view.role === 'DEMO_USER') {
      const session = getDemoSession(token)!;
      session.workspaces[session.personaId] = workspace; session.revision++;
      return Response.json(demoView(token));
    }
    const saved = await backend('/workspace', token, { method: 'PUT', body: JSON.stringify({ revision: view.revision, workspace }) });
    return Response.json({ ...view, workspace: saved.workspace, revision: saved.revision });
  } catch (e) { return failure(e); }
}

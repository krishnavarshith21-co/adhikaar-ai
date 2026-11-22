import { demoView, resetDemoSession, switchDemoPersona } from './demo-session-store';
import { failure, HttpError, readJson, requireSession, sameOrigin } from './session';
export async function demoMutation(request: Request, action: 'reset' | 'switch') {
  try {
    sameOrigin(request); const { token, view: initial } = await requireSession();
    if (initial.role !== 'DEMO_USER') throw new HttpError(403, 'An explicit demo session is required.');
    const body = await readJson(request);
    const view = demoView(token);
    if (!view) throw new HttpError(401, 'Session expired.');
    if (body.namespace !== view.namespace || body.revision !== view.revision) throw new HttpError(409, 'Demo changed. Reload and retry.');
    try {
      if (action === 'reset') resetDemoSession(token);
      else switchDemoPersona(token, String(body.personaId));
    } catch { throw new HttpError(400, 'Unknown demo persona.'); }
    return Response.json(demoView(token));
  } catch (e) { return failure(e); }
}

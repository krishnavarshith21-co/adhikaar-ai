import { NextResponse } from 'next/server';
import { createDemoSession, deleteDemoSession, demoView } from '@/lib/server/demo-session-store';
import { backend, failure, readJson, sameOrigin, setCookie, token, HttpError } from '@/lib/server/session';
import { PERSONAS } from '@/lib/domain/demo-fixture';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await readJson(request);
    const id = String(body.personaId || 'aarohi-rao');
    const persona = PERSONAS.find(p => p.id === id);
    if (!persona) throw new HttpError(400, 'Unknown demo persona.');

    const old = await token();
    if (old?.startsWith('demo-')) {
      deleteDemoSession(old);
    } else if (old) {
      // Best-effort cleanup for real account session; do not block demo session creation if backend is offline
      try {
        await backend('/auth/logout', old, { method: 'POST' });
      } catch {
        // Safe: non-blocking
      }
    }

    const sessionToken = createDemoSession(id);
    const view = demoView(sessionToken);

    const response = NextResponse.json({
      ok: true,
      role: 'DEMO_USER',
      personaId: id,
      token: sessionToken,
      persona: {
        id: persona.id,
        name: persona.name,
        role: persona.role,
        location: persona.location,
      },
      session: view,
    });

    return setCookie(response, sessionToken, request);
  } catch (e) {
    return failure(e);
  }
}

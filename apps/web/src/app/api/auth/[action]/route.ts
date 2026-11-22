import { NextResponse } from 'next/server';
import { backend, failure, HttpError, readJson, sameOrigin, setCookie, token } from '@/lib/server/session';
import { deleteDemoSession } from '@/lib/server/demo-session-store';
export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  try {
    sameOrigin(request); const { action } = await context.params;
    const old = await token();
    if (action === 'logout') {
      if (old?.startsWith('demo-')) deleteDemoSession(old);
      else if (old) {
        try {
          await backend('/auth/logout', old, { method: 'POST' });
        } catch (error) {
          if (!(error instanceof HttpError && error.status === 401)) throw error;
        }
      }
      return setCookie(NextResponse.json({ ok: true }), '', request);
    }
    if (!['login', 'register'].includes(action)) throw new HttpError(404, 'This account action is not available.');
    const body = await readJson(request);
    if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 72) throw new HttpError(400, 'Enter your email and a password of 8–72 characters.');
    body.email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email as string) || (action === 'register' && (typeof body.fullName !== 'string' || !body.fullName.trim() || body.fullName.length > 150))) throw new HttpError(400, 'Enter a valid name and email.');
    if (new TextEncoder().encode(body.password as string).length > 72) throw new HttpError(400, 'Password must not exceed 72 UTF-8 bytes.');
    const result = await backend(`/auth/${action}`, undefined, { method: 'POST', body: JSON.stringify(body) });
    if (!result.token) throw new HttpError(502, 'Account service returned no session.');
    if (old?.startsWith('demo-')) deleteDemoSession(old);
    return setCookie(NextResponse.json({ ok: true }), result.token, request);
  } catch (e) { return failure(e); }
}

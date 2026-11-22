import { cookies } from 'next/headers';
import { matchesRequestOrigin } from './origin-policy';
import { NextResponse } from 'next/server';
import { demoView } from './demo-session-store';
import { emptyWorkspace, type SessionView } from '../domain/model';
import { HttpError } from './http-error';
export { HttpError } from './http-error';
export function sameOrigin(request: Request) {
  if (!matchesRequestOrigin(request)) throw new HttpError(403, 'Cross-origin request rejected.');
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Cross-site request rejected.');
}
export function failure(error: unknown) {
  return NextResponse.json({ error: error instanceof HttpError ? error.message : 'The service is unavailable. Please retry.' }, { status: error instanceof HttpError ? error.status : 503 });
}
export async function token() { return (await cookies()).get('adhikaar_session')?.value; }
export function isSecureContext(request?: Request): boolean {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  if (!request) return false;
  const proto = request.headers.get('x-forwarded-proto');
  if (proto) return proto.toLowerCase() === 'https';
  try {
    return new URL(request.url).protocol === 'https:';
  } catch {
    return false;
  }
}
export function setCookie(response: NextResponse, value: string, request?: Request) {
  const secure = isSecureContext(request);
  response.cookies.set('adhikaar_session', value, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: value ? 28800 : 0
  });
  for (const name of ['adhikaar_role', 'adhikaar_demo_persona']) response.cookies.set(name, '', { path: '/', maxAge: 0 });
  return response;
}
export async function backend(path: string, sessionToken?: string, init: RequestInit = {}) {
  let res: Response;
  try { res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8080'}/api/v1${path}`, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json', ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), ...init.headers } }); }
  catch { throw new HttpError(503, 'Account service is unavailable. No sign-in or change was completed.'); }
  if (!res.ok) throw new HttpError(res.status === 401 ? 401 : res.status === 409 ? 409 : res.status === 400 ? 400 : 503, res.status === 401 ? 'Please sign in again.' : res.status === 409 ? 'Your workspace changed. Reload and retry.' : res.status === 400 ? 'Check your account details and try again.' : 'Account service is unavailable.');
  return res.json();
}
export async function requireSession(): Promise<{ token: string; view: SessionView }> {
  const t = await token();
  if (!t) throw new HttpError(401, 'Sign in to continue.');
  if (t.startsWith('demo-')) {
    const view = demoView(t); if (!view) throw new HttpError(401, 'Demo expired. Choose Sign in with Demo again.');
    return { token: t, view };
  }
  const [me, saved] = await Promise.all([backend('/auth/me', t), backend('/workspace', t)]);
  return { token: t, view: { role: 'NORMAL_USER', namespace: `account:${me.id}`, personaId: null, revision: saved.revision, workspace: saved.workspace || emptyWorkspace(me.fullName, me.email) } };
}
export async function readLimitedBody(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, 'Request too large.');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array(0);
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) throw new HttpError(413, 'Request too large.');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  const body = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return body;
}
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const text = new TextDecoder().decode(await readLimitedBody(request, 32768));
  try { const body = JSON.parse(text); if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error(); return body; }
  catch { throw new HttpError(400, 'Invalid request.'); }
}

import { failure, HttpError, requireSession, setCookie } from '@/lib/server/session';
export async function GET(request: Request) {
  try { const { view } = await requireSession(); return Response.json(view, { headers: { 'Cache-Control': 'no-store' } }); }
  catch (e) { const response = failure(e); return e instanceof HttpError && e.status === 401 ? setCookie(response, '', request) : response; }
}

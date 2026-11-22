import { failure, HttpError, requireSession } from '@/lib/server/session';
export async function GET() { try { const { view } = await requireSession(); if (view.role !== 'DEMO_USER') throw new HttpError(403, 'Demo required.'); return Response.json(view); } catch(e) { return failure(e); } }

import { NextResponse } from 'next/server';
import { deleteDemoSession } from '@/lib/server/demo-session-store';
import { failure, sameOrigin, setCookie, token } from '@/lib/server/session';
export async function POST(request: Request) { try { sameOrigin(request); const t = await token(); if (t?.startsWith('demo-')) deleteDemoSession(t); else return Response.json({ error: 'Demo session required.' }, { status: 403 }); return setCookie(NextResponse.json({ ok: true }), ''); } catch (e) { return failure(e); } }

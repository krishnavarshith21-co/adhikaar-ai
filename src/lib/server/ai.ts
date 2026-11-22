import { SCHEMES } from '../domain/catalog';
import { HttpError } from './session';
const rateRoot = globalThis as typeof globalThis & { adhikaarRates?: Map<string, number[]> };
const rates = rateRoot.adhikaarRates ??= new Map<string, number[]>();
export function rateLimit(namespace: string) {
 const now = Date.now();
 for (const [key, times] of rates) if (!times.some(t => t > now - 60000)) rates.delete(key);
 const times = (rates.get(namespace) || []).filter(t => t > now - 60000);
 if (times.length >= 12) throw new HttpError(429, 'Please wait a minute before trying again.');
 times.push(now); rates.set(namespace,times);
}
export function apiKey() {
 const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
 if (!key) throw new HttpError(503, 'Live AI is not configured. Set the server-side GEMINI_API_KEY. Text demo responses remain available only in Demo mode.');
 return key;
}
export async function officialDocument(id: string, signal: AbortSignal) {
 const source = SCHEMES.find(s => s.id === id)?.source;
 if (!source) throw new HttpError(400,'Unknown official source.');
 // URL is selected from a server-controlled allowlist; no user or model URL can be fetched.
 const response = await fetch(source.url, { redirect:'error', signal:AbortSignal.any([signal,AbortSignal.timeout(12000)]), headers:{ Accept:'text/html' }, cache:'no-store' });
 if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new HttpError(502,'The official source is unavailable.');
 const reader = response.body?.getReader(); if (!reader) throw new HttpError(502,'The official source is empty.');
 const chunks: Uint8Array[] = []; let total = 0;
 try { while (true) { const { value,done } = await reader.read(); if(done) break; total += value.length; if(total>1500000) throw new HttpError(502,'Official document exceeds retrieval limit.'); chunks.push(value); } } finally { await reader.cancel(); }
 const html = Buffer.concat(chunks).toString('utf8');
 const text = html.replace(/<(script|style|nav|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim().slice(0,24000);
 if (text.length < 300) throw new HttpError(502,'Official source has insufficient readable evidence.');
 return { text, citation:{ ...source, lastChecked:new Date().toISOString().slice(0,10) } };
}

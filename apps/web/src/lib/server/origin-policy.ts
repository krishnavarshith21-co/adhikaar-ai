/**
 * Browser cookie mutations must target their own origin. NextURL normalizes
 * loopback names (127.0.0.1 / [::1]) to localhost, so request.url alone cannot
 * identify the browser-facing authority. Host is browser-controlled by the URL;
 * forwarded-host headers and broad localhost allowlists must not override it.
 */
export function matchesRequestOrigin(request: Pick<Request, 'url' | 'headers'>): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Preserve non-browser clients; Fetch Metadata is checked separately.
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') ?? url.host;
    if (!host || /[\s\\/@?#,]/.test(host)) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const target = new URL(`${url.protocol}//${host}`);
    return origin === target.origin;
  } catch {
    return false;
  }
}

# Demo login origin mismatch — fixed

Verified 22 November 2026 against the production frontend on port 3100.

## Exact cause

`sameOrigin()` in `src/lib/server/session.ts` compared the browser's `Origin` header directly with `new URL(request.url).origin`. Next.js 16.4.6's `NextURL` implementation (`node_modules/next/dist/server/web/next-url.js`, `parseURL`) normalizes loopback names, including `127.0.0.1` and `[::1]`, to `localhost`. Thus a legitimate same-origin request from a 127.0.0.1 page was falsely rejected before demo session creation.

This was the custom Next.js request-origin guard, not Spring Security CORS, a missing CSRF token, the API proxy, or an authentication failure. The `/api/auth/demo` route calls this guard before reading the persona or creating a session. Browser requests already used relative URLs; there was no hardcoded browser-to-Java URL to fix. Earlier HTTP tests omitted `Origin`, so they missed this browser-specific failure; the API test helper now sends browser-style `Origin` and Fetch Metadata headers on every request.

## Browser Network evidence

Captured through Chromium DevTools Protocol's Network domain, including `requestWillBeSentExtraInfo` for the actual browser headers and `getResponseBody` for the response.

| Field | Before | After |
| --- | --- | --- |
| Request | `POST http://127.0.0.1:3100/api/auth/demo` | Same |
| Origin | `http://127.0.0.1:3100` | Same |
| Host | `127.0.0.1:3100` | Same |
| Sec-Fetch-Site | `same-origin` | Same |
| Request body | `{"personaId":"aarohi-rao"}` | Same |
| Status | **403** | **200** |
| Response | `{"error":"Cross-origin request rejected."}` | `ok: true`, `role: DEMO_USER`, `personaId: aarohi-rao`, session profile `Aarohi Rao` |
| Navigation | Stays on `/sign-in`; actual error and Retry displayed | Navigates to `/app` |

`http://localhost:3100` succeeded before and after. Success responses above are summarized to exclude session tokens. Cookies were checked in-browser: `HttpOnly`, `SameSite=Lax`, host scoped, and usable over this local HTTP preview.

Server/log trace: the Next production server was running on port 3100. It returned the handled JSON 403 without an uncaught exception; this build has no per-request production access logger. No Spring request/log entry exists for the rejected request: the origin check returned before any backend invocation, and there was no Java listener on port 8080 during reproduction. The browser Network capture supplies the exact request/status/body evidence; no fabricated backend log is claimed. Server startup showed only the unrelated parent-directory lockfile warning.

## Fix and security boundaries

The origin policy reconstructs the browser-facing authority from the request's actual `Host` header and protocol, rather than the normalized loopback hostname in `request.url`. It validates the authority before parsing, compares the entire origin including port and scheme, and does not trust `X-Forwarded-Host` or a blanket localhost allowlist. Missing-Origin non-browser clients retain their prior behaviour; `Sec-Fetch-Site: cross-site` remains separately rejected.

This does **not** authorize localhost pages to submit to 127.0.0.1 or vice versa. Each host works only with its own same-origin API and cookie jar. Cross-origin POSTs, differing ports/schemes, null origins, malformed hosts and forged forwarded hosts remain blocked. No wildcard credentialed CORS, fake authentication, open access or global security disable was introduced.

Frontend credentials are now explicitly `same-origin` (the existing fetch default). All browser auth/workspace calls continue through Next's `/api/...` backend-for-frontend. Java receives server-side bearer credentials, not browser session cookies. Consequently, browser CORS/preflight never needs to reach Spring for this flow. Spring Security's existing authentication/filter configuration was deliberately left unchanged; adding browser CORS exceptions would not fix the observed rejection. Next's OPTIONS response was checked: 204, with no permissive `Access-Control-Allow-Origin` for a foreign origin.

Use `http://localhost:3000` for development and `http://localhost:3100/sign-in` for the current preview. Stay on the chosen hostname throughout a session. `.env.example` consistently uses `BACKEND_URL=http://localhost:8080`, which is a server-only upstream address. No active `.env.local` or public API-base variable was present in the inspected project. An operator's reverse proxy must preserve the public Host and trusted protocol; caller-supplied forwarded hosts are not accepted as authority.

## Files modified

- `src/lib/server/origin-policy.ts` — strict browser-facing origin comparison.
- `src/lib/server/session.ts` — use the policy while preserving Fetch Metadata rejection.
- `src/lib/auth-context.tsx` — explicit same-origin cookie credentials; authentication behaviour unchanged.
- `.env.example`, `README.md` — consistent localhost setup and cookie-host guidance.
- `tests/origin-policy.test.mjs`, `scripts/test-domain.mjs` — origin regression coverage integrated into `npm test`.
- `tests/api.test.mjs` — send browser headers; test CSRF negatives and preflight behaviour.
- `scripts/qa-demo-login.mjs` — reproducible Chromium browser session/retry verification.
- `docs/DEMO-LOGIN-FIX.md` — this report.

No login markup/styles, architectural assets, Spring source, real-account credentials or authentication rules were changed.

## Verification

- `npm test`: **40 passed**, including 10 origin-policy cases.
- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `QA_BASE_URL=http://127.0.0.1:3100 npm run test:api`: **10 passed**, one real-backend suite skipped because the production preview has no Java database configured.
- `QA_BASE_URL=http://localhost:3100 npm run test:api`: **10 passed**, same explicit skip. These now send actual Origin headers, so the pre-fix build fails this regression.
- `node scripts/qa-demo-login.mjs`: **11 browser checks passed**: valid demo cookie/session and dashboard redirect, refresh, two persona switches, exit and re-entry on both origins; controlled service failure with actual error text and enabled retry. Success always came from the real demo endpoint; only the failure response was injected in the isolated test browser.
- `./backend/mvnw -f backend/pom.xml -Dnet.bytebuddy.experimental=true -Daether.syncContext.named.factory=noop -o test`: **8 passed**, including real-account session/ownership/security integration tests. Java compilation passed as part of this run.

Sanitized browser evidence is in ignored `.qa-artifacts/demo-login/results.json`. The script requires an isolated Chrome CDP session on port 9224. No live AI credentials or real user accounts were involved. The approved hero asset remains unchanged.

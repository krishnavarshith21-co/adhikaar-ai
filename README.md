# ADHIKAAR AI

An independent civic preparation workspace built with Next.js 16, React 19, TypeScript and Spring Boot 3.5 / Java 21+. The approved architectural hero photograph is preserved. The interface uses sapphire `#172943`, ivory `#F7F2E9`, antique gold `#BC9059`, Fraunces and Manrope.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Use `http://localhost:3000` consistently in development. Browser API requests use relative `/api/...` URLs and same-origin cookies; `BACKEND_URL` is a server-to-server address, never a browser API base URL. Do not switch hostnames during a session: localhost and 127.0.0.1 have separate cookie jars. Both hosts work when each session stays on its own origin.

Choose **Sign in with Demo** at `/sign-in` to enter an isolated synthetic workspace. Demo does not require Java, PostgreSQL or an AI key. Aarohi Rao is a 21-year-old Telangana student with annual household income ₹180,000. Ramesh Patil is a Telangana farmer; Sana Khan is a Rajasthan entrepreneur. Switch, reset and exit operate on server-held demo state.

For real accounts, configure `DB_PASSWORD` in your shell and start PostgreSQL and Java:

```sh
docker compose up -d postgres
./backend/mvnw -f backend/pom.xml spring-boot:run
```

Java expects `DB_URL` (default `jdbc:postgresql://localhost:5432/adhikaar`), `DB_USERNAME` (default `adhikaar`) and `DB_PASSWORD`. Alternatively `docker compose up --build` starts both services. Flyway applies V1–V3. The frontend calls Java through the server-only `BACKEND_URL`. It never fabricates a successful login when Java is unavailable.

Production preview:

```sh
npm run build
COOKIE_SECURE=false npm run start -- --hostname localhost --port 3100
```

Open `http://localhost:3100` for this preview.

`COOKIE_SECURE=false` is exclusively for localhost HTTP. Omit it for an HTTPS deployment. The font build fetches the configured Google fonts; build networking must be available on a cold cache.

## Architecture and data boundaries

- `src/lib/domain/catalog.ts`: focused, reviewed catalogue of PM-Vidyalaxmi, Telangana Rythu Bharosa and MUDRA, with source metadata. Preparation checklists are explicitly provisional, not independently verified document mandates.
- `src/lib/domain/demo-fixture.ts`: the sole demo fixture factory. Each persona has its own profile, saved IDs, scheme-scoped document statuses, preparation journeys, illustrative reminders and preferences.
- `src/lib/domain/eligibility.ts`: shared deterministic preliminary criteria used by recommendations, metrics, eligibility and assistant responses. Missing information is distinct from unmet conditions. Approval is never inferred.
- `src/lib/server/demo-session-store.ts`: bounded, expiring in-memory demo sessions, created only by the explicit sign-in endpoint. No bootstrap endpoint creates sessions. Switching namespaces state; reset reconstructs the selected fixture; exit destroys the session.
- `src/lib/auth-context.tsx`: one client workspace state shared across app routes. Mutations include namespace and revision; concurrent or stale updates are rejected. Persona switches/reset remount local forms and conversations.
- Real credentials are checked by Spring Security/BCrypt. Java issues expiring bearer sessions; Next stores them in an HTTP-only cookie. Java derives account identity from the session, never a caller-provided user ID. Real workspaces persist in PostgreSQL with optimistic locking.
- `/dashboard` redirects to `/app`. All authenticated modules use the same state and record-derived counts. Real accounts start empty.

## AI and voice configuration

Set `AI_PROVIDER=gemini` and `GEMINI_API_KEY` in ignored `.env.local` for Gemini (the configured provider), or explicitly select `AI_PROVIDER=openai` with `OPENAI_API_KEY`. Gemini defaults to `gemini-2.5-flash` for text/transcription and `gemini-3.8-flash-tts` through the Interactions API for speech. OpenAI is an explicitly selected alternative, not automatic failover. Do not paste keys into chat or use `NEXT_PUBLIC_` variables. Defaults: `OPENAI_CHAT_MODEL=gpt-4.1-mini`, `OPENAI_TRANSCRIPTION_MODEL=whisper-1`. Ensure your account supports these models; the default `whisper-1` adapter uses `verbose_json` and segment confidence. Supported GPT-4o transcription variants use JSON with token log probabilities. Unsupported model settings return a configuration error.

`/api/assistant/chat` authenticates and rate-limits requests, selects a source from the server-controlled catalogue, retrieves its current HTML without following redirects, and calls the explicitly selected live AI provider. No arbitrary user/model URL is fetched. Names, emails and raw profiles are not sent to the model; only the question, programme, official text and deterministic result are sent. Avoid private identifiers in questions. Source text and questions are treated as untrusted data. Structured model output must contain an exact supporting evidence excerpt; URLs, numeric claims and eligibility decisions cannot overwrite the server-owned fields. Unsupported details return uncertainty. These safeguards reduce risk but do not constitute a proof of factual correctness.

Responses include text, language, source title/URL/authority/last-checked date, next steps, verification status, deterministic eligibility, conditions and preparation documents. Output is buffered until validated; token streaming is intentionally not enabled. Demo chat replies are scripted and labelled; no live chat-generation call is made in demo mode. Speech transcription uses the genuine service when configured.

Voice is **experimental; live language accuracy and physical Safari/iOS tests are not yet verified**. Authenticated real and demo sessions use the same genuine server-side transcription service. Missing credentials return a clear error, never a canned transcript. Capture starts only after permission and MediaRecorder startup, supports dynamically selected WebM/Opus or MP4/AAC, and ends on Stop/Cancel or at 60 seconds. The browser decodes the complete recording and properly resamples it to mono 16 kHz PCM WAV; the server checks its format, duration and signal before forwarding the identical WAV to the configured transcription provider. Quiet/DC/empty clips and low-confidence provider output request a retry. Selected en-IN/hi-IN/te-IN locales map to en/hi/te hints; recordings of 12 seconds or more, or the mixed-language option, omit the forced hint. The transcript stays editable until the user presses Send.

For temporary diagnostics, run `next dev` and open `/app/assistant?speechDebug=1` (or set `NEXT_PUBLIC_SPEECH_DEBUG=true`). The developer-only panel plays both the original recording and exact upload. URLs exist only in browser memory and are revoked on cancel/new recording/unmount. Capture metadata and transcription responses are logged only while this development opt-in is active. Set `SPEECH_DEBUG=true` separately for server-side provider-response logs during development. Neither debug gate works in a production build. The application does not persist audio; The selected provider’s retention policies apply to provider uploads. See [speech pipeline report](docs/SPEECH-PIPELINE.md) for verified checks and the five-phrase test status.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
./backend/mvnw -f backend/pom.xml test
./backend/mvnw -f backend/pom.xml package
```

On this machine's JDK 27, use `-Dnet.bytebuddy.experimental=true`; Java 21 is the intended baseline. The test resource uses Mockito's subclass mock maker. In a restricted read-only Maven cache, `-Daether.syncContext.named.factory=noop -o` can run already-cached tests; packaging may need network access to download plugins.

`npm run test:api` targets `http://localhost:3100` by default. Override `QA_BASE_URL`; set `QA_REAL_BACKEND=1` only against a disposable backend/database. It creates synthetic accounts. Tests expect AI credentials to be absent for the missing-configuration checks. See [QA and implementation report](docs/QA.md) for results and remaining manual checks.

## Deployment limits

Demo state and authentication sessions are process-local and expire after eight hours or server restart. Use one instance per service for this presentation deployment. A production cluster needs shared session storage, distributed rate limiting, TLS, operator-managed database backups/encryption, and operational monitoring. Account workspaces are durable in PostgreSQL; browser conversation history is ephemeral and clears on namespace/reset/logout/full reload. Email recovery is explicitly unavailable until an operator implements a real delivery/recovery service.

This catalogue is intentionally small and the criteria are preliminary. No NGO partnerships, grants, deadlines, application submissions or approval notifications are invented. This is not a government service.

## Audit — 22 November 2026

See [the detailed A–H audit report](docs/AUDIT-2026-11-22.md) for fixes, limitations, the requested 34-step journey, and every original checkbox. No production database was reset or migrated. Browser/API tests used an isolated production build and disposable H2 database; this does not verify PostgreSQL/Flyway deployment.

Additional regression commands (with the audit frontend running at `QA_BASE_URL`, live AI disabled, and a disposable backend):

```sh
QA_BASE_URL=http://localhost:3111 QA_REAL_BACKEND=1 node --test tests/api.test.mjs tests/navigation.test.mjs tests/audit-api.test.mjs
QA_BASE_URL=http://localhost:3111 QA_CDP_URL=http://127.0.0.1:9224 node scripts/audit-browser.mjs
QA_BASE_URL=http://localhost:3111 QA_CDP_URL=http://127.0.0.1:9224 node scripts/audit-browser-extra.mjs
```

Browser scripts require an isolated Chrome debugging profile and must run sequentially; background tabs intentionally pause animation/audio. `ADHIKAAR_BUILD_DIR=.next-audit npm run build` builds without disturbing `.next` development output. The optional `node scripts/audit-live-ai.mjs` makes real, potentially billable provider calls with synthetic text/audio and stops after quota exhaustion. It does not certify microphone accuracy or audible voice quality. See the audit report before using the presentation or pilot readiness claims.
# adhikaar-ai

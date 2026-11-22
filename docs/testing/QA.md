# Implementation and QA report

Reviewed on 22 November 2026. This report distinguishes implemented behaviour, automated checks, browser observations and tests still pending. Live AI and voice service tests were deferred at the user's request; no credentials were supplied.

## Architecture and root causes

The existing project contains a Next.js App Router frontend, React client contexts, Next API adapters, and a Spring Boot/Security/JPA backend with PostgreSQL/Flyway. The landing page, typography and architectural photograph were retained. This was an in-place repair, not a new application.

The principal defects were duplicated demo fixtures and page-local counts, implicit/fallback demo authentication, weak backend session validation, stale persona-dependent client state, disconnected document and eligibility data, placeholder AI/audio behaviour, unsupported verification claims, and inconsistent app navigation/layout. These defects were addressed in logical layers: shared domain records; isolated sessions and account persistence; connected module actions; server AI/voice adapters; presentation and verification.

## Changed-file map

Paths are relative to the repository root. Existing uncommitted user work was preserved; no commit was made.

| Area | Principal files | Result |
| --- | --- | --- |
| Domain | `src/lib/domain/{model,catalog,demo-fixture,eligibility,actions,assistant}.ts` | One fixture factory, deterministic preliminary assessments, actual-record metrics, scoped mutations, localized structured explanations and citation validation |
| Sessions | `src/lib/server/{session,demo-session-store,ai}.ts`, `src/lib/auth-context.tsx`, `src/proxy.ts` | Explicit demo entry; expiring opaque sessions; namespace/revision checks; real backend authentication; bounded requests and AI source retrieval |
| APIs | `src/app/api/auth/`, `src/app/api/demo/`, `src/app/api/session/`, `src/app/api/workspace/`, `src/app/api/assistant/` | Genuine auth/workspace operations, isolated reset/switch/exit, live chat/transcription adapters and honest configuration errors |
| Application | `src/app/app/`, `src/app/dashboard/`, `src/components/{workspace,layout,demo}/` | Unified dashboard, discovery, eligibility, preflight, journeys, saved records, notifications, profile and settings; working navigation and labelled actions |
| Conversation | `src/components/assistant/{conversation,use-voice}.tsx` / `.ts`, `src/app/app/assistant/page.tsx` | Structured chat, source cards, cancellation/retry, transient namespace-scoped history, recording/transcript review and user-initiated browser TTS |
| Presentation | `src/app/globals.css`, `src/components/home/`, `src/app/(auth)/`, `src/app/(public)/`, `src/lib/language-context.tsx` | Shared luxury palette and typography, responsive app shell, focus/reduced-motion rules, honest public claims and explicit unavailable recovery |
| Java | `backend/src/main/java/com/adhikaarai/backend/` | BCrypt login, real session registry, ownership-enforced persistent workspace with optimistic locking, protected legacy endpoints, deterministic rule corrections and no default provider verification |
| Persistence/config | `backend/src/main/resources/db/migration/V2*`, `V3*`, `docker-compose.yml`, `.env.example`, `.gitignore` | Account workspace table, correction of unsupported legacy metadata, localhost service bindings, external database password and ignored build/secret files |
| Tests/docs | `tests/`, `scripts/test-domain.mjs`, `backend/src/test/`, `package.json`, `README.md`, this report | Reproducible domain/API/Java checks and configuration/deployment limitations |

Duplicated frontend/backend demo JSON files were removed; the TypeScript fixture factory is authoritative. The old Java demo implementation and scripted real-assistant endpoint were retired.

## Implemented and checked behaviour

- Demo starts only through the explicit action. Aarohi is a 21-year-old Telangana student with annual household income ₹180,000 and no farmland. Farmer and entrepreneur fixtures have independent profiles, documents, saves, preparation journeys and illustrative alerts.
- Switching preserves only the selected persona's namespace. Reset reconstructs the exact fixture. Exit revokes the session. Two concurrent writes using one revision produce one success and one conflict; stale persona writes are rejected.
- Real accounts start empty. Credentials are checked by Java, records persist under the authenticated account, and logout invalidates the bearer token. Entering demo from a real session revokes that real session without copying its data.
- Dashboard readiness/counts derive from shared records. Documents are keyed by programme and document ID. All readiness is user-reported; journeys describe preparation, never government submission or approval.
- The focused catalogue covers PM-Vidyalaxmi, Telangana Rythu Bharosa and MUDRA with official source metadata. Preparation checklists are provisional and not represented as exhaustive official requirements.
- Actual chat authenticates, retrieves an allowlisted official source and calls a server-side model; model prose cannot replace deterministic eligibility or source URLs. Exact evidence excerpts and unsupported-output guards are checked. Unavailable credentials/sources return errors or uncertainty, never fake live success. Demo replies are labelled samples.
- English, Hindi and Telugu structured demo answers and assistant controls were checked. General application navigation remains primarily English; complete product-wide localization is not claimed.
- Voice implements explicit recording permission, supported MIME selection, timer/stop/cancel, silence/size handling, transcription review and matching-language browser speech playback. It is labelled experimental; no language/device combination is certified.

## Automated results

| Command/check | Result | Scope |
| --- | --- | --- |
| `npm run lint` | Passed | No lint errors or warnings |
| `npm run typecheck` | Passed | TypeScript project |
| `npm test` | 30 passed | Fixture/session isolation, metrics, deterministic eligibility, validation, 16 varied assistant questions, multilingual output, unsupported claims, evidence guards and unsafe URLs |
| `npm run build` | Passed | Production Next.js compilation and route generation |
| `QA_BASE_URL=http://127.0.0.1:3101 QA_REAL_BACKEND=1 npm run test:api` | 14 passed, 0 skipped | Production frontend with disposable real Java/H2 backend; 24 major routes, forged sessions, cross-origin rejection, concurrent/stale mutations, reset/exit, three languages, real registration/login/logout, account persistence and missing AI credentials |
| `./backend/mvnw -f backend/pom.xml -Dnet.bytebuddy.experimental=true -Daether.syncContext.named.factory=noop -o test` | 8 passed | Spring MockMvc/H2 account/session isolation and persistence, optimistic conflicts, retired assistant behaviour and deterministic rules |
| `./backend/mvnw -f backend/pom.xml -Dnet.bytebuddy.experimental=true -DskipTests package` | Passed | Compiled and packaged executable Spring Boot JAR; tests were run separately |

The installed JDK is 27; Byte Buddy's experimental switch and the test-only Mockito subclass mock maker handle that local runtime. Java 21 is the intended baseline. An initial sandboxed Next build failed to bind its worker port; the build succeeded with the required execution permissions. Offline Maven packaging initially lacked cached plugin dependencies; online packaging succeeded. Neither environment issue remains a compilation failure.

The 16 assistant questions exercise deterministic/demo output and validation, **not live model quality**. Automated HTTP route checks verify routing/status, not full visual/accessibility correctness. H2 tests do not establish that PostgreSQL Flyway migrations have been exercised against a real database.

## Browser observations

A Chromium browser session exercised demo entry; student/farmer/entrepreneur switching; edited-profile isolation; reset; preflight document marking; dashboard readiness propagation; and English/Hindi/Telugu sample chat with source cards. Desktop at approximately 1440×1000 and a tablet-width view around 894px were inspected. At 390×844, document/client width both measured 390px, with no horizontal overflow; full mobile visual and virtual-keyboard verification remains pending.

The landing image remains `public/images/landing-archway.jpg`, SHA-256:

```text
3da86f49eeba1a8691d553aa58ac460da5dc7cbe3fbe8e8b87e6dadb72487984
```

Browser tooling became unavailable after those observations. Final copy/category-link changes were checked by lint/typecheck/build, not a repeated browser session. No new final-state screenshots are claimed.

## Remaining validation and operational limits

1. Configure `OPENAI_API_KEY` privately in `.env.local`; run at least 15 live questions across English/Hindi/Telugu. Include conflicting source text, prompt-injection requests, ambiguous profile criteria, unsupported amounts/deadlines and unavailable sources. Confirm source evidence, terminology, uncertainty and useful next steps with human review.
2. On Chromium, desktop Safari and an actual iOS Safari device, test microphone allowed/denied, missing hardware, MP4/WebM selection, silent/empty/oversized input, edited transcript, 60-second stop, interruptions and rapid navigation. Test actual language-specific transcription and TTS playback/pause/resume/replay/stop for all three languages. Check installed voice availability and autoplay restrictions.
3. Exercise offline/slow-network/provider-timeout and recovery paths in the browser, repeated clicks during requests, mobile keyboard opening/closing, landscape/tablet layouts, keyboard-only traversal and screen-reader announcements. Automated checks cover some race/error boundaries; these interactive scenarios remain manual.
4. Verify real signup/login/logout in the final browser UI and test all action routes on mobile; real authentication already passed HTTP and Spring integration tests.
5. Run PostgreSQL with the documented password configuration and validate Flyway V1–V3, durable account data over backend restarts, backups and the deployment's TLS configuration. Local integration used disposable H2, not production data.
6. Chat is buffered until the complete structured result passes validation; token streaming is not implemented. Official sites may reject retrieval; the app reports uncertainty. Evidence checks reduce risk and do not prove every model sentence correct.
7. Demo/session registries and AI rate limiting are process-local. Use a single instance for the presentation; clustered production requires shared sessions/rate limits and operational monitoring. Demo and login sessions expire after eight hours or service restart. Real account workspaces persist in the database.
8. Email password recovery is unavailable until a real recovery/delivery service is configured. No fabricated email, contact information, NGO relationship or application approval is displayed. Conversations clear on full reload, reset, logout or persona namespace change.

No deployment or production readiness certification is claimed. Setup and credential instructions are in `README.md` and `.env.example`.

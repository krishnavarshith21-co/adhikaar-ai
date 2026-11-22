# Speech-to-text pipeline repair

22 November 2026. Implementation and transport verification are complete. A server credential is now configured in ignored `.env.local`, and a live synthetic “Hello” request reached OpenAI. The provider rejected it with **HTTP 429**, code `credit_balance_exhausted`, type `insufficient_quota`. Live recognition accuracy remains **unverified**; no human-spoken recording was supplied. No result below claims that a person spoke a phrase or that a live provider recognized it.

## Root causes found in the actual source

1. `/api/assistant/transcribe` returned a canned scheme question whenever the session was a demo **or** the server key was missing. It selected that question with `audio.size % list.length`. Therefore an uploaded “Hello” could produce an unrelated loan or agriculture question without any speech service being called. This branch and all illustrative transcripts have been removed.
2. `useVoice` started Web Speech Recognition and MediaRecorder concurrently. It retained interim recognition text without checking `isFinal`, delivered it on recognition end, and bypassed the recorded-file upload. The text shown to the user could therefore come from a separate audio path rather than the recording being inspected. That competing recognizer and buffer have been removed.
3. The listening state appeared before microphone permission, recorder construction and audio-context startup finished. A short greeting could begin before capture. Listening now starts only on MediaRecorder's actual `start` event.
4. Byte count alone was used as a silence check. Valid encoded silence is larger than a few hundred bytes. The complete recording now gets decoded and its PCM signal checked on both client and server.

## Repaired data flow

`getUserMedia → supported MediaRecorder container → final Blob → native decodeAudioData → native 16 kHz mono resampling → correctly encoded PCM WAV → same-origin multipart POST → server WAV/PCM validation → OpenAI transcription → confidence validation → editable chat input`.

- MediaRecorder probes `isTypeSupported` and uses its actual reported MIME type. It records one complete container rather than treating partial segments as standalone audio files. Opus/WebM and AAC/MP4 bytes are never relabelled.
- Browser decoding and `OfflineAudioContext` perform genuine resampling/downmixing. The WAV header and sample payload are both mono, 16-bit little-endian PCM at 16,000 Hz. Sample-rate changes do not alter playback speed or pitch.
- The server parses the WAV header, chunk boundaries and PCM samples, checking actual decoded duration and signal. It forwards the **same uploaded bytes** as `recording.wav`, `audio/wav`; OpenAI performs speech recognition on this WAV. The Node route does not pretend to decode AAC/WebM using their MIME label.
- Encoded capture is limited to 8 MB and 60 seconds; normalized PCM is checked again on the server. Empty, corrupt, too-short/long, DC-only and silent clips fail explicitly. The energy check is a conservative heuristic, not a proof that every audible signal contains intelligible speech.
- Both authenticated demo and real sessions use the genuine service. Missing credentials return **503 / NOT_CONFIGURED**, never a transcript. Authentication, namespace checks, same-origin protection and rate limiting remain in place.
- The default service is **OpenAI `/v1/audio/transcriptions`, model `whisper-1`**, with `verbose_json`. Whisper segment no-speech probability, average log probability and compression ratio are checked. Supported GPT-4o transcription variants use JSON and token log probabilities instead; unsupported model settings fail clearly. No expected phrase, scheme vocabulary prompt, translation or placeholder is injected.
- en-IN, hi-IN and te-IN normalize to the provider's en, hi and te hints. Explicit mixed-language detection, or recordings at least 12 seconds long, omit a forced language hint. Automatic detection is provider behaviour; multilingual accuracy remains unverified.
- Only validated provider text reaches the input. Transcription never calls chat Send. Listening → Transcribing → Review transcript is explicit; Retry Recording and Edit Transcript reuse the existing interface styles. The original page design and architectural assets were not redesigned.
- Cancel, new capture, identity/language changes, page hiding and unmount abort requests and release capture tracks. Temporary playback URLs are revoked. Decoder contexts close even if decoding fails. Production code does not save recordings or log recognized text.

## Temporary developer audio playback

Run `npm run dev`, sign in, then open `/app/assistant?speechDebug=1`. Alternatively set `NEXT_PUBLIC_SPEECH_DEBUG=true` for local development. After recording, the developer panel includes two native playback controls:

1. **Exact captured recording** — the original WebM/Opus or MP4/AAC blob.
2. **Exact uploaded audio** — the actual PCM WAV sent to the endpoint.

Compare both before assessing recognition accuracy. The panel shows duration, capture MIME/file size, upload size and sample rate. The developer console logs metadata and the endpoint response. Set `SPEECH_DEBUG=true` separately for the local server to log the provider response. These diagnostics require `NODE_ENV=development`; neither flag nor the query parameter enables them in a production build. They retain audio only in memory until cleanup and do not write audio to application storage. Leave diagnostics off when not testing.

## Actual browser transport results

An isolated Chrome session used a synthetic “Hello” WAV generated by macOS `say`; this was a test fixture, **not a human microphone accuracy test**. No physical microphone was accessed. The audio-service sandbox initially prevented Chrome from reading the fixture; that run correctly produced a silence error with zero uploads. The isolated test browser was restarted with only its audio-service sandbox disabled to read the fixture.

Six browser checks then passed:

- Native MediaRecorder captured `audio/webm;codecs=opus` and the server received valid `audio/wav` named `recording.wav` with the en-IN request hint.
- The sampled WebM capture was 31,208 bytes; normalized upload was 61,484 bytes. Original decoded duration was 1.919977s; upload duration was 1.920000s, mono 16 kHz/16-bit PCM.
- The original and upload playback controls were present in the development page. Their audio was programmatically decoded and duration-checked; no human listening assessment is claimed.
- Missing credentials returned the actual configuration error. The input stayed empty; neither a competing Web Speech recognizer nor an automatic AI chat request ran.
- Native `audio/mp4` capture was also forced **only after this Chrome reported actual support**; it decoded and uploaded successfully. This verifies the MP4/AAC pipeline in Chromium, not Safari certification.
- Stop/retry/cancel released tracks. Cancel did not upload and removed developer playback URLs.

Machine-readable metadata is in ignored `.qa-artifacts/speech/browser.json`. The synthetic source fixture was kept only in `/tmp` for QA. No user audio was persisted.

## Live credential verification follow-up

The running app at `http://localhost:3000` successfully created an isolated demo session (`POST /api/auth/demo`, HTTP 200). A synthetic English “Hello” WAV was then uploaded to `POST /api/assistant/transcribe` with the same-origin header, session cookie, namespace and en-IN hint. Before this follow-up fix, the app returned HTTP 502 / `PROVIDER_UNAVAILABLE`. A direct diagnostic request using the configured server credential confirmed OpenAI HTTP 429 / `credit_balance_exhausted` / `insufficient_quota`; no credential or raw provider error message was printed.

The adapter now distinguishes exhausted API credit from a temporary rate limit, returning HTTP 503 / `PROVIDER_QUOTA_EXHAUSTED` with a billing/quota explanation. After rebuilding and restarting port 3000, the same synthetic upload confirmed this exact HTTP 503 response; demo login still returned 200. Non-secret results are saved in ignored `.qa-artifacts/speech/live-quota.json`. The existing chat error UI displays this message without a redesign. Raw provider errors are never returned. A regression test covers both quota codes and the type-only response, verifies sensitive upstream detail is omitted, and ensures a temporary rate limit is not misreported as exhausted credit. All 17 speech tests, lint, type checking and the production build passed again for this follow-up.

Restore the API account's credit/quota before attempting the remaining live tests. Repeating recordings cannot resolve the current account-level rejection. The configured key was exposed in chat and should be rotated, with the replacement stored only in `.env.local`.

## Requested five-phrase results

| Phrase | Selected locale | Adapter/response test | Actual spoken/live-provider result |
| --- | --- | --- | --- |
| Hello | en-IN | Passed: en hint, exact returned text preserved | Synthetic live attempt blocked by provider HTTP 429; no transcript |
| How are you? | en-IN | Passed: en hint, exact returned text preserved | Not run — provider account quota exhausted; human recording pending |
| I need a scholarship | en-IN | Passed: en hint, exact returned text preserved | Not run — provider account quota exhausted; human recording pending |
| नमस्ते | hi-IN | Passed: hi hint, Unicode text preserved | Not run — provider account quota exhausted; human recording pending |
| నమస్కారం | te-IN | Passed: te hint, Unicode text preserved | Not run — provider account quota exhausted; human recording pending |

The five adapter tests use controlled provider responses to validate transport, language configuration and unchanged output. They are **not speech-recognition benchmarks**. To complete actual accuracy verification, restore API account credit/quota, replace the exposed credential privately in ignored `.env.local`, restart the server, speak each phrase, listen to both developer recordings, and compare the resulting transcript. Repeat with Safari/iOS and Chromium. Confidence thresholds reduce false output; they cannot guarantee every accepted word is correct.

## Checks and modified files

- `npm run test:speech`: **17 passed** — formats, PCM fidelity/duration, silence/DC/corrupt audio, five phrase passthrough cases, locale mapping, automatic detection, missing credentials, provider failure, low confidence and production logging prohibition.
- `node scripts/qa-speech-pipeline.mjs`: **6 browser transport checks passed** against the development server with synthetic input; requires isolated Chrome CDP port 9225 and a readable fake-audio fixture.
- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Full `npm test`: **52 passed / 4 failed**. The four existing non-speech tests expect zero citations for an unrecognized scheme, while the current `baseAnswer` fallback returns three catalogue sources. That chat behaviour and those assertions were left unchanged; no tests were weakened to make speech verification appear successful.
- Production browser smoke: **3 checks passed** — real capture/upload, honest missing-key error with no automatic Send, and no developer playback even with `speechDebug=1`; tracks were released.
- Actual Safari/iOS devices were not tested. A live OpenAI request was attempted but rejected for exhausted quota; no live recognition result was obtained. Next's development instant-navigation checker also reports the existing client/session-gated assistant segment as unrendered; the page loads and production compilation succeeds.

Files: `src/components/assistant/use-voice.ts`; new `recording-review.tsx`; `src/app/app/assistant/page.tsx`; `src/components/assistant/floating-chat.tsx`; `src/app/api/assistant/transcribe/route.ts`; new `src/lib/domain/speech-audio.ts` and `src/lib/server/transcription.ts`; localized speech-control labels in `src/lib/domain/assistant.ts`; `.env.example`; `README.md`; `package.json`; `scripts/test-domain.mjs`; new `tests/speech.test.mjs` and `scripts/qa-speech-pipeline.mjs`; this report. The existing `scripts/verify-voice-chat.js` imports were converted to ES modules to remove its four lint errors; its test behaviour was not changed.

References: [OpenAI transcription API](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create), [OpenAI speech-to-text guide](https://developers.openai.com/api/docs/guides/speech-to-text), [MediaRecorder MIME type](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/mimeType).

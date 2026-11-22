# Automated Testing & Verification Guide

ADHIKAAR AI enforces a strict multi-tier testing pipeline.

## Test Commands

```bash
# Run domain rule & audio resampling tests (67 tests)
npm test

# Run API integration tests
npm run test:api

# Run Next.js proxy & navigation tests
npm run test:nav

# Run TypeScript compilation check
npm run typecheck

# Run ESLint analysis
npm run lint

# Run Spring Boot JUnit test suite
npm run test:backend
```

## Coverage Areas
1. **Domain Engine**: Deterministic rules evaluation, persona fixture consistency, CSRF token validation.
2. **Audio Processing**: Web Audio resampling to mono 16 kHz PCM WAV, signal validation, DC bias detection.
3. **API & Sessions**: HttpOnly cookie sessions, bounded demo session memory, optimistic concurrency control.
4. **Navigation**: Proxy redirects, sidebar routing, persona switching.

# @adhikaar/shared

Shared schemas, constants, and contracts for ADHIKAAR AI.

## Purpose

This package documents and houses domain models and schemas shared between:
- **`apps/web`**: Next.js 16 frontend edge and SSR application
- **`apps/api`**: Java Spring Boot 3.5 REST backend

## Shared Contracts
- **Citizen Workspace**: Profile attributes, saved schemes, application journeys, and document statuses.
- **Eligibility Engine Rules**: Criteria types (`INCOME_CEILING`, `LAND_LIMIT`, `MIN_AGE`, `ENROLLED_COURSE`) and verification status codes.
- **Preflight Checklists**: Document status codes (`NOT_STARTED`, `IN_PROGRESS`, `READY`, `BLOCKED`).
- **REST Endpoints**: `/api/v1/auth`, `/api/v1/workspace`, `/api/v1/schemes`, `/api/v1/eligibility`, `/api/v1/preflight`.

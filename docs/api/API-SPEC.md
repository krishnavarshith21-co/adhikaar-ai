# REST API Specification

This document details the upstream REST API exposed by `apps/api` (Spring Boot) and consumed by `apps/web`.

## Base URL
- Development: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Endpoints

### 1. Authentication (`/api/v1/auth`)
- `POST /register`: Registers a new user account.
- `POST /login`: Validates credentials and returns an expiring bearer token.
- `POST /logout`: Invalidates the active session token.

### 2. Citizen Workspace (`/api/v1/workspace`)
- `GET /`: Retrieves the authenticated citizen workspace (profile, journeys, saved schemes, notifications).
- `POST /action`: Dispatches workspace state mutations (`PROFILE`, `SAVE`, `DOCUMENT`, `JOURNEY_STEP`) with optimistic version concurrency checks.

### 3. Scheme Catalogue (`/api/v1/schemes`)
- `GET /`: Lists all verified public schemes with categories and issuing authority metadata.
- `GET /{id}`: Returns complete scheme details, eligibility clauses, and document requirements.

### 4. Eligibility Assessment (`/api/v1/eligibility`)
- `POST /assess`: Executes pure deterministic eligibility rules evaluation against user profile attributes.

### 5. Application Preflight (`/api/v1/preflight`)
- `GET /{schemeId}`: Returns the tailored document audit checklist and readiness status.
- `PUT /{schemeId}/document/{documentId}`: Updates document readiness status (`NOT_STARTED`, `IN_PROGRESS`, `READY`, `BLOCKED`).

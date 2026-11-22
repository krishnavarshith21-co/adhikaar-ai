# Developer Setup & Configuration Guide

This guide walks through configuring and developing on ADHIKAAR AI.

## Prerequisites
- **Node.js**: v20+ or v22+
- **npm**: v10+
- **Java**: OpenJDK 21+
- **Docker & Docker Compose**: For local PostgreSQL container

## Workspace Layout
```text
codebenders/
├── apps/
│   ├── web/     # Next.js 16 Web Application
│   └── api/     # Spring Boot 3.5 API
├── packages/    # Shared libraries & contracts
├── infra/       # Docker & Database infra
├── docs/        # Technical documentation
└── scripts/     # Convenience helper scripts
```

## Running the Application

### 1. Standalone Demo Mode (Frontend Only)
Zero external dependencies required. Does not require Java or PostgreSQL.
```bash
npm install
npm run dev
```
Open `http://localhost:3000` and click "Sign in with Demo".

### 2. Full-Stack Enterprise Mode
```bash
# Terminal 1: Start PostgreSQL
docker compose up -d postgres

# Terminal 2: Run Spring Boot backend
export DB_PASSWORD=adhikaar_password
npm run dev:backend

# Terminal 3: Run Next.js frontend
npm run dev
```

## Environment Configuration
Copy `.env.example` to `apps/web/.env.local`. Set `AI_PROVIDER=gemini` and add your `GEMINI_API_KEY`.
Never prefix secret keys with `NEXT_PUBLIC_`.

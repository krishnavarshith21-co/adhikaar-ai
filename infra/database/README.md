# Database Infrastructure & Migrations

This directory documents the PostgreSQL database topology and Flyway schema evolution for ADHIKAAR AI.

## Topology
- **Production / Dev**: PostgreSQL 16 (Alpine-based container, port 5432)
- **Integration Tests**: In-memory H2 database (`jdbc:h2:mem:adhikaar_test`)

## Flyway Migrations
The executable migration scripts reside in `apps/api/src/main/resources/db/migration/`:
- `V1__init_schema.sql`: Core schema initialization (users, profiles, schemes, categories, eligibility rules, document requirements, application journeys).
- `V2__citizen_workspace.sql`: Optimistic concurrency lock column (`version`) for workspace synchronization.
- `V3__remove_unverified_defaults.sql`: Cleans unverified mock defaults and enforces strict data validity.

## Running Migrations
Migrations are applied automatically by Spring Boot on application startup when `spring.flyway.enabled: true` is configured in `apps/api/src/main/resources/application.yml`.

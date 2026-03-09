# PR Implementation Notes

Use this file to keep a short changelog of what each PR implements.

## How to use

For each new PR, add a new section with:
- PR title or branch
- Date
- What was implemented
- Why it was needed
- Follow-ups (optional)

## Entry Template

```md
## PR: <title or branch>
Date: <YYYY-MM-DD>

### Implemented
- ...

### Why
- ...

### Follow-ups
- ... (optional)
```

## PR: Add Spotless + per-service CI checks (`feat/add-spotless`)
Date: 2026-03-09

### Implemented
- Added Spotless formatting checks across all Java services/modules.
- Added CI workflow checks per service for:
  - `./gradlew :apps:<service>:assemble`
  - `./gradlew :apps:<service>:spotlessCheck`
- Current services covered in CI:
  - `order-api`
  - `orderbook-worker`
  - `query-api`

### Why
- Enforce consistent Java formatting and prevent style drift across services.
- Ensure each service is buildable and formatting-compliant on every PR

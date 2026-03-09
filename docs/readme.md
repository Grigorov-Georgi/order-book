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
- Ensure each service is buildable and formatting-compliant on every PR.

## PR: Add frontend OXlint check (`feat/add-oxlint`)
Date: 2026-03-09

### Implemented
- Added `oxlint` to `apps/order-web` and made it the default frontend lint command (`npm run lint`).
- Removed the previous ESLint setup from the frontend app.
- Added a dedicated `order-web` CI job that runs `npm ci` and `npm run lint`.
- Included the frontend lint job in the final `pr-checks` aggregate status.

### Why
- Add a fast frontend lint check to PR validation.
- Keep the CI gate aligned with the frontend linting tool actually used in the app.

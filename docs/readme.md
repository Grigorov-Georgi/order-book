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
- Updated GitHub Actions Java runtime from JDK 22 to JDK 21 to keep Gradle execution stable with wrapper `8.7`.

### Why
- Enforce consistent Java formatting and prevent style drift across services.
- Ensure each service is buildable and formatting-compliant on every PR.
- Fix CI instability (`Unsupported class file major version 66`) caused by running Gradle `8.7` on JDK 22.

### Follow-ups
- If you want CI runtime on Java 22, upgrade Gradle wrapper to a version with full Java 22 runtime support.

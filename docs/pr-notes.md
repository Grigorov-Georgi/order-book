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

## PR: Move local Kafka topic provisioning to Terraform and centralize topic names
Date: 2026-03-12

### Implemented
- Added local Terraform configuration under `infra/terraform` to manage Kafka topics instead of relying on broker auto-creation.
- Added a local bootstrap flow in `scripts/local-dev/bootstrap-local.sh` that:
  - builds the local Docker image for `order-api`
  - starts Kafka first
  - waits for the broker listener used by Terraform
  - applies the Terraform topic definitions
  - starts the remaining local services
- Added `scripts/local-dev/build-local-images.sh` so local image builds can be run independently from the full bootstrap flow.
- Disabled Kafka auto-topic creation in `infra/docker-compose.local.yml` so topic creation happens explicitly through Terraform.
- Added `io.orderable.common.kafka.KafkaTopics` in `libs:common` to centralize shared topic names and updated `order-api` to use that constant as the default topic name.
- Added `libs:common` as a dependency of `query-api` so the shared Kafka topic contract is available to other services as they adopt it.
- Updated the root `README.md` so local development documents the bootstrap script as the required startup path and lists Terraform as a prerequisite.

### Why
- Kafka topic lifecycle belongs to infrastructure configuration more than application startup code.
- Explicit topic provisioning is more predictable than relying on broker auto-create behavior.
- Shared topic names reduce hardcoded strings across services and lower the chance of naming drift.
- Bootstrapping Kafka and Terraform before the rest of the stack makes local startup closer to the intended production model.

### Follow-ups
- Extend `infra/terraform/variables.tf` with retry, DLQ, and worker topics as those flows are implemented.
- Move all producer and consumer topic references in other services to `KafkaTopics`.
- Commit `.terraform.lock.hcl` once Terraform has initialized locally so provider resolution is reproducible.

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

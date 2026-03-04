# Frontend Requirements

This file captures frontend requirements that will guide implementation.

## API Requirements

- Include `X-Idempotency-Key` in relevant write requests to support request deduplication.
- Treat `X-User-Id` as gateway-managed identity (`Auth0 sub`); frontend must not rely on setting it manually.

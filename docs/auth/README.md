# Authentication and Authorization in This Microservices Setup

This document describes the recommended auth model for this architecture:

- keep authentication at the edge
- keep business authorization in domain services
- secure internal traffic with service identity
- secure Kafka with ACLs and carry actor/account claims in messages

This gives you centralized identity verification and decentralized policy enforcement.

## Why This Model

A single gateway-only enforcement point is not enough because domain rules live inside services.
A service-only model is also not ideal because you lose centralized controls (TLS termination, token validation offload, rate limits).

Use both:

1. Edge layer for identity verification and coarse controls.
2. Service layer for business authorization.

## 1) Ingress/API Gateway: Authentication + Coarse Controls

The gateway should be responsible for:

- TLS termination and certificate management.
- JWT/OAuth token validation (signature, issuer, audience, expiration, not-before).
- Coarse route/scope checks (for example: `orders:write` required for order endpoints).
- Rate limits and abuse controls (per user/client/IP).
- Request size and basic protocol protections.

After successful validation, the gateway forwards trusted identity context to downstream services, for example:

- subject/user id
- tenant id
- scopes/roles
- request/correlation id

Important:

- Gateway checks are necessary but not sufficient for domain security.
- Downstream services must still validate authorization decisions for business actions.

## 2) Order API and Query API: Domain Authorization

`Order API` and `Query API` must enforce business rules that the gateway cannot fully know.

Typical checks in `Order API`:

- Account ownership: user can place/cancel only for allowed accounts.
- Action-level permissions: cancel vs place vs replace permissions.
- Tenant boundaries: account and symbol belong to the caller's tenant.
- Payload consistency: reject when token identity and payload identity conflict.

Typical checks in `Query API`:

- Read permissions for account/order/trade data.
- Tenant isolation for all query filters.
- Field-level restrictions if certain roles should not see full details.

Rules of thumb:

- Never trust client-supplied `accountId` without verifying against token claims and server-side mappings.
- Treat gateway headers as trusted only if traffic is strictly internal from gateway to service.
- Log authorization decisions with request id and actor/account context.

## 3) Internal Service-to-Service Calls: Service Identity

Internal traffic should not rely on end-user identity alone.

Use service identity with one or both:

- mTLS between services (workload identity via certificates).
- Service JWTs/tokens issued for machine identities.

Recommended policy:

- Each service gets its own principal.
- Allow only required calls (least privilege).
- Distinguish user context from service context.
- Prevent arbitrary user impersonation across service boundaries.

Practical pattern:

- Propagate user context as explicit fields (`actorId`, `tenantId`, scopes) for audit and policy.
- Authenticate the calling service separately.
- Authorize based on both service identity and user context when needed.

## 4) Kafka Security: ACLs + Claims in Payload

Kafka should be protected at transport and authorization layers:

- Use TLS/SASL as appropriate.
- Define ACLs per topic and principal.
- Grant minimal rights (produce/consume only where required).

Example of least-privilege intent:

- `Order API`: can produce to `orders`, cannot consume from it.
- `Orderbook Workers`: can consume `orders`, produce `order-events`.
- `Read Model Builder`: can consume `order-events`.

In command/event payloads, include immutable identity context for audit and checks:

- `actorId` (who initiated action)
- `accountId`
- `tenantId`
- `authTime` or token issue time
- `requestId` / `correlationId`
- optional `scopes` snapshot if needed for traceability

Why include claims in payload:

- Enables downstream authorization and audit without depending on HTTP headers.
- Preserves identity trail through async processing.
- Supports compliance and incident investigations.

## Suggested End-to-End Flow

1. Client sends request with OAuth/JWT to gateway.
2. Gateway validates token, rate limits, and coarse scope.
3. Gateway forwards request + trusted identity context to `Order API` or `Query API`.
4. Service performs domain authorization (ownership, tenant, permission checks).
5. `Order API` publishes command to Kafka with actor/account/tenant claims.
6. Workers process command under Kafka ACL constraints and emit events with traceable context.
7. Query side serves read requests with tenant-safe filtering and authorization checks.

## Implementation Checklist

- Gateway token validation is strict (issuer/audience/signature/expiry).
- Gateway route-to-scope mapping is defined and tested.
- `Order API` and `Query API` implement domain auth middleware/policies.
- Internal service calls use mTLS and/or service tokens.
- Kafka ACLs are configured by service principal and topic.
- Command/event schemas include identity and correlation metadata.
- Audit logs capture auth decisions and denial reasons.
- Tests cover cross-tenant access attempts and impersonation attempts.

## Final Guidance

Do not merge services only to centralize authorization.
Keep authN centralized at the edge, but keep authZ close to business logic in each service.
Use service identity internally and Kafka ACLs at the event layer.

This layered model matches your architecture and scales better as services and teams grow.

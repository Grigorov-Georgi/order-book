# Order Book

This project is based on the article: [5 Proven Techniques for Ultra-Fast Low-Latency Trading Systems in Java](https://itnext.io/5-proven-techniques-for-ultra-fast-low-latency-trading-systems-in-java-c0837958ecd8)

## Architecture

See [Architecture Documentation](docs/architecture/README.md) for detailed architecture diagrams and workflow documentation.

## Spring Cloud Components

### Spring Cloud Circuit Breaker (Resilience4j)
- **Useful for**: Redis calls, DB queries, external API calls
- **Purpose**: Prevents cascading failures in a low-latency system
- **Verdict**: Use for external dependencies (Redis, PostgreSQL)

### Spring Cloud Sleuth / Micrometer Tracing
- **Useful for**: Distributed tracing across Kafka boundaries
- **Purpose**: Provides observability across services
- **Integration**: Works with Zipkin/Jaeger
- **Verdict**: Use for observability

## Backlog

### OrderAPI [P0]
- [X] Buy/Sell Endpoints
- [ ] Use Redis for Deduplication
- [ ] Send Kafka Messages
- [ ] Dockerize
- [ ] Readiness/Liveness probes

### QueryAPI [P0]
- [ ] Read Endpoint
- [ ] Fetch Data from PostgreSQL Read Replica
- [ ] Dockerize
- [ ] Readiness/Liveness probes

### Worker [P0]
- [ ] Receive Kafka Messages
- [ ] Check Sender Balance
- [ ] Send Order Message to Worker Kafka Q
- [ ] Snapshot (not sure for this one)
- [ ] Dockerize
- [ ] Readiness/Liveness probes

### Libs [P0]
- [ ] Add common classes
- [ ] JPMS

### Kafka [P0]
- [ ] Infra
- [ ] OrderAPI Main Q
- [ ] OrderAPI Retry Q
- [ ] OrderAPI DLQ
- [ ] Worker Main Q
- [ ] Worker Retry Q
- [ ] Worker DLQ

### Redis [P0]
- [ ] Infra

### PostgreSQL [P0]
- [ ] Infra (Read & Write Replicas)
- [ ] Persist Data from Worker Kafka Q

### CI/CD [P1]
- [ ] Make Script
- [ ] Spotless
- [ ] CI pipeline (build, test, lint, security scan)
- [ ] Docker image build/publish

### Authentication & Authorization [P2]
- [ ] Entry point
- [ ] OrderAPI
- [ ] QueryAPI
- [ ] Service-to-Service
- [ ] Protect Kafka
- [ ] Protect Redis
- [ ] Protect PostgreSQL

### K8S  [P2]
- [ ] Build Dev 
- [ ] Build Prod

### Resilience [P2]
- [ ] Spring Cloud Circuit Breaker (Resilience4j) for Redis/DB calls

### Monitoring [P3]
- [ ] Spring Cloud Sleuth / Micrometer Tracing
- [ ] Logs Collection from my Workers
- [ ] Logs Collection from PostgreSQL
- [ ] Logs Collection from Kafka (mainly target -> DLQ)
- [ ] Prometheus & Grafana

### Generic [P3]
- [ ] Swagger
- [ ] Seed scripts

### Testing [P4]
- [ ] Unit/Integration where needed
- [ ] E2E
- [ ] Performance/latency benchmarks
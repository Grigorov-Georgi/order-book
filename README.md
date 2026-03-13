# Order Book

This project is based on the article: [5 Proven Techniques for Ultra-Fast Low-Latency Trading Systems in Java](https://itnext.io/5-proven-techniques-for-ultra-fast-low-latency-trading-systems-in-java-c0837958ecd8)

## Architecture

See [Architecture Documentation](docs/architecture/README.md) for detailed architecture diagrams and workflow documentation.

## Local Development

Prerequisites:

- Docker with `docker compose` or `docker-compose`
- Terraform installed locally
- Java 22

### Formatting

Format a single service or library:

```bash
./gradlew :apps:order-api:spotlessCheck
./gradlew :apps:order-api:spotlessApply
```

Format the whole Gradle repo:

```bash
./gradlew spotlessCheck
./gradlew spotlessApply
```

1. Start local services with the bootstrap script. Do not run `docker-compose -f infra/docker-compose.local.yml up` directly, because the bootstrap flow builds the local service images first and then provisions Kafka topics through Terraform:

```bash
./scripts/local-dev/bootstrap-local.sh
```

If you only want to rebuild the local service images without starting the stack:

```bash
./scripts/local-dev/build-local-images.sh
```

2. Access local apps:
- FE: [http://localhost:5173/](http://localhost:5173/)
- Kafdrop: [http://localhost:9000](http://localhost:9000)

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
- [X] Send Kafka Messages
- [X] Handle Kafka retries
- [X] Dockerize
- [ ] Readiness/Liveness probes

### FE [P0]
- [X] Vibe code it
- [ ] Make it faster, because it's extriemly slow

### QueryAPI [P0]
- [ ] Read Endpoint
- [ ] Fetch Data from PostgreSQL Read Replica
- [ ] Dockerize
- [ ] Readiness/Liveness probes

### Worker [P0]
- [ ] Receive Kafka Messages
- [ ] Implement DLQ
- [ ] Handle Kafka retries
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
- [X] OrderAPI Main Q
- [ ] OrderAPI Retry Q
- [ ] OrderAPI DLQ
- [ ] Worker Main Q
- [ ] Worker Retry Q
- [ ] Worker DLQ
- [ ] Log Aggregation + ElasticSearch and Kibana

### Redis [P0]
- [ ] Infra

### PostgreSQL [P0]
- [ ] Infra (Read & Write Replicas)
- [ ] Persist Data from Worker Kafka Q

### CI/CD [P1]
- [X] Make Script
- [X] Spotless
- [X] CI pipeline (build, test, lint, security scan)
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
- [ ] Use config server because the configurations for all of the services would be almost identical

### Testing [P4]
- [ ] Unit/Integration where needed
- [ ] E2E
- [ ] Performance/latency benchmarks

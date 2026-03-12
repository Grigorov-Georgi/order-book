#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infra/docker-compose.local.yml"
TERRAFORM_DIR="${REPO_ROOT}/infra/terraform"
BUILD_IMAGES_SCRIPT="${SCRIPT_DIR}/build-local-images.sh"
KAFKA_CONTAINER="order-book-kafka"
KAFKA_HEALTHCHECK_BOOTSTRAP_SERVER="localhost:29092"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD=(docker-compose)
else
  echo "Neither 'docker compose' nor 'docker-compose' is available." >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "'terraform' is required to provision Kafka topics." >&2
  exit 1
fi

echo "Building local service images..."
"${BUILD_IMAGES_SCRIPT}"

echo "Starting Kafka first from ${COMPOSE_FILE}..."
"${DOCKER_COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" up -d kafka

echo "Waiting for Kafka broker to become ready..."
for attempt in $(seq 1 30); do
  if docker exec "${KAFKA_CONTAINER}" kafka-topics --bootstrap-server "${KAFKA_HEALTHCHECK_BOOTSTRAP_SERVER}" --list >/dev/null 2>&1; then
    echo "Kafka broker is ready."
    break
  fi

  if [[ "${attempt}" -eq 30 ]]; then
    echo "Kafka broker did not become ready after 30 attempts." >&2
    exit 1
  fi

  sleep 2
done

echo "Applying Terraform topic configuration from ${TERRAFORM_DIR}..."
terraform -chdir="${TERRAFORM_DIR}" init
terraform -chdir="${TERRAFORM_DIR}" apply -auto-approve

echo "Starting the remaining local services..."
"${DOCKER_COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" up -d

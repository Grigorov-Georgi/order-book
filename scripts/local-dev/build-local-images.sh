#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "'docker' is required to build local service images." >&2
  exit 1
fi

echo "Building local Docker images for dockerized services..."
"${REPO_ROOT}/gradlew" apps:order-api:jibDockerBuild --no-daemon

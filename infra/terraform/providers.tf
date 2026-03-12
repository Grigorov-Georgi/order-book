provider "kafka" {
  bootstrap_servers = [var.kafka_bootstrap_server]
  tls_enabled       = false
}

variable "kafka_bootstrap_server" {
  description = "Kafka bootstrap server Terraform uses to provision topics."
  type        = string
  default     = "localhost:29092"
}

variable "kafka_topics" {
  description = "Kafka topics managed by Terraform for local development."
  type = map(object({
    partitions         = number
    replication_factor = number
    config             = map(string)
  }))
  default = {
    orders = {
      partitions         = 1
      replication_factor = 1
      config             = {}
    }
  }
}

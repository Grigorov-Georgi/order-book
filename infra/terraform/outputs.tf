output "managed_topic_names" {
  description = "Kafka topics created by Terraform."
  value       = sort(keys(kafka_topic.topics))
}

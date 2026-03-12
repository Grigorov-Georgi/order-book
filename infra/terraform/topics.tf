resource "kafka_topic" "topics" {
  for_each = var.kafka_topics

  name               = each.key
  partitions         = each.value.partitions
  replication_factor = each.value.replication_factor
  config             = each.value.config
}

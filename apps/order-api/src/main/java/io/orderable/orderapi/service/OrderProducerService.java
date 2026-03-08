package io.orderable.orderapi.service;

import io.orderable.contracts.proto.OrderCommand;
import io.orderable.orderapi.dto.CreateOrderRequest;
import io.orderable.orderapi.dto.OrderType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
public class OrderProducerService {
    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final String ordersTopic;
    private final long sendTimeoutMs;

    public OrderProducerService(
            KafkaTemplate<String, byte[]> kafkaTemplate,
            @Value("${app.kafka.orders-topic:orders}") String ordersTopic,
            @Value("${app.kafka.send-timeout-ms:5000}") long sendTimeoutMs) {
        this.kafkaTemplate = kafkaTemplate;
        this.ordersTopic = ordersTopic;
        this.sendTimeoutMs = sendTimeoutMs;
    }

    public void sendOrder(CreateOrderRequest createOrderRequest) {
        Objects.requireNonNull(createOrderRequest, "createOrderRequest cannot be null");
        Objects.requireNonNull(createOrderRequest.getSymbol(), "symbol cannot be null");
        Objects.requireNonNull(createOrderRequest.getPrice(), "price cannot be null");
        Objects.requireNonNull(createOrderRequest.getQuantity(), "quantity cannot be null");
        Objects.requireNonNull(createOrderRequest.getType(), "type cannot be null");

        OrderCommand message = OrderCommand.newBuilder()
                .setSymbol(createOrderRequest.getSymbol())
                .setPrice(createOrderRequest.getPrice().toPlainString())
                .setQuantity(createOrderRequest.getQuantity().toPlainString())
                .setType(toProtoOrderType(createOrderRequest.getType()))
                .build();

        try {
            kafkaTemplate.send(ordersTopic, createOrderRequest.getSymbol(), message.toByteArray())
                    .get(sendTimeoutMs, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Kafka send interrupted", e);
        } catch (Exception e) {
            throw new IllegalStateException("Kafka send failed after retries", e);
        }
    }

    private io.orderable.contracts.proto.OrderType toProtoOrderType(OrderType orderType) {
        return switch (orderType) {
            case BUY -> io.orderable.contracts.proto.OrderType.ORDER_TYPE_BUY;
            case SELL -> io.orderable.contracts.proto.OrderType.ORDER_TYPE_SELL;
        };
    }
}

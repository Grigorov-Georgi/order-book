package io.orderable.orderapi.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@AllArgsConstructor
public class CreateOrderRequest {
    private String symbol;
    private BigDecimal price;
    private BigDecimal quantity;
    private OrderType type;
}

package io.orderable.orderapi.controller;

import io.orderable.orderapi.auth.UserIdentityMapper;
import io.orderable.orderapi.dto.CreateOrderRequest;
import io.orderable.orderapi.dto.OrderType;
import io.orderable.orderapi.service.OrderProducerService;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/orders")
public class OrderController {
  private final UserIdentityMapper userIdentityMapper;
  private final OrderProducerService orderProducerService;

  public OrderController(
      UserIdentityMapper userIdentityMapper, OrderProducerService orderProducerService) {
    this.userIdentityMapper = userIdentityMapper;
    this.orderProducerService = orderProducerService;
  }

  @PostMapping("/buy")
  ResponseEntity<String> buyOrder(
      @RequestBody CreateOrderRequest createOrderRequest,
      @RequestHeader(name = "X-Idempotency-Key", required = true) String idempotencyKey,
      @RequestHeader(name = "X-User-Id", required = true) String authSub) {

    String externalUserKey = userIdentityMapper.toExternalUserKey(authSub);
    UUID internalUserId = userIdentityMapper.toInternalUserId(authSub);

    createOrderRequest.setType(OrderType.BUY);
    orderProducerService.sendOrder(createOrderRequest);
    log.info(
        "buy order request: {}, externalUserKey={}, internalUserId={}",
        createOrderRequest,
        externalUserKey,
        internalUserId);

    return ResponseEntity.status(HttpStatusCode.valueOf(200)).body("buy order requested");
  }

  @PostMapping("/sell")
  ResponseEntity<String> sellOrder(
      @RequestBody CreateOrderRequest createOrderRequest,
      @RequestHeader(name = "X-Idempotency-Key", required = true) String idempotencyKey,
      @RequestHeader(name = "X-User-Id", required = true) String authSub) {

    String externalUserKey = userIdentityMapper.toExternalUserKey(authSub);
    UUID internalUserId = userIdentityMapper.toInternalUserId(authSub);

    createOrderRequest.setType(OrderType.SELL);
    orderProducerService.sendOrder(createOrderRequest);
    log.info(
        "sell order request: {}, externalUserKey={}, internalUserId={}",
        createOrderRequest,
        externalUserKey,
        internalUserId);

    return ResponseEntity.status(HttpStatusCode.valueOf(200)).body("sell order requested");
  }
}

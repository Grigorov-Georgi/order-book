package io.orderable.orderapi.controller;

import io.orderable.orderapi.auth.UserIdentityMapper;
import io.orderable.orderapi.dto.OrderDTO;
import io.orderable.orderapi.dto.OrderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/orders")
public class OrderController {
    private final UserIdentityMapper userIdentityMapper;

    public OrderController(UserIdentityMapper userIdentityMapper) {
        this.userIdentityMapper = userIdentityMapper;
    }

    @PostMapping("/buy")
    ResponseEntity<String> buyOrder(@RequestBody OrderDTO orderDTO,
            @RequestHeader(name = "X-Idempotency-Key", required = true) String idempotencyKey,
            @RequestHeader(name = "X-User-Id", required = true) String authSub) {

        String externalUserKey = userIdentityMapper.toExternalUserKey(authSub);
        UUID internalUserId = userIdentityMapper.toInternalUserId(authSub);

        orderDTO.setType(OrderType.BUY);
        log.info("buy order request: {}, externalUserKey={}, internalUserId={}", orderDTO, externalUserKey,
                internalUserId);

        return ResponseEntity.status(HttpStatusCode.valueOf(200))
                .body("buy order requested");
    }

    @PostMapping("/sell")
    ResponseEntity<String> sellOrder(@RequestBody OrderDTO orderDTO,
            @RequestHeader(name = "X-Idempotency-Key", required = true) String idempotencyKey,
            @RequestHeader(name = "X-User-Id", required = true) String authSub) {

        String externalUserKey = userIdentityMapper.toExternalUserKey(authSub);
        UUID internalUserId = userIdentityMapper.toInternalUserId(authSub);

        orderDTO.setType(OrderType.SELL);
        log.info("sell order request: {}, externalUserKey={}, internalUserId={}", orderDTO, externalUserKey,
                internalUserId);

        return ResponseEntity.status(HttpStatusCode.valueOf(200))
                .body("sell order requested");
    }
}

package io.orderable.orderapi.controller;

import io.orderable.orderapi.dto.OrderDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/orders")
public class OrderController {

    @GetMapping
    ResponseEntity<String> getOrders() {
        log.info("get request");
        return ResponseEntity.ok("success");
    }

    @PostMapping("/buy")
    ResponseEntity<String> buyOrder(@RequestBody OrderDTO orderDTO) {
        log.info("buy order request: {}", orderDTO.toString());
        return ResponseEntity.status(HttpStatusCode.valueOf(200))
                .body("buy order requested");
    }

    @PostMapping("/sell")
    ResponseEntity<String> sellOrder(@RequestBody OrderDTO orderDTO) {
        log.info("sell order request: {}", orderDTO.toString());
        return ResponseEntity.status(HttpStatusCode.valueOf(200))
                .body("sell order requested");
    }
}

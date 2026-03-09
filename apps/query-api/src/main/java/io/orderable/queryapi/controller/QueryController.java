package io.orderable.queryapi.controller;

import io.orderable.queryapi.auth.UserIdentityMapper;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/query/orders")
public class QueryController {
  private final UserIdentityMapper userIdentityMapper;

  public QueryController(UserIdentityMapper userIdentityMapper) {
    this.userIdentityMapper = userIdentityMapper;
  }

  @GetMapping("/symbol-range")
  ResponseEntity<String> getOrdersBySymbolRange(
      @RequestParam String symbol, @RequestParam int from, @RequestParam int to) {
    return ResponseEntity.ok("symbol-range: " + symbol + " [" + from + "," + to + "]");
  }

  @GetMapping("/user")
  ResponseEntity<String> getUserOrders(
      @RequestHeader(name = "X-User-Id", required = true) String authSub) {
    String externalUserKey = userIdentityMapper.toExternalUserKey(authSub);
    UUID internalUserId = userIdentityMapper.toInternalUserId(authSub);
    return ResponseEntity.ok(
        "user-orders: externalUserKey=" + externalUserKey + ", internalUserId=" + internalUserId);
  }
}

package io.orderable.queryapi.auth;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UserIdentityMapper {

  public String toExternalUserKey(String authSub) {
    return authSub.trim();
  }

  public UUID toInternalUserId(String authSub) {
    return UUID.nameUUIDFromBytes(toExternalUserKey(authSub).getBytes(StandardCharsets.UTF_8));
  }
}

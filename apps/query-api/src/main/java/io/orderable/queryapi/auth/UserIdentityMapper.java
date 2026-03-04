package io.orderable.queryapi.auth;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class UserIdentityMapper {

    public String toExternalUserKey(String authSub) {
        return authSub.trim();
    }

    public UUID toInternalUserId(String authSub) {
        return UUID.nameUUIDFromBytes(toExternalUserKey(authSub).getBytes(StandardCharsets.UTF_8));
    }
}

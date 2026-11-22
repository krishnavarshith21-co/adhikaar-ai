package com.adhikaarai.backend.service;

import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionRegistry {
    private record Session(Long userId, Instant expires) {}
    private final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();
    public String create(Long userId) {
        sessions.entrySet().removeIf(e -> e.getValue().expires().isBefore(Instant.now()));
        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(userId, Instant.now().plusSeconds(28800)));
        return token;
    }
    public Long resolve(String token) {
        if (token == null) return null;
        Session s = sessions.get(token);
        if (s == null) return null;
        if (s.expires().isBefore(Instant.now())) { sessions.remove(token); return null; }
        return s.userId();
    }
    public void remove(String token) { if (token != null) sessions.remove(token); }
}

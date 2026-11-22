package com.adhikaarai.backend.controller;
import com.adhikaarai.backend.dto.AuthRequest;
import com.adhikaarai.backend.dto.AuthResponse;
import com.adhikaarai.backend.service.AuthService;
import com.adhikaarai.backend.service.SessionRegistry;
import com.adhikaarai.backend.repository.UserRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;
    private final SessionRegistry sessions;
    private final UserRepository users;
    public AuthController(AuthService auth, SessionRegistry sessions, UserRepository users) { this.auth=auth; this.sessions=sessions; this.users=users; }
    @PostMapping("/register") public AuthResponse register(@Valid @RequestBody AuthRequest request) { return auth.register(request); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody AuthRequest request) { return auth.login(request); }
    @GetMapping("/me") public Map<String,Object> me(Principal principal) {
        var user=users.findById(Long.valueOf(principal.getName())).orElseThrow();
        return Map.of("id", user.getId(), "email", user.getEmail(), "fullName", user.getFullName());
    }
    @PostMapping("/logout") public Map<String,Boolean> logout(@RequestHeader("Authorization") String header) { sessions.remove(header.substring(7)); return Map.of("ok",true); }
}

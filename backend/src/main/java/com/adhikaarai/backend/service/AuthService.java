package com.adhikaarai.backend.service;

import com.adhikaarai.backend.dto.AuthRequest;
import com.adhikaarai.backend.dto.AuthResponse;
import com.adhikaarai.backend.entity.Role;
import com.adhikaarai.backend.entity.CitizenWorkspace;
import com.adhikaarai.backend.repository.CitizenWorkspaceRepository;
import com.adhikaarai.backend.entity.User;
import com.adhikaarai.backend.entity.UserProfile;
import com.adhikaarai.backend.repository.RoleRepository;
import com.adhikaarai.backend.repository.UserProfileRepository;
import com.adhikaarai.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionRegistry sessions;
    private final CitizenWorkspaceRepository workspaces;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        UserProfileRepository userProfileRepository,
        PasswordEncoder passwordEncoder, SessionRegistry sessions, CitizenWorkspaceRepository workspaces
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessions = sessions;
        this.workspaces = workspaces;
    }

    private void validateCredentials(AuthRequest request) {
        request.setEmail(request.getEmail().trim().toLowerCase(java.util.Locale.ROOT));
        if (request.getPassword().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72)
            throw new IllegalArgumentException("Password exceeds bcrypt byte limit");
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        validateCredentials(request);
        if (request.getFullName() == null || request.getFullName().isBlank()) throw new IllegalArgumentException("Name is required");
        request.setFullName(request.getFullName().trim());
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getEmail(), encodedPassword, request.getFullName() != null ? request.getFullName() : "Citizen");

        Role userRole = roleRepository.findByName("ROLE_USER")
            .orElseGet(() -> roleRepository.save(new Role("ROLE_USER", "Standard Citizen")));
        user.getRoles().add(userRole);

        User savedUser = userRepository.save(user);
        workspaces.saveAndFlush(new CitizenWorkspace(savedUser.getId()));

        // Initialize default profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        // No residency is inferred for a real citizen.
        userProfileRepository.save(profile);

        String sessionToken = sessions.create(savedUser.getId());
        return new AuthResponse(sessionToken, savedUser.getEmail(), savedUser.getFullName(), "ROLE_USER");
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        validateCredentials(request);
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isActive() || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!workspaces.existsById(user.getId())) workspaces.saveAndFlush(new CitizenWorkspace(user.getId()));
        String sessionToken = sessions.create(user.getId());
        String roleName = user.getRoles().stream().findFirst().map(Role::getName).orElse("ROLE_USER");
        return new AuthResponse(sessionToken, user.getEmail(), user.getFullName(), roleName);
    }
}


package com.adhikaarai.backend.service;

import com.adhikaarai.backend.entity.DocumentRequirement;
import com.adhikaarai.backend.entity.User;
import com.adhikaarai.backend.entity.UserDocumentReadiness;
import com.adhikaarai.backend.repository.DocumentRequirementRepository;
import com.adhikaarai.backend.repository.UserDocumentReadinessRepository;
import com.adhikaarai.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class PreflightService {

    private final DocumentRequirementRepository documentRequirementRepository;
    private final UserDocumentReadinessRepository readinessRepository;
    private final UserRepository userRepository;

    public PreflightService(
        DocumentRequirementRepository documentRequirementRepository,
        UserDocumentReadinessRepository readinessRepository,
        UserRepository userRepository
    ) {
        this.documentRequirementRepository = documentRequirementRepository;
        this.readinessRepository = readinessRepository;
        this.userRepository = userRepository;
    }

    public List<DocumentRequirement> getSchemeDocuments(String schemeId) {
        return documentRequirementRepository.findBySchemeId(schemeId);
    }

    public List<UserDocumentReadiness> getUserReadiness(Long userId) {
        return readinessRepository.findByUserId(userId);
    }

    @Transactional
    public UserDocumentReadiness updateReadiness(Long userId, String documentRequirementId, String status, String notes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        DocumentRequirement doc = documentRequirementRepository.findById(documentRequirementId)
            .orElseThrow(() -> new IllegalArgumentException("Document requirement not found: " + documentRequirementId));

        UserDocumentReadiness readiness = readinessRepository.findByUserIdAndDocumentRequirementId(userId, documentRequirementId)
            .orElseGet(() -> {
                UserDocumentReadiness r = new UserDocumentReadiness();
                r.setUser(user);
                r.setDocumentRequirement(doc);
                return r;
            });

        readiness.setStatus(status);
        readiness.setNotes(notes);
        readiness.setUpdatedAt(Instant.now());

        return readinessRepository.save(readiness);
    }
}


package com.adhikaarai.backend.controller;

import com.adhikaarai.backend.entity.DocumentRequirement;
import com.adhikaarai.backend.entity.UserDocumentReadiness;
import com.adhikaarai.backend.service.PreflightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/preflight")
public class PreflightController {

    private final PreflightService preflightService;

    public PreflightController(PreflightService preflightService) {
        this.preflightService = preflightService;
    }

    @GetMapping("/scheme/{schemeId}/documents")
    public ResponseEntity<List<DocumentRequirement>> getSchemeDocuments(@PathVariable String schemeId) {
        return ResponseEntity.ok(preflightService.getSchemeDocuments(schemeId));
    }

    @GetMapping("/user/{userId}/readiness")
    public ResponseEntity<List<UserDocumentReadiness>> getUserReadiness(@PathVariable Long userId) {
        return ResponseEntity.ok(preflightService.getUserReadiness(userId));
    }

    @PostMapping("/user/{userId}/readiness")
    public ResponseEntity<UserDocumentReadiness> updateReadiness(
        @PathVariable Long userId,
        @RequestBody Map<String, String> body
    ) {
        String docId = body.get("documentRequirementId");
        String status = body.get("status");
        String notes = body.get("notes");

        UserDocumentReadiness updated = preflightService.updateReadiness(userId, docId, status, notes);
        return ResponseEntity.ok(updated);
    }
}


package com.adhikaarai.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_document_readiness")
public class UserDocumentReadiness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "document_requirement_id", nullable = false)
    private DocumentRequirement documentRequirement;

    @Column(nullable = false, length = 50)
    private String status; // READY, MISSING, NEEDS_UPDATE, OPTIONAL

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public UserDocumentReadiness() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DocumentRequirement getDocumentRequirement() { return documentRequirement; }
    public void setDocumentRequirement(DocumentRequirement documentRequirement) { this.documentRequirement = documentRequirement; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}


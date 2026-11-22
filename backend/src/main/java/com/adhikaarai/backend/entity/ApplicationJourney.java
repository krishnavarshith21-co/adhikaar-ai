package com.adhikaarai.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "application_journeys")
public class ApplicationJourney {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "current_status", nullable = false, length = 50)
    private String currentStatus; // NOT_STARTED, PREPARING, READY_TO_APPLY, SUBMITTED_BY_USER, FOLLOW_UP_NEEDED, COMPLETED

    @Column(name = "application_reference", length = 150)
    private String applicationReference;

    @Column(name = "next_recommended_action", columnDefinition = "TEXT")
    private String nextRecommendedAction;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "journey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationStatusHistory> statusHistory = new ArrayList<>();

    public ApplicationJourney() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Scheme getScheme() { return scheme; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public String getApplicationReference() { return applicationReference; }
    public void setApplicationReference(String applicationReference) { this.applicationReference = applicationReference; }

    public String getNextRecommendedAction() { return nextRecommendedAction; }
    public void setNextRecommendedAction(String nextRecommendedAction) { this.nextRecommendedAction = nextRecommendedAction; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<ApplicationStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<ApplicationStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
}


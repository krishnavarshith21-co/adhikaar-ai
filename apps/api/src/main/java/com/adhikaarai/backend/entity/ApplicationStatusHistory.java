package com.adhikaarai.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journey_id", nullable = false)
    private ApplicationJourney journey;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(length = 150)
    private String label;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_at")
    private Instant recordedAt = Instant.now();

    public ApplicationStatusHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ApplicationJourney getJourney() { return journey; }
    public void setJourney(ApplicationJourney journey) { this.journey = journey; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}


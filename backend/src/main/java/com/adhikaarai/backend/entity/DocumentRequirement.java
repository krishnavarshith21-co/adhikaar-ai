package com.adhikaarai.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "document_requirements")
public class DocumentRequirement {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_mandatory")
    private Boolean isMandatory = true;

    public DocumentRequirement() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Scheme getScheme() { return scheme; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsMandatory() { return isMandatory; }
    public void setIsMandatory(Boolean mandatory) { isMandatory = mandatory; }
}


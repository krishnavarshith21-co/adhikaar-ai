package com.adhikaarai.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 300)
    private String name;

    @Column(name = "name_te", length = 300)
    private String nameTe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id")
    private SchemeProvider provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private SchemeCategory category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "official_url", length = 500)
    private String officialUrl;

    @Column(name = "verification_status", length = 50)
    private String verificationStatus = "VERIFIED";

    @Column(name = "verified_at")
    private LocalDate verifiedAt;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SchemeBenefit> benefits = new ArrayList<>();

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentRequirement> requiredDocuments = new ArrayList<>();

    public Scheme() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameTe() { return nameTe; }
    public void setNameTe(String nameTe) { this.nameTe = nameTe; }

    public SchemeProvider getProvider() { return provider; }
    public void setProvider(SchemeProvider provider) { this.provider = provider; }

    public SchemeCategory getCategory() { return category; }
    public void setCategory(SchemeCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDate getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDate verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDate getDeadlineDate() { return deadlineDate; }
    public void setDeadlineDate(LocalDate deadlineDate) { this.deadlineDate = deadlineDate; }

    public List<SchemeBenefit> getBenefits() { return benefits; }
    public void setBenefits(List<SchemeBenefit> benefits) { this.benefits = benefits; }

    public List<DocumentRequirement> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<DocumentRequirement> requiredDocuments) { this.requiredDocuments = requiredDocuments; }
}


package com.adhikaarai.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rule_version_id")
    private RuleVersion ruleVersion;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "income_ceiling", precision = 14, scale = 2)
    private BigDecimal incomeCeiling;

    @Column(name = "applicable_states", columnDefinition = "TEXT")
    private String applicableStates;

    @Column(name = "applicable_occupations", columnDefinition = "TEXT")
    private String applicableOccupations;

    @Column(name = "requires_landholding")
    private Boolean requiresLandholding = false;

    @Column(name = "additional_criteria", columnDefinition = "TEXT")
    private String additionalCriteria;

    public EligibilityRule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Scheme getScheme() { return scheme; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }

    public RuleVersion getRuleVersion() { return ruleVersion; }
    public void setRuleVersion(RuleVersion ruleVersion) { this.ruleVersion = ruleVersion; }

    public Integer getMinAge() { return minAge; }
    public void setMinAge(Integer minAge) { this.minAge = minAge; }

    public Integer getMaxAge() { return maxAge; }
    public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

    public BigDecimal getIncomeCeiling() { return incomeCeiling; }
    public void setIncomeCeiling(BigDecimal incomeCeiling) { this.incomeCeiling = incomeCeiling; }

    public String getApplicableStates() { return applicableStates; }
    public void setApplicableStates(String applicableStates) { this.applicableStates = applicableStates; }

    public String getApplicableOccupations() { return applicableOccupations; }
    public void setApplicableOccupations(String applicableOccupations) { this.applicableOccupations = applicableOccupations; }

    public Boolean getRequiresLandholding() { return requiresLandholding; }
    public void setRequiresLandholding(Boolean requiresLandholding) { this.requiresLandholding = requiresLandholding; }

    public String getAdditionalCriteria() { return additionalCriteria; }
    public void setAdditionalCriteria(String additionalCriteria) { this.additionalCriteria = additionalCriteria; }
}


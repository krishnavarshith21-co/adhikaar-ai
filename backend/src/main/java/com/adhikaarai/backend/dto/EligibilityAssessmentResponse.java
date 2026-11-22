package com.adhikaarai.backend.dto;

import java.util.List;

public class EligibilityAssessmentResponse {
    private String schemeId;
    private String schemeName;
    private String status; // POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE_BASED_ON_KNOWN_RULES, MORE_INFORMATION_NEEDED
    private List<String> reasons;
    private List<String> missingCriteria;
    private String ruleVersion;

    public EligibilityAssessmentResponse(String schemeId, String schemeName, String status, List<String> reasons, List<String> missingCriteria, String ruleVersion) {
        this.schemeId = schemeId;
        this.schemeName = schemeName;
        this.status = status;
        this.reasons = reasons;
        this.missingCriteria = missingCriteria;
        this.ruleVersion = ruleVersion;
    }

    public String getSchemeId() { return schemeId; }
    public String getSchemeName() { return schemeName; }
    public String getStatus() { return status; }
    public List<String> getReasons() { return reasons; }
    public List<String> getMissingCriteria() { return missingCriteria; }
    public String getRuleVersion() { return ruleVersion; }
}


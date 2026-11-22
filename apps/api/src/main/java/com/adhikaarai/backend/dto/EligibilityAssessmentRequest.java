package com.adhikaarai.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class EligibilityAssessmentRequest {
    private Integer age;
    private String state;
    private String occupation;
    private BigDecimal annualIncome;
    private String educationLevel;
    private Boolean hasLandholding;
    private String specificSchemeId;

    public EligibilityAssessmentRequest() {}

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public Boolean getHasLandholding() { return hasLandholding; }
    public void setHasLandholding(Boolean hasLandholding) { this.hasLandholding = hasLandholding; }

    public String getSpecificSchemeId() { return specificSchemeId; }
    public void setSpecificSchemeId(String specificSchemeId) { this.specificSchemeId = specificSchemeId; }
}


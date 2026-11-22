package com.adhikaarai.backend;

import com.adhikaarai.backend.dto.EligibilityAssessmentRequest;
import com.adhikaarai.backend.dto.EligibilityAssessmentResponse;
import com.adhikaarai.backend.entity.EligibilityRule;
import com.adhikaarai.backend.entity.RuleVersion;
import com.adhikaarai.backend.entity.Scheme;
import com.adhikaarai.backend.repository.EligibilityRuleRepository;
import com.adhikaarai.backend.repository.SchemeRepository;
import com.adhikaarai.backend.rules.DeterministicEligibilityEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DeterministicEligibilityEngineTest {

    private SchemeRepository schemeRepository;
    private EligibilityRuleRepository eligibilityRuleRepository;
    private DeterministicEligibilityEngine engine;

    @BeforeEach
    void setUp() {
        schemeRepository = Mockito.mock(SchemeRepository.class);
        eligibilityRuleRepository = Mockito.mock(EligibilityRuleRepository.class);
        engine = new DeterministicEligibilityEngine(schemeRepository, eligibilityRuleRepository);
    }

    @Test
    void testEligibleCandidateMeetsAllCriteria() {
        Scheme scheme = new Scheme();
        scheme.setId("ts-rythu-bandhu");
        scheme.setName("Rythu Bandhu");

        EligibilityRule rule = new EligibilityRule();
        rule.setMinAge(18);
        rule.setApplicableStates("Telangana");
        rule.setApplicableOccupations("Farmer");
        rule.setRequiresLandholding(true);

        RuleVersion version = new RuleVersion();
        version.setVersionTag("2026.11-v1.4");
        rule.setRuleVersion(version);

        when(schemeRepository.findAll()).thenReturn(List.of(scheme));
        when(eligibilityRuleRepository.findBySchemeId("ts-rythu-bandhu")).thenReturn(Optional.of(rule));

        EligibilityAssessmentRequest req = new EligibilityAssessmentRequest();
        req.setAge(25);
        req.setState("Telangana");
        req.setOccupation("Farmer");
        req.setHasLandholding(true);

        List<EligibilityAssessmentResponse> responses = engine.evaluate(req);

        assertEquals(1, responses.size());
        assertEquals("POTENTIALLY_ELIGIBLE", responses.get(0).getStatus());
        assertTrue(responses.get(0).getMissingCriteria().isEmpty());
        assertFalse(responses.get(0).getReasons().isEmpty());
    }

    @Test
    void testIneligibleCandidateFailsAgeThreshold() {
        Scheme scheme = new Scheme();
        scheme.setId("sr-citizen");
        scheme.setName("Senior Citizen Grant");

        EligibilityRule rule = new EligibilityRule();
        rule.setMinAge(60);

        when(schemeRepository.findAll()).thenReturn(List.of(scheme));
        when(eligibilityRuleRepository.findBySchemeId("sr-citizen")).thenReturn(Optional.of(rule));

        EligibilityAssessmentRequest req = new EligibilityAssessmentRequest();
        req.setAge(24);

        List<EligibilityAssessmentResponse> responses = engine.evaluate(req);

        assertEquals(1, responses.size());
        assertEquals("NOT_ELIGIBLE_BASED_ON_KNOWN_RULES", responses.get(0).getStatus());
        assertFalse(responses.get(0).getMissingCriteria().isEmpty());
    }

    @Test void missingFieldsAreUnknownNotApprovalOrRejection() {
        Scheme scheme=new Scheme(); scheme.setId("test"); scheme.setName("Test");
        EligibilityRule rule=new EligibilityRule(); rule.setMaxAge(30); rule.setIncomeCeiling(new BigDecimal("200000")); rule.setApplicableStates("Telangana"); rule.setApplicableOccupations("Farmer"); rule.setRequiresLandholding(true);
        when(schemeRepository.findAll()).thenReturn(List.of(scheme));
        when(eligibilityRuleRepository.findBySchemeId("test")).thenReturn(Optional.of(rule));
        assertEquals("MORE_INFORMATION_NEEDED",engine.evaluate(new EligibilityAssessmentRequest()).get(0).getStatus());
    }
    @Test void partialOccupationDoesNotMatch() {
        Scheme scheme=new Scheme(); scheme.setId("test"); scheme.setName("Test");
        EligibilityRule rule=new EligibilityRule(); rule.setApplicableOccupations("Farmer, Artisan");
        when(schemeRepository.findAll()).thenReturn(List.of(scheme));
        when(eligibilityRuleRepository.findBySchemeId("test")).thenReturn(Optional.of(rule));
        EligibilityAssessmentRequest request=new EligibilityAssessmentRequest(); request.setOccupation("Farm");
        assertEquals("NOT_ELIGIBLE_BASED_ON_KNOWN_RULES",engine.evaluate(request).get(0).getStatus());
    }
    @Test void additionalConditionsPreventPrematureEligibility() {
        Scheme scheme=new Scheme(); scheme.setId("test"); scheme.setName("Test");
        EligibilityRule rule=new EligibilityRule(); rule.setAdditionalCriteria("Official registry entry required");
        when(schemeRepository.findAll()).thenReturn(List.of(scheme));
        when(eligibilityRuleRepository.findBySchemeId("test")).thenReturn(Optional.of(rule));
        assertEquals("MORE_INFORMATION_NEEDED",engine.evaluate(new EligibilityAssessmentRequest()).get(0).getStatus());
    }
}


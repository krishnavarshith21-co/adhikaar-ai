package com.adhikaarai.backend.controller;

import com.adhikaarai.backend.dto.EligibilityAssessmentRequest;
import com.adhikaarai.backend.dto.EligibilityAssessmentResponse;
import com.adhikaarai.backend.rules.DeterministicEligibilityEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eligibility")
public class EligibilityController {

    private final DeterministicEligibilityEngine eligibilityEngine;

    public EligibilityController(DeterministicEligibilityEngine eligibilityEngine) {
        this.eligibilityEngine = eligibilityEngine;
    }

    @PostMapping("/assess")
    public ResponseEntity<List<EligibilityAssessmentResponse>> assessEligibility(
        @RequestBody EligibilityAssessmentRequest request
    ) {
        List<EligibilityAssessmentResponse> results = eligibilityEngine.evaluate(request);
        return ResponseEntity.ok(results);
    }
}


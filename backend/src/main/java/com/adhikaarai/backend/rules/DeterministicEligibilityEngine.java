package com.adhikaarai.backend.rules;
import com.adhikaarai.backend.dto.EligibilityAssessmentRequest;
import com.adhikaarai.backend.dto.EligibilityAssessmentResponse;
import com.adhikaarai.backend.entity.Scheme;
import com.adhikaarai.backend.repository.EligibilityRuleRepository;
import com.adhikaarai.backend.repository.SchemeRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
@Service
public class DeterministicEligibilityEngine {
 private final SchemeRepository schemes; private final EligibilityRuleRepository rules;
 public DeterministicEligibilityEngine(SchemeRepository schemes, EligibilityRuleRepository rules) { this.schemes=schemes; this.rules=rules; }
 private static boolean matches(String values,String actual) { return Arrays.stream(values.split("[,;|]")).anyMatch(v -> v.trim().equalsIgnoreCase(actual.trim())); }
 public List<EligibilityAssessmentResponse> evaluate(EligibilityAssessmentRequest request) {
  List<Scheme> candidates=request.getSpecificSchemeId()!=null && !request.getSpecificSchemeId().isBlank() ? schemes.findById(request.getSpecificSchemeId()).map(List::of).orElse(List.of()) : schemes.findAll();
  List<EligibilityAssessmentResponse> results=new ArrayList<>();
  for(var scheme:candidates) {
   var rule=rules.findBySchemeId(scheme.getId());
   if(rule.isEmpty()) { results.add(new EligibilityAssessmentResponse(scheme.getId(),scheme.getName(),"MORE_INFORMATION_NEEDED",List.of(),List.of("No reviewed rule set"),"unreviewed")); continue; }
   var r=rule.get(); List<String> reasons=new ArrayList<>(), missing=new ArrayList<>(), failures=new ArrayList<>();
   if(r.getMinAge()!=null || r.getMaxAge()!=null) {
    if(request.getAge()==null) missing.add("Age is not provided");
    else if(r.getMinAge()!=null && request.getAge()<r.getMinAge() || r.getMaxAge()!=null && request.getAge()>r.getMaxAge()) failures.add("Age outside the published range");
    else reasons.add("Age within the known range");
   }
   if(r.getIncomeCeiling()!=null) {
    if(request.getAnnualIncome()==null) missing.add("Annual income is not provided");
    else if(request.getAnnualIncome().signum()<0) missing.add("Annual income is invalid");
    else if(request.getAnnualIncome().compareTo(r.getIncomeCeiling())>0) failures.add("Income exceeds the known ceiling");
    else reasons.add("Income within the known ceiling");
   }
   if(r.getApplicableStates()!=null && !r.getApplicableStates().equalsIgnoreCase("ALL")) {
    if(request.getState()==null || request.getState().isBlank()) missing.add("State is not provided");
    else if(!matches(r.getApplicableStates(),request.getState())) failures.add("State does not meet the known requirement");
    else reasons.add("State matches");
   }
   if(r.getApplicableOccupations()!=null && !r.getApplicableOccupations().equalsIgnoreCase("ALL")) {
    if(request.getOccupation()==null || request.getOccupation().isBlank()) missing.add("Occupation is not provided");
    else if(!matches(r.getApplicableOccupations(),request.getOccupation())) failures.add("Occupation does not meet the known requirement");
    else reasons.add("Occupation matches");
   }
   if(Boolean.TRUE.equals(r.getRequiresLandholding())) {
    if(request.getHasLandholding()==null) missing.add("Landholding is not confirmed");
    else if(!request.getHasLandholding()) failures.add("Known landholding requirement not met");
    else reasons.add("Landholding is self-reported");
   }
   if(r.getAdditionalCriteria()!=null && !r.getAdditionalCriteria().isBlank()) missing.add("Additional conditions require review: "+r.getAdditionalCriteria());
   String status=!failures.isEmpty()?"NOT_ELIGIBLE_BASED_ON_KNOWN_RULES":!missing.isEmpty()?"MORE_INFORMATION_NEEDED":"POTENTIALLY_ELIGIBLE";
   missing.addAll(failures);
   results.add(new EligibilityAssessmentResponse(scheme.getId(),scheme.getName(),status,reasons,missing,r.getRuleVersion()==null?"unversioned":r.getRuleVersion().getVersionTag()));
  }
  return results;
 }
}

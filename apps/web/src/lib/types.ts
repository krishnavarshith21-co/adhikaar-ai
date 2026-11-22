export interface Scheme {
  id: string;
  name: string;
  nameTe?: string;
  provider: string;
  providerType: "GOVERNMENT" | "NGO";
  category: "EDUCATION" | "HEALTHCARE" | "EMPLOYMENT" | "AGRICULTURE" | "HOUSING" | "FINANCIAL" | "DISABILITY" | "OTHER";
  categoryLabel: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    incomeCeiling?: number;
    occupations?: string[];
    states?: string[];
    educationLevels?: string[];
    otherConditions?: string[];
  };
  requiredDocuments: {
    id: string;
    name: string;
    description: string;
    mandatory: boolean;
  }[];
  officialUrl?: string;
  verifiedAt: string;
  verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "DEMO";
  deadline?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  occupation?: string;
  education?: string;
  annualIncome?: number;
  category?: string;
  preferredLanguage: "en" | "te";
}

export type EligibilityStatus = 
  | "POTENTIALLY_ELIGIBLE" 
  | "NOT_ELIGIBLE_BASED_ON_KNOWN_RULES" 
  | "MORE_INFORMATION_NEEDED";

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  status: EligibilityStatus;
  reasons: string[];
  missingCriteria: string[];
  ruleVersion: string;
}

export type PreflightStatus = "READY" | "MISSING" | "NEEDS_UPDATE" | "OPTIONAL";

export interface DocumentPreflightItem {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  userStatus: PreflightStatus;
  userNotes?: string;
}

export type JourneyStatus =
  | "NOT_STARTED"
  | "PREPARING"
  | "READY_TO_APPLY"
  | "SUBMITTED_BY_USER"
  | "FOLLOW_UP_NEEDED"
  | "COMPLETED";

export interface JourneyApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  provider: string;
  status: JourneyStatus;
  applicationReference?: string;
  updatedAt: string;
  timeline: {
    status: JourneyStatus;
    label: string;
    date: string;
    notes?: string;
  }[];
  nextRecommendedAction: string;
}


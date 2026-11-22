export type Language = 'en' | 'hi' | 'te';
export type Answer = 'yes' | 'no' | 'unknown';
export interface Profile {
  name: string; email: string; age: number | null; state: string; occupation: string;
  annualIncome: number | null; qualifiedAdmission: Answer; cultivableLand: Answer; microEnterprise: Answer;
}
export interface Citation { title: string; url: string; authority: string; lastChecked: string }
export interface Scheme {
  id: string; name: string; category: string; description: string; authority: string; portal: string;
  source: Citation; conditions: string[]; documents: { id: string; name: string }[];
  documentNote: string; keywords: string[];
}
export interface Workspace {
  profile: Profile; savedSchemeIds: string[]; documentStatus: Record<string, boolean>;
  journeys: { schemeId: string; stage: number; updatedAt: string }[];
  notifications: { id: string; text: string; read: boolean }[];
  settings: { language: Language; reducedMotion: boolean };
}
export interface SessionView { role: 'DEMO_USER' | 'NORMAL_USER'; namespace: string; personaId: string | null; revision: number; workspace: Workspace }
export type AssessmentStatus = 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE_BASED_ON_KNOWN_RULES' | 'MORE_INFORMATION_NEEDED';
export interface Assessment { schemeId: string; status: AssessmentStatus; reasons: string[]; missing: string[]; ruleVersion: string }
export const emptyWorkspace = (name: string, email: string): Workspace => ({
  profile: { name, email, age: null, state: '', occupation: '', annualIncome: null, qualifiedAdmission: 'unknown', cultivableLand: 'unknown', microEnterprise: 'unknown' },
  savedSchemeIds: [], documentStatus: {}, journeys: [], notifications: [], settings: { language: 'en', reducedMotion: false },
});

import { emptyWorkspace, type Workspace } from './model';
export const PERSONAS = [
  { id: 'aarohi-rao', name: 'Aarohi Rao', role: 'Student', location: 'Hyderabad, Telangana' },
  { id: 'ramesh-patil', name: 'Ramesh Patil', role: 'Farmer', location: 'Mulugu, Telangana' },
  { id: 'sana-khan', name: 'Sana Khan', role: 'Entrepreneur', location: 'Jaipur, Rajasthan' },
] as const;
export function fixture(id: string): Workspace {
  const persona = PERSONAS.find(p => p.id === id);
  if (!persona) throw new Error('Unknown demo persona');
  const data = emptyWorkspace(persona.name, `${id}@example.invalid`);
  const student = id === 'aarohi-rao', farmer = id === 'ramesh-patil';
  data.profile = { ...data.profile, age: student ? 21 : farmer ? 42 : 29, state: student || farmer ? 'Telangana' : 'Rajasthan', occupation: persona.role,
    annualIncome: student ? 180000 : farmer ? 240000 : 300000,
    qualifiedAdmission: student ? 'yes' : 'no', cultivableLand: farmer ? 'yes' : 'no', microEnterprise: !student && !farmer ? 'yes' : 'no' };
  const schemeId = student ? 'pm-vidyalaxmi' : farmer ? 'ts-rythu-bharosa' : 'pm-mudra';
  data.savedSchemeIds = [schemeId];
  data.documentStatus = { [`${schemeId}:${student ? 'admission' : farmer ? 'residency' : 'business'}`]: true };
  data.journeys = [{ schemeId, stage: 1, updatedAt: '2026-11-22' }];
  data.notifications = [{ id: 'preparation', text: 'Review your preparation checklist. No application has been filed.', read: false }];
  return data;
}

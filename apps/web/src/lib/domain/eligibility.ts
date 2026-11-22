import { SCHEMES } from './catalog';
import type { Profile, Assessment, Workspace } from './model';
export function assess(profile: Profile, schemeId: string): Assessment {
  const reasons: string[] = [], missing: string[] = [], failures: string[] = [];
  const known = (value: string, expected: string, label: string) => {
    if (!value) missing.push(`${label} is not provided.`);
    else if (value.toLowerCase() !== expected.toLowerCase()) failures.push(`${label} does not match ${expected}.`);
    else reasons.push(`${label}: ${expected}.`);
  };
  if (schemeId === 'pm-vidyalaxmi') {
    known(profile.occupation, 'Student', 'Occupation');
    if (profile.qualifiedAdmission === 'yes') reasons.push('Merit admission to a current QHEI is self-reported.');
    else if (profile.qualifiedAdmission === 'no') failures.push('Qualifying merit admission is required.');
    else missing.push('Confirm merit admission and current QHEI listing.');
  } else if (schemeId === 'ts-rythu-bharosa') {
    known(profile.state, 'Telangana', 'State'); known(profile.occupation, 'Farmer', 'Occupation');
    if (profile.cultivableLand === 'yes') reasons.push('Qualifying cultivable land is self-reported.');
    else missing.push('Confirm qualifying tenure with the agriculture office, including tenant or forest-rights cases.');
  } else if (schemeId === 'pm-mudra') {
    if (profile.microEnterprise === 'yes') reasons.push('Eligible micro enterprise purpose is self-reported.');
    else if (profile.microEnterprise === 'no') failures.push('A qualifying micro enterprise credit purpose is required.');
    else missing.push('Confirm the business activity and purpose of credit.');
  } else missing.push('No reviewed rule set exists for this programme.');
  return { schemeId, status: failures.length ? 'NOT_ELIGIBLE_BASED_ON_KNOWN_RULES' : missing.length ? 'MORE_INFORMATION_NEEDED' : 'POTENTIALLY_ELIGIBLE', reasons: [...reasons, ...failures], missing, ruleVersion: 'preliminary-2026-11-22' };
}
export function recommendations(profile: Profile) {
  return SCHEMES.filter(s => assess(profile, s.id).status === 'POTENTIALLY_ELIGIBLE');
}
export function metrics(workspace: Workspace) {
  const matches = recommendations(workspace.profile);
  const docs = matches.flatMap(s => s.documents.map(d => `${s.id}:${d.id}`));
  return { matches: matches.length, saved: SCHEMES.filter(s => workspace.savedSchemeIds.includes(s.id)).length,
    journeys: workspace.journeys.filter(j => j.stage < 3).length,
    unread: workspace.notifications.filter(n => !n.read).length,
    ready: docs.filter(id => workspace.documentStatus[id]).length, documents: docs.length,
    readiness: docs.length ? Math.round(docs.filter(id => workspace.documentStatus[id]).length / docs.length * 100) : 0 };
}

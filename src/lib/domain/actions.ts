import { schemeById } from './catalog';
import type { Profile, Workspace } from './model';
export function applyAction(current: Workspace, type: string, payload: Record<string, unknown>): Workspace {
  const next = structuredClone(current);
  const scheme = typeof payload.schemeId === 'string' ? schemeById(payload.schemeId) : undefined;
  switch (type) {
    case 'PROFILE': {
      const p = payload as unknown as Profile;
      if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > 150 || typeof p.state !== 'string' || p.state.length > 80 || !['Student','Farmer','Entrepreneur','Salaried','Unemployed','Other',''].includes(p.occupation)) throw new Error('Invalid profile fields.');
      for (const [value, max] of [[p.age, 120], [p.annualIncome, 1e10]]) if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > Number(max))) throw new Error('Enter valid age and income.');
      if (p.age !== null && !Number.isInteger(p.age)) throw new Error('Age must be a whole number.');
      if (!['', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Other'].includes(p.state)) throw new Error('Select a supported state or Other.');
      for (const field of ['qualifiedAdmission', 'cultivableLand', 'microEnterprise'] as const) if (!['yes','no','unknown'].includes(p[field])) throw new Error('Invalid eligibility answer.');
      next.profile = { name: p.name.trim(), email: current.profile.email, age: p.age, state: p.state, occupation: p.occupation, annualIncome: p.annualIncome, qualifiedAdmission: p.qualifiedAdmission, cultivableLand: p.cultivableLand, microEnterprise: p.microEnterprise };
      break;
    }
    case 'SAVE':
      if (!scheme) throw new Error('Unknown scheme.');
      next.savedSchemeIds = next.savedSchemeIds.includes(scheme.id) ? next.savedSchemeIds.filter(id => id !== scheme.id) : [...next.savedSchemeIds, scheme.id]; break;
    case 'DOCUMENT':
      if (!scheme || !scheme.documents.some(d => d.id === payload.documentId) || typeof payload.ready !== 'boolean') throw new Error('Invalid document.');
      next.documentStatus[`${scheme.id}:${payload.documentId}`] = payload.ready; break;
    case 'JOURNEY': {
      if (!scheme) throw new Error('Unknown scheme.');
      const journey = next.journeys.find(j => j.schemeId === scheme.id);
      if (journey) { journey.stage = Math.min(3, journey.stage + 1); journey.updatedAt = new Date().toISOString(); }
      else next.journeys.push({ schemeId: scheme.id, stage: 0, updatedAt: new Date().toISOString() });
      break;
    }
    case 'READ':
      next.notifications = next.notifications.map(n => payload.id === n.id || payload.id === 'all' ? { ...n, read: true } : n); break;
    case 'SETTINGS':
      if (!['en','hi','te'].includes(String(payload.language)) || typeof payload.reducedMotion !== 'boolean') throw new Error('Invalid settings.');
      next.settings = { language: payload.language as 'en' | 'hi' | 'te', reducedMotion: payload.reducedMotion }; break;
    default: throw new Error('Unsupported action.');
  }
  return next;
}

import type { Scheme } from './model';
// Reviewed summaries, not an exhaustive rules database. Never treat source review as citizen verification.
export const SCHEMES: Scheme[] = [
  {
    id: 'pm-vidyalaxmi', name: 'PM-Vidyalaxmi', category: 'Education', authority: 'Ministry of Education',
    description: 'An education-loan scheme for students admitted on merit to designated Quality Higher Education Institutions. Loan sanction and any interest support require separate checks.',
    portal: 'https://pmvidyalaxmi.co.in',
    source: { title: 'PM-Vidyalaxmi Portal for Higher Education Loans', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2290079&lang=2&reg=48', authority: 'Ministry of Education / PIB', lastChecked: '2026-11-22' },
    conditions: ['Merit-based admission to an institution on the current QHEI list.', 'Bank assessment and the current scheme guidelines apply.', 'Interest subvention has additional income and other-benefit conditions; this preliminary assessment does not evaluate it.'],
    documents: [{ id: 'admission', name: 'Admission letter and institution details' }, { id: 'fees', name: 'Course fee schedule' }, { id: 'academic', name: 'Academic records' }, { id: 'identity', name: 'Identity proof requested by the lender' }, { id: 'income', name: 'Household income proof for any interest-support request' }],
    documentNote: 'Preparation checklist, not a verified exhaustive list. Confirm the current upload requirements with your institution and lender.',
    keywords: ['vidya', 'education', 'student', 'scholarship', 'fellowship', 'college', 'विद्या', 'शिक्षा', 'छात्र', 'విద్య', 'చదువు', 'విద్యార్థి'],
  },
  {
    id: 'ts-rythu-bharosa', name: 'Telangana Rythu Bharosa', category: 'Agriculture', authority: 'Government of Telangana',
    description: 'Agricultural investment support in Telangana, replacing Rythu Bandhu. Land records and current administrative criteria must be checked by the responsible authority.',
    portal: 'https://www.telangana.gov.in/departments/agriculture-and-co-operation/',
    source: { title: 'Rythu Bharosa (Agriculture Support)', url: 'https://mulugu.telangana.gov.in/scheme/rythu-bharosa-agriculture-support/', authority: 'Mulugu District, Government of Telangana', lastChecked: '2026-11-22' },
    conditions: ['Telangana residency and agricultural activity.', 'Qualifying cultivable land or another recognised tenure category must be confirmed.', 'Official land-record validation is required. Tenant and other special cases need authority confirmation.'],
    documents: [{ id: 'residency', name: 'Telangana residency evidence' }, { id: 'land', name: 'Applicable land or recognised tenure records' }, { id: 'bank', name: 'Bank account details requested by the authority' }],
    documentNote: 'Preparation checklist. Ask the agriculture office to confirm documents for your tenure category; do not assume every farmer must own land.',
    keywords: ['rythu', 'bandhu', 'bharosa', 'farmer', 'farm', 'agriculture', 'रैतु', 'किसान', 'खेती', 'రైతు', 'వ్యవసాయ'],
  },
  {
    id: 'pm-mudra', name: 'Pradhan Mantri MUDRA Yojana', category: 'Enterprise', authority: 'Department of Financial Services',
    description: 'Institutional credit for micro enterprises through participating lenders. This is a loan, with lender assessment and repayment obligations.',
    portal: 'https://www.mudra.org.in',
    source: { title: 'Pradhan Mantri MUDRA Yojana (PMMY)', url: 'https://www.financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy', authority: 'Department of Financial Services, Ministry of Finance', lastChecked: '2026-11-22' },
    conditions: ['An eligible income-generating micro enterprise activity.', 'The lender must assess the business, purpose of credit and repayment capacity.', 'Limits and product categories must be checked with the lender; approval is not guaranteed.'],
    documents: [{ id: 'business', name: 'Business activity and credit-purpose details' }, { id: 'identity', name: 'Identity and address evidence requested by the lender' }, { id: 'bank', name: 'Bank records requested by the lender' }],
    documentNote: 'Preparation checklist. The participating lender supplies the definitive application and document list.',
    keywords: ['mudra', 'entrepreneur', 'business', 'artisan', 'enterprise', 'मुद्रा', 'व्यवसाय', 'उद्यम', 'ముద్ర', 'వ్యాపార'],
  },
];
export const schemeById = (id: string) => SCHEMES.find(s => s.id === id);

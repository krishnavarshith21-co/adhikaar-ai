import Link from 'next/link';
import { AuthSplitShell } from '@/components/auth/auth-split-shell';
export default function ForgotPassword() { return <AuthSplitShell sectionLabel="ACCOUNT RECOVERY" heading="Password recovery" subtitle="Email recovery is not configured for this deployment."><p className="text-steel leading-relaxed">No recovery email has been sent. Contact the operator of this deployment for account recovery.</p><Link className="action-link mt-6" href="/sign-in">Return to sign in</Link></AuthSplitShell>; }

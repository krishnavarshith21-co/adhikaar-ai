"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Compass } from "lucide-react";

function SignInContent() {
  const { login, loginDemo, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [demoFailed, setDemoFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isDemoSubmitting) return;
    setError(null);
    setDemoFailed(false);

    if (!email || !email.includes("@")) {
      setError(t.auth.validEmailRequired);
      return;
    }
    if (!password) {
      setError(t.auth.credentialsRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password, redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.auth.signInFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    if (isDemoSubmitting || isSubmitting) return;
    setError(null);
    setDemoFailed(false);
    setIsDemoSubmitting(true);

    try {
      await loginDemo("aarohi-rao", redirectTo || "/app");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to launch demo mode. Please retry.";
      setError(msg);
      setDemoFailed(true);
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  const isBusy = isSubmitting || authLoading;

  return (
    <AuthSplitShell
      sectionLabel={t.auth.signInSectionLabel}
      heading={t.auth.signInHeading}
      subtitle={t.auth.signInSubtitle}
    >
      {/* Error Message Alert */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start justify-between gap-3 rounded-2xl bg-[#A95D49]/10 border border-[#A95D49]/25 p-4 text-xs sm:text-sm text-[#8A3F2C] font-sans transition-all"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#A95D49] mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
          {demoFailed && (
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="shrink-0 font-bold underline text-[#A95D49] hover:text-[#702F20] cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-semibold font-sans text-[#172943] mb-1.5"
          >
            {t.auth.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPlaceholder}
            className="w-full h-13 sm:h-14 px-4 bg-white text-[#172943] font-sans text-sm sm:text-base rounded-xl sm:rounded-2xl border border-[#D8CFBF] shadow-xs placeholder:text-[#657E91]/60 hover:border-[#BC9059]/50 focus:border-[#BC9059] focus:ring-2 focus:ring-[#BC9059]/20 focus:outline-none transition-all"
          />
        </div>

        {/* Password with Eye Toggle */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-semibold font-sans text-[#172943] mb-1.5"
          >
            {t.auth.passwordLabel}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-13 sm:h-14 pl-4 pr-12 bg-white text-[#172943] font-sans text-sm sm:text-base rounded-xl sm:rounded-2xl border border-[#D8CFBF] shadow-xs placeholder:text-[#657E91]/60 hover:border-[#BC9059]/50 focus:border-[#BC9059] focus:ring-2 focus:ring-[#BC9059]/20 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#657E91] hover:text-[#172943] transition-colors p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-[#BC9059]" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-sans pt-1">


          <Link
            href="/forgot-password"
            className="font-medium text-[#BC9059] hover:text-[#9A7342] transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-xs"
          >
            {t.auth.forgotPasswordLink}
          </Link>
        </div>

        {/* Main Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isBusy}
            className="group w-full h-14 rounded-full bg-[#172943] hover:bg-[#1D334F] active:scale-[0.99] text-[#F7F2E9] font-sans text-sm sm:text-base font-bold transition-all shadow-[0_8px_24px_rgba(22,42,67,0.2)] hover:shadow-[0_12px_28px_rgba(22,42,67,0.28)] flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#BC9059]" />
                <span>{t.auth.signingIn}</span>
              </>
            ) : (
              <>
                <span>{t.auth.signInCta}</span>
                <ArrowRight className="w-4 h-4 text-[#BC9059] transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Or Divider */}
        <div className="relative my-3 sm:my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8CFBF]/70" />
          </div>
          <div className="relative bg-[#F7F2E9] px-3 text-xs font-sans text-[#657E91] uppercase tracking-wider">
            {t.auth.demoDividerOr}
          </div>
        </div>

        {/* Explore with Demo Account Secondary Button */}
        <div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isDemoSubmitting || isSubmitting}
            className="group w-full h-13 sm:h-14 rounded-full border border-[#BC9059]/70 hover:border-[#BC9059] bg-[#BC9059]/10 hover:bg-[#BC9059]/20 active:scale-[0.99] text-[#172943] font-sans text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] shadow-xs hover:shadow-[0_6px_20px_rgba(185,141,87,0.18)] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isDemoSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#BC9059]" />
                <span>{t.auth.exploringWithDemo}</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-[#BC9059] transition-transform duration-200 group-hover:rotate-45" />
                <span>{demoFailed ? "Retry Demo Sign In" : t.auth.exploreWithDemo}</span>
              </>
            )}
          </button>
        </div>

        {/* Switch Link */}
        <div className="text-center pt-3">
          <p className="font-sans text-xs sm:text-sm text-[#4E677B]">
            {t.auth.dontHaveAccount}{" "}
            <Link
              href={redirectTo !== "/app" ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}` : "/sign-up"}
              className="font-semibold text-[#BC9059] hover:text-[#9A7342] transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-xs"
            >
              {t.auth.signUpLink}
            </Link>
          </p>
        </div>
      </form>
    </AuthSplitShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F2E9]" />}>
      <SignInContent />
    </Suspense>
  );
}

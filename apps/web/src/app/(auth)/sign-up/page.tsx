"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function SignUpContent() {
  const { register, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/app";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError(t.auth.nameRequired);
      return;
    }
    if (!email || !email.includes("@")) {
      setError(t.auth.validEmailRequired);
      return;
    }
    if (password.length < 8) {
      setError(t.auth.passwordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password, redirectTo);
    } catch {
      setError(t.auth.signUpFailed);
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || authLoading;

  return (
    <AuthSplitShell
      sectionLabel={t.auth.signUpSectionLabel}
      heading={t.auth.signUpHeading}
      subtitle={t.auth.signUpSubtitle}
    >
      {/* Error Message Alert */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl bg-[#A95D49]/10 border border-[#A95D49]/25 p-4 text-xs sm:text-sm text-[#8A3F2C] font-sans transition-all"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#A95D49] mt-0.5" />
          <span className="leading-relaxed font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <label
            htmlFor="full-name"
            className="block text-xs sm:text-sm font-semibold font-sans text-[#172943] mb-1.5"
          >
            {t.auth.fullNameLabel}
          </label>
          <input
            id="full-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.auth.fullNamePlaceholder}
            className="w-full h-13 sm:h-14 px-4 bg-white text-[#172943] font-sans text-sm sm:text-base rounded-xl sm:rounded-2xl border border-[#D8CFBF] shadow-xs placeholder:text-[#657E91]/60 hover:border-[#BC9059]/50 focus:border-[#BC9059] focus:ring-2 focus:ring-[#BC9059]/20 focus:outline-none transition-all"
          />
        </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.passwordPlaceholder}
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

        {/* Confirm Password with Eye Toggle */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs sm:text-sm font-semibold font-sans text-[#172943] mb-1.5"
          >
            {t.auth.confirmPasswordLabel}
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.auth.confirmPasswordPlaceholder}
              className="w-full h-13 sm:h-14 pl-4 pr-12 bg-white text-[#172943] font-sans text-sm sm:text-base rounded-xl sm:rounded-2xl border border-[#D8CFBF] shadow-xs placeholder:text-[#657E91]/60 hover:border-[#BC9059]/50 focus:border-[#BC9059] focus:ring-2 focus:ring-[#BC9059]/20 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#657E91] hover:text-[#172943] transition-colors p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-sm"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-[#BC9059]" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
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
                <span>{t.auth.creatingAccount}</span>
              </>
            ) : (
              <>
                <span>{t.auth.createAccountCta}</span>
                <ArrowRight className="w-4 h-4 text-[#BC9059] transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Switch Link */}
        <div className="text-center pt-3">
          <p className="font-sans text-xs sm:text-sm text-[#4E677B]">
            {t.auth.alreadyHaveAccount}{" "}
            <Link
              href={redirectTo !== "/app" ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in"}
              className="font-semibold text-[#BC9059] hover:text-[#9A7342] transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-xs"
            >
              {t.auth.signInLink}
            </Link>
          </p>
        </div>
      </form>
    </AuthSplitShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F2E9]" />}>
      <SignUpContent />
    </Suspense>
  );
}

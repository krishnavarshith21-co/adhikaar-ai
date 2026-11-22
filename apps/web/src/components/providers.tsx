"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { FloatingChat } from "@/components/assistant/floating-chat";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <FloatingChat />
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}


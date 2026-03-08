"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BudgetProvider } from "@/context/BudgetContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  // Use a placeholder client ID if not available in env to prevent build crashes
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "placeholder-client-id.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <BudgetProvider>{children}</BudgetProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import toast from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error: any) => {
            console.error("Query Error:", error);
            toast.error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            console.error("Mutation Error:", error);
            toast.error(error.message || "เกิดข้อผิดพลาดในการดำเนินการ");
          },
        }),
      }),
  );

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "placeholder-client-id.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <BudgetProvider>{children}</BudgetProvider>
          </UIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

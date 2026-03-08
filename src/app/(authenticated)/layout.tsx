"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { useBudget } from "@/context/BudgetContext";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useBudget();

  return (
    <div
      className="flex h-screen overflow-hidden text-gray-800"
      style={{ backgroundColor: "var(--surface-page)" }}
    >
      <Sidebar />
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? "80px" : "260px" }}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import BudgetCategoriesManager from "@/components/features/budget/BudgetCategoriesManager";

export default function BudgetPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <BudgetCategoriesManager />
    </div>
  );
}

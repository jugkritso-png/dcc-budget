
'use client'

import { BudgetCategories } from '@/components/features/BudgetCategories'

export default function BudgetPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">การจัดการงบประมาณ</h1>
                    <p className="text-gray-500 mt-1">จัดการหมวดหมู่และกิจกรรมงบประมาณ</p>
                </div>
            </div>
            <BudgetCategories />
        </div>
    )
}

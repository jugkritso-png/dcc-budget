'use client'

import React from 'react'
import BudgetRequestList from '@/components/features/requests/BudgetRequestList'

export default function RequestsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">รายการคำขอทั้งหมด</h1>
                    <p className="text-gray-500 mt-1">ติดตามสถานะและดำเนินการอนุมัติคำขอใช้งบประมาณ</p>
                </div>
            </div>
            <BudgetRequestList />
        </div>
    )
}

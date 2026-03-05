
'use client'

import React from 'react'
import AnalyticsDashboard from '@/components/features/AnalyticsDashboard'

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">วิเคราะห์งบประมาณ</h1>
                <p className="text-gray-500">ติดตามและวิเคราะห์ข้อมูลการใช้งบประมาณในเชิงลึก</p>
            </div>
            <AnalyticsDashboard />
        </div>
    )
}

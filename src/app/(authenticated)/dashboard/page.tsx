
'use client'

import { useBudget } from '@/context/BudgetContext'
import { StatCard } from '@/components/shared/StatCard'
import { Wallet, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import AnalyticsDashboard from '@/components/features/analytics/AnalyticsDashboard'

export default function DashboardPage() {
    const { getDashboardStats, user } = useBudget()
    const stats = getDashboardStats()

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[28px] md:text-[32px] font-extrabold text-gray-900 tracking-tight">ภาพรวมงบประมาณ</h1>
                    <div className="flex items-center gap-2 mt-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <p className="text-[14px] font-medium text-gray-500">สิทธิ์การใช้งาน: <span className="font-bold text-gray-900">{user?.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'เจ้าหน้าที่ (Staff)'}</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <StatCard
                    title="งบประมาณทั้งหมด"
                    value={stats.totalBudget}
                    icon={Wallet}
                    trend={0}
                    type="primary"
                />
                <StatCard
                    title="ใช้ไปแล้ว"
                    value={stats.totalUsed}
                    icon={CheckCircle}
                    trend={stats.usagePercentage}
                    type="success"
                />
                <StatCard
                    title="รออนุมัติ"
                    value={stats.totalPending}
                    icon={Clock}
                    type="warning"
                />
                <StatCard
                    title="คงเหลือ"
                    value={stats.totalRemaining}
                    icon={AlertTriangle}
                    type="info"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <AnalyticsDashboard />
            </div>
        </div>
    )
}

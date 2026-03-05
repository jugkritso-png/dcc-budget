
'use client'

import { useBudget } from '@/context/BudgetContext'
import { StatCard } from '@/components/shared/StatCard'
import { Wallet, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import AnalyticsDashboard from '@/components/features/AnalyticsDashboard'

export default function DashboardPage() {
    const { getDashboardStats, user } = useBudget()
    const stats = getDashboardStats()

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">แผงพอร์ตโฟลิโองบประมาณ</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">สถานะปัจจุบันของคุณ: {user?.role === 'admin' ? 'ผู้บริหารสูงสุด' : 'สมาชิกในทีม'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

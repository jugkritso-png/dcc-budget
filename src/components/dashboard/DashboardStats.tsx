import React from 'react';
import { CreditCard, Wallet, FileCheck, TrendingDown, ArrowLeftRight, Percent } from 'lucide-react';
import { Card } from '../ui/Card';

interface DashboardStatsProps {
    stats: {
        totalBudget: number;
        totalRemaining: number;
        totalPending: number;
        totalActual?: number;
        usagePercentage: number;
    };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    // Helper to format currency
    const fmtShort = (num: number) => {
        if (num >= 1000000) {
            return `฿${(num / 1000000).toFixed(2)}M`;
        }
        return `฿${num.toLocaleString()}`;
    };

    return (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            {/* 1. Total Budget */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <CreditCard size={16} className="text-primary-600 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalBudget)}</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">งบประมาณรวม</p>
                </div>
            </Card>

            {/* 2. Remaining */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <Wallet size={16} className="text-teal-600 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalRemaining)}</p>
                    <p className="text-[10px] md:text-xs text-teal-600 font-bold mt-0.5 md:mt-1">คงเหลือใช้ได้</p>
                </div>
            </Card>

            {/* 3. Pending */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <FileCheck size={16} className="text-primary-600 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalPending)}</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">รอการอนุมัติ</p>
                </div>
            </Card>

            {/* 4. Approved */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <TrendingDown size={16} className="text-primary-900 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalActual || 0)}</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">อนุมัติแล้ว</p>
                </div>
            </Card>

            {/* 5. Refund/Return */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                        <ArrowLeftRight size={16} className="text-orange-600 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">฿0</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">งบรอเรียกคืน</p>
                </div>
            </Card>

            {/* 6. Percentage */}
            <Card interactive className="p-3 md:p-5 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="p-1.5 md:p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                        <Percent size={16} className="text-rose-600 md:w-5 md:h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{stats.usagePercentage.toFixed(1)}%</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">อัตราการเบิกจ่าย</p>
                </div>
            </Card>
        </div>
    );
};

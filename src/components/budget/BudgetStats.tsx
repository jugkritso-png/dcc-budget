
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, CheckCircle2, FileCheck2, BarChart } from 'lucide-react';
import { BudgetRequest } from '../../types';

interface BudgetStatsProps {
    requests: BudgetRequest[];
}

export const BudgetStats: React.FC<BudgetStatsProps> = ({ requests }) => {
    // Calculate Summary Stats
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const pendingAmount = requests.filter(r => r.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const approvedAmount = requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);

    const waitingCount = requests.filter(r => r.status === 'waiting_verification').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    const totalCount = requests.length;
    const totalAmount = requests.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Pending */}
            <Card interactive className="p-4 md:p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="p-2 md:p-3 bg-amber-50 rounded-xl md:rounded-2xl text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                        <Clock size={18} className="md:w-6 md:h-6" />
                    </div>
                    <Badge variant="warning">รออนุมัติ</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-0.5 md:mb-1">{pendingCount} <span className="text-xs md:text-sm text-gray-400 font-medium">รายการ</span></h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">มูลค่า <span className="text-amber-600">฿{pendingAmount.toLocaleString()}</span></p>
            </Card>

            {/* Approved */}
            <Card interactive className="p-4 md:p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="p-2 md:p-3 bg-emerald-50 rounded-xl md:rounded-2xl text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                        <CheckCircle2 size={18} className="md:w-6 md:h-6" />
                    </div>
                    <Badge variant="success">อนุมัติแล้ว</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-0.5 md:mb-1">{approvedCount} <span className="text-xs md:text-sm text-gray-400 font-medium">รายการ</span></h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">มูลค่า <span className="text-emerald-600">฿{approvedAmount.toLocaleString()}</span></p>
            </Card>

            {/* Waiting Verification (Reporting) */}
            <Card interactive className="p-4 md:p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="p-2 md:p-3 bg-blue-50 rounded-xl md:rounded-2xl text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                        <FileCheck2 size={18} className="md:w-6 md:h-6" />
                    </div>
                    <Badge variant="info">รายงานผล</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-0.5 md:mb-1">{waitingCount} <span className="text-xs md:text-sm text-gray-400 font-medium">รายการ</span></h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">รายงานผลแล้ว: {completedCount}</p>
            </Card>

            {/* Total */}
            <Card interactive className="p-4 md:p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="p-2 md:p-3 bg-primary-50 rounded-xl md:rounded-2xl text-primary-600 border border-primary-100 group-hover:bg-primary-100 transition-colors">
                        <BarChart size={18} className="md:w-6 md:h-6" />
                    </div>
                    <Badge variant="default">ทั้งหมด</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-0.5 md:mb-1">{totalCount} <span className="text-xs md:text-sm text-gray-400 font-medium">รายการ</span></h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">มูลค่า <span className="text-primary-600">฿{totalAmount.toLocaleString()}</span></p>
            </Card>
        </div>
    );
};

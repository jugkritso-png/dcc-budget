import React from 'react';
import { Folder, DollarSign, PieChart, Layers } from 'lucide-react';
import { Category } from '../../types';

interface ManagementHeaderProps {
    totalAllocated: number;
    totalRemaining: number;
    categoriesCount: number;
    selectedYear: number;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
    totalAllocated,
    totalRemaining,
    categoriesCount,
    selectedYear
}) => {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-1 md:px-0">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">การจัดการงบประมาณ</h2>
                    <p className="text-gray-500 text-sm">บริหารโครงสร้างและวางแผนงบประมาณประจำปี</p>
                </div>
            </div>

            {/* Category Header Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                <div className="absolute right-0 top-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute left-0 bottom-0 w-32 md:w-48 h-32 md:h-48 bg-blue-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/15 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20">
                        <Folder size={28} className="text-white md:w-10 md:h-10" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 tracking-tight">หมวดหมู่งบประมาณ</h2>
                        <p className="text-blue-100 font-medium text-sm md:text-lg opacity-90">บริหารจัดการโครงสร้างและติดตามงบ</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 mt-4 md:mt-6">
                {/* Total Budget - Blue Gradient */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <DollarSign size={120} className="md:w-[180px] md:h-[180px]" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10">
                                <DollarSign className="text-white w-5 h-5 md:w-7 md:h-7" />
                            </div>
                            <span className="bg-blue-800/40 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold border border-white/10">
                                {selectedYear}
                            </span>
                        </div>
                        <div>
                            <p className="text-blue-100 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider">งบประมาณทั้งหมด</p>
                            <h3 className="text-2xl md:text-4xl font-bold tracking-tight !text-white">฿{totalAllocated.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Remaining - Teal/Accent Gradient */}
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <PieChart size={120} className="md:w-[180px] md:h-[180px]" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10 w-fit">
                                <PieChart className="text-white w-5 h-5 md:w-7 md:h-7" />
                            </div>
                        </div>
                        <div>
                            <p className="text-teal-50 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider">คงเหลือจริง</p>
                            <h3 className="text-2xl md:text-4xl font-bold tracking-tight !text-white">฿{totalRemaining.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Total Categories - Purple/Indigo Gradient */}
                <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-500 to-primary-800 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <Layers size={120} className="md:w-[180px] md:h-[180px]" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[80px] md:min-h-[140px]">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10 w-fit">
                                <Layers className="text-white w-5 h-5 md:w-7 md:h-7" />
                            </div>
                        </div>
                        <div>
                            <p className="text-indigo-100 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider">หมวดหมู่ทั้งหมด</p>
                            <h3 className="text-2xl md:text-4xl font-bold tracking-tight !text-white">{categoriesCount} หมวด</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagementHeader;

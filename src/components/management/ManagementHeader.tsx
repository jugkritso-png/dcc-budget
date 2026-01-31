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
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">การจัดการงบประมาณ</h2>
                    <p className="text-gray-500">บริหารโครงสร้างและวางแผนงบประมาณประจำปี</p>
                </div>
            </div>

            {/* Category Header Card */}
            <div className="bg-gradient-primary rounded-3xl p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                        <Folder size={40} className="text-white drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">หมวดหมู่งบประมาณ</h2>
                        <p className="text-blue-100 font-medium text-lg opacity-90">บริหารจัดการโครงสร้างและติดตามการใช้งบประมาณ</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-6">
                {/* Total Budget - Blue Gradient */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10">
                                <DollarSign className="text-white w-7 h-7" />
                            </div>
                            <span className="bg-blue-800/40 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
                                {selectedYear}
                            </span>
                        </div>
                        <div>
                            <p className="text-blue-100 font-medium mb-1 text-sm uppercase tracking-wider">งบประมาณทั้งหมด</p>
                            <h3 className="text-4xl font-bold tracking-tight text-shadow-sm !text-white">฿{totalAllocated.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Remaining - Teal/Accent Gradient */}
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-6 rounded-3xl shadow-card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <PieChart size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10 w-fit">
                                <PieChart className="text-white w-7 h-7" />
                            </div>
                        </div>
                        <div>
                            <p className="text-teal-50 font-medium mb-1 text-sm uppercase tracking-wider">คงเหลือจริง</p>
                            <h3 className="text-4xl font-bold tracking-tight text-shadow-sm !text-white">฿{totalRemaining.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Total Categories - Purple/Indigo Gradient */}
                <div className="bg-gradient-to-br from-indigo-500 to-primary-800 text-white p-6 rounded-3xl shadow-card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <Layers size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10 w-fit">
                                <Layers className="text-white w-7 h-7" />
                            </div>
                        </div>
                        <div>
                            <p className="text-indigo-100 font-medium mb-1 text-sm uppercase tracking-wider">หมวดหมู่ทั้งหมด</p>
                            <h3 className="text-4xl font-bold tracking-tight text-shadow-sm !text-white">{categoriesCount} หมวด</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagementHeader;

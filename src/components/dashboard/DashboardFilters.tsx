import React from 'react';
import { Search } from 'lucide-react';

interface DashboardFiltersProps {
    categorySearchTerm: string;
    setCategorySearchTerm: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
    fundFilter: string;
    setFundFilter: (value: string) => void;
    usageFilter: string;
    setUsageFilter: (value: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    categorySearchTerm,
    setCategorySearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fundFilter,
    setFundFilter,
    usageFilter,
    setUsageFilter,
}) => {
    return (
        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6 space-y-4">
            {/* Row 1: Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="ค้นหาหมวดหมู่ หรือ รหัส..."
                        className="pl-10 w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm h-10"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Row 2: Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">ช่วงเวลา:</span>
                    <input
                        type="date"
                        className="rounded-lg border-gray-200 text-xs h-9 w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        className="rounded-lg border-gray-200 text-xs h-9 w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {/* Fund Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">แหล่งเงิน:</span>
                    <select
                        className="rounded-lg border-gray-200 text-xs h-9 w-full"
                        value={fundFilter}
                        onChange={(e) => setFundFilter(e.target.value)}
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="internal">เงินรายได้ (Internal)</option>
                        <option value="external">เงินงบประมาณ (External)</option>
                    </select>
                </div>

                {/* Usage Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">สถานะ:</span>
                    <select
                        className="rounded-lg border-gray-200 text-xs h-9 w-full"
                        value={usageFilter}
                        onChange={(e) => setUsageFilter(e.target.value)}
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="critical">วิกฤต (&gt;80%)</option>
                        <option value="warning">ปานกลาง (&gt;50% - 80%)</option>
                        <option value="normal">ปกติ (&lt;50%)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

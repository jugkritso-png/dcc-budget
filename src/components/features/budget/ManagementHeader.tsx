import React from "react";
import { Folder, DollarSign, PieChart, Layers } from "lucide-react";
import { Category } from "@/types";

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
  selectedYear,
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-1 md:px-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            การจัดการงบประมาณ
          </h2>
          <p className="text-gray-500 text-sm">
            บริหารโครงสร้างและวางแผนงบประมาณประจำปี
          </p>
        </div>
      </div>

      {/* Category Header Card */}
      <div className="bg-gradient-to-br from-[#0066B3] to-[#00427A] rounded-[24px] p-6 md:p-10 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mt-6">
        <div className="absolute right-0 top-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute left-0 bottom-0 w-32 md:w-48 h-32 md:h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-[16px] md:rounded-[20px] flex items-center justify-center border border-white/20 shadow-inner">
            <Folder size={28} className="text-white md:w-10 md:h-10" />
          </div>
          <div>
            <h2 className="text-2xl md:text-[32px] font-extrabold mb-1 md:mb-2 tracking-tight drop-shadow-sm">
              หมวดหมู่งบประมาณ
            </h2>
            <p className="text-blue-50 font-medium text-sm md:text-base opacity-95">
              บริหารจัดการโครงสร้างและติดตามงบ
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4 md:mt-6">
        {/* Total Budget - Blue Gradient */}
        <div className="bg-gradient-to-br from-[#00A1E4] to-[#0074B7] text-white p-5 md:p-8 rounded-[24px] shadow-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <DollarSign size={120} className="md:w-[180px] md:h-[180px]" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="p-2.5 md:p-3.5 bg-white/20 backdrop-blur-sm rounded-[16px] border border-white/20">
                <DollarSign className="text-white w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                {selectedYear}
              </span>
            </div>
            <div>
              <p className="text-blue-50 font-bold mb-1 text-xs md:text-sm uppercase tracking-wider opacity-90">
                งบประมาณทั้งหมด
              </p>
              <h3 className="text-2xl md:text-[40px] font-extrabold tracking-tight !text-white leading-none">
                ฿{totalAllocated.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Remaining - Teal/Accent Gradient */}
        <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-5 md:p-8 rounded-[24px] shadow-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <PieChart size={120} className="md:w-[180px] md:h-[180px]" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="p-2.5 md:p-3.5 bg-white/20 backdrop-blur-sm rounded-[16px] border border-white/20 w-fit">
                <PieChart className="text-white w-6 h-6 md:w-7 md:h-7" />
              </div>
            </div>
            <div>
              <p className="text-teal-50 font-bold mb-1 text-xs md:text-sm uppercase tracking-wider opacity-90">
                คงเหลือจริง
              </p>
              <h3 className="text-2xl md:text-[40px] font-extrabold tracking-tight !text-white leading-none">
                ฿{totalRemaining.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Total Categories - Purple/Indigo Gradient */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-500 to-[#005191] text-white p-5 md:p-8 rounded-[24px] shadow-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Layers size={120} className="md:w-[180px] md:h-[180px]" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[80px] md:min-h-[140px]">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="p-2.5 md:p-3.5 bg-white/20 backdrop-blur-sm rounded-[16px] border border-white/20 w-fit">
                <Layers className="text-white w-6 h-6 md:w-7 md:h-7" />
              </div>
            </div>
            <div>
              <p className="text-indigo-100 font-bold mb-1 text-xs md:text-sm uppercase tracking-wider opacity-90">
                หมวดหมู่ทั้งหมด
              </p>
              <h3 className="text-2xl md:text-[40px] font-extrabold tracking-tight !text-white leading-none">
                {categoriesCount}{" "}
                <span className="text-xl md:text-2xl font-bold">หมวด</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagementHeader;

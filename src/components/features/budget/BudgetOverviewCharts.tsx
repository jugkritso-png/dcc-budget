"use client";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface BudgetOverviewChartsProps {
  categories: any[];
}

const BudgetOverviewCharts: React.FC<BudgetOverviewChartsProps> = ({
  categories,
}) => {
  const [viewMode, setViewMode] = useState<"allocated" | "remaining">("allocated");
  const [selectedCatId, setSelectedCatId] = useState<string>("all");

  // 1. Data for Budget Distribution (By Category)
  const distributionData = categories
    .filter((cat) => cat.allocated > 0)
    .map((cat) => ({
      name: cat.name,
      allocated: cat.allocated,
      remaining: Math.max(0, cat.allocated - (cat.used || 0) - (cat.reserved || 0)),
      value: viewMode === "allocated" ? cat.allocated : Math.max(0, cat.allocated - (cat.used || 0) - (cat.reserved || 0)),
    }))
    .sort((a, b) => b.value - a.value);

  // 2. Data for Utilization Status (Filtered by category if selected)
  const filteredCategories = selectedCatId === "all" 
    ? categories 
    : categories.filter(c => c.id === selectedCatId);

  const totalAllocated = filteredCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalUsed = filteredCategories.reduce((sum, cat) => sum + (cat.used || 0), 0);
  const totalReserved = filteredCategories.reduce(
    (sum, cat) => sum + (cat.reserved || 0),
    0,
  );
  const totalRemaining = Math.max(0, totalAllocated - totalUsed - totalReserved);

  const utilizationData = [
    { name: "ใช้ไปแล้ว (Used)", value: totalUsed, color: "#10B981" }, // Emerald-500
    { name: "สำรอง/อนุมัติ (Reserved)", value: totalReserved, color: "#3B82F6" }, // Blue-500
    { name: "คงเหลือ (Remaining)", value: totalRemaining, color: "#F3F4F6" }, // Gray-100
  ].filter((item) => item.value > 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-2xl min-w-[200px]">
          <p className="text-sm font-black text-gray-900 mb-2 border-b border-gray-100 pb-1">{data.name}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">งบจัดสรร:</span>
              <span className="font-bold text-gray-900">฿{(data.allocated || payload[0].value).toLocaleString()}</span>
            </div>
            {data.remaining !== undefined && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-600">คงเหลือ:</span>
                <span className="font-extrabold text-emerald-700">฿{data.remaining.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[10px] pt-1 text-gray-400">
              <span>สัดส่วน:</span>
              <span>{((payload[0].value / (totalAllocated || 1)) * 100).toFixed(1)}% ของทั้งหมด</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CATEGORY_COLORS = [
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F97316", // Orange
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 shadow-card"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            สัดส่วนงบประมาณตามหมวดหมู่
          </h4>
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("allocated")}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewMode === "allocated" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              งบจัดสรร
            </button>
            <button
              onClick={() => setViewMode("remaining")}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewMode === "remaining" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              งบคงเหลือ
            </button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
                label={({ percent }) => (percent ? `${(percent * 100).toFixed(0)}%` : "")}
                labelLine={false}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    stroke="rgba(255,255,255,0.2)"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                iconType="circle"
                formatter={(value, entry: any) => (
                  <div className="inline-flex items-center justify-between w-[180px] py-1">
                    <span className="text-[11px] font-medium text-gray-600 truncate max-w-[90px]">{value}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${viewMode === 'allocated' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      ฿{entry.payload.value.toLocaleString()}
                    </span>
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 shadow-card"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            {selectedCatId === "all" ? "ภาพรวมสถานะการใช้งบประมาณ" : "สถานะการใช้งบประมาณรายหมวดหมู่"}
          </h4>
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="text-[10px] font-bold bg-gray-100/50 border border-gray-200/50 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">ทุกหมวดหมู่ (All)</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                animationBegin={200}
                animationDuration={1500}
                label={({ percent }) => (percent ? `${(percent * 100).toFixed(0)}%` : "")}
                labelLine={false}
              >
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.2)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-[11px] font-bold text-gray-700 mr-2">
                    {value}: <span className="text-blue-600">฿{entry.payload.value.toLocaleString()}</span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetOverviewCharts;

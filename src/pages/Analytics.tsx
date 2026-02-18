import React, { useState } from 'react';
import BudgetReport from '../components/BudgetReport';
import { BarChart2, Calendar, PieChart } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import BudgetPlanning from '../components/BudgetPlanning';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'planning' | 'report'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 px-4 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">วิเคราะห์ข้อมูล</h2>
          <p className="text-gray-500 mt-1 md:mt-2 text-sm">รายงานเชิงลึกและแนวโน้มการใช้จ่ายงบประมาณ</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100/80 p-1.5 rounded-xl flex flex-col md:flex-row shadow-inner border border-gray-200/50 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'overview'
              ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5 transform scale-100'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            <BarChart2 size={18} />
            ภาพรวม
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'report'
              ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5 transform scale-100'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            <PieChart size={18} />
            รายงานผลการใช้จ่าย
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'planning'
              ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5 transform scale-100'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            <Calendar size={18} />
            วางแผนงบประมาณ
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' ? (
        <AnalyticsDashboard />
      ) : activeTab === 'report' ? (
        <BudgetReport />
      ) : (
        <BudgetPlanning />
      )}

    </div>
  );
};

export default Analytics;
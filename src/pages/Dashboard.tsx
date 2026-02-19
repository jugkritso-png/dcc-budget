import React, { useState } from 'react';
import { Wallet, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useBudget } from '../context/BudgetContext';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { DashboardCategoryList } from '../components/dashboard/DashboardCategoryList';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';

const Dashboard: React.FC = () => {
  const { getDashboardStats, categories, requests, settings } = useBudget();
  const stats = getDashboardStats();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter States
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [usageFilter, setUsageFilter] = useState('all'); // all, critical, warning, normal
  const [fundFilter, setFundFilter] = useState('all'); // all, internal, external
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper to format currency (used in Hero)
  const fmtShort = (num: number) => {
    if (num >= 1000000) {
      return `฿${(num / 1000000).toFixed(2)}M`;
    }
    return `฿${num.toLocaleString()}`;
  };

  // 1. Filter Categories based on Fiscal Year and Search/Fund inputs
  const baseCategories = categories.filter(cat => {
    const matchesYear = cat.year === settings.fiscalYear;
    const matchesSearch = cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(categorySearchTerm.toLowerCase());
    const matchesFund = fundFilter === 'all' ||
      (fundFilter === 'internal' && cat.fund === 'I') ||
      (fundFilter === 'external' && cat.fund === 'E');

    return matchesYear && matchesSearch && matchesFund;
  });

  // 2. Process Categories to calculate usage (considering date range)
  const processedCategories = baseCategories.map(cat => {
    // Filter requests by date if range is set
    const categoryRequests = requests.filter(r => {
      if (r.category !== cat.name) return false;
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });

    const catApprovedAmount = categoryRequests
      .filter(r => ['approved', 'waiting_verification', 'completed'].includes(r.status))
      .reduce((sum, r) => sum + r.amount, 0);

    const catPending = categoryRequests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    // Usage % is calculated against the TOTAL annual allocated budget
    // Even if we filter Approved Amount by date, the Allocated is usually annual.
    const percent = cat.allocated > 0 ? (catApprovedAmount / cat.allocated) * 100 : 0;
    const catRemaining = cat.allocated - catApprovedAmount;

    return {
      ...cat,
      catApprovedAmount,
      catPending,
      catRemaining,
      percent
    };
  });

  // 3. Apply Usage Filter
  const displayCategories = processedCategories.filter(cat => {
    if (usageFilter === 'all') return true;
    if (usageFilter === 'critical') return cat.percent > 80;
    if (usageFilter === 'warning') return cat.percent > 50 && cat.percent <= 80;
    if (usageFilter === 'normal') return cat.percent <= 50;
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 mx-0">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent-500/15 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-primary-400/20 rounded-full blur-[60px] -ml-10 -mb-10"></div>

        <div className="relative z-10 p-5 md:p-10">
          {/* Header row */}
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/15 rounded-xl border border-white/20">
                <Wallet className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-3xl font-bold text-white">ภาพรวมงบประมาณ</h2>
                <p className="text-white/70 text-xs md:text-base">ปี {settings.fiscalYear}</p>
              </div>
            </div>
            <span className="hidden md:inline-block px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium border border-white/10">
              ข้อมูลล่าสุด ณ วันนี้
            </span>
          </div>

          {/* Stats grid - 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white/10 rounded-xl p-3 md:p-4">
              <p className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">งบประมาณทั้งหมด</p>
              <p className="text-xl md:text-4xl font-bold text-white mt-1">{fmtShort(stats.totalBudget)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 md:p-4">
              <p className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">คงเหลือสุทธิ</p>
              <p className="text-xl md:text-4xl font-bold text-emerald-300 mt-1">{fmtShort(stats.totalRemaining)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 md:p-4">
              <p className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">รออนุมัติ</p>
              <p className="text-xl md:text-4xl font-bold text-yellow-300 mt-1">{fmtShort(stats.totalPending)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 md:p-4">
              <p className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">อนุมัติแล้ว</p>
              <p className="text-xl md:text-4xl font-bold text-white/90 mt-1">{fmtShort((stats as any).totalActual || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row (Small Cards) */}
      <DashboardStats stats={stats} />

      {/* Charts Section */}
      <DashboardCharts processedCategories={processedCategories} displayCategories={displayCategories} />

      {/* Budget Categories Grid */}
      <Card className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">สถิติงบประมาณรายหมวดหมู่</h3>
              <p className="text-sm text-gray-400">ภาพรวมการใช้งบจำแนกตามหมวด</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${viewMode === 'grid' ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="มุมมองการ์ด"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${viewMode === 'table' ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="มุมมองตาราง"
            >
              <TableIcon size={18} />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <DashboardFilters
          categorySearchTerm={categorySearchTerm}
          setCategorySearchTerm={setCategorySearchTerm}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          fundFilter={fundFilter}
          setFundFilter={setFundFilter}
          usageFilter={usageFilter}
          setUsageFilter={setUsageFilter}
        />

        <DashboardCategoryList displayCategories={displayCategories} viewMode={viewMode} />
      </Card>
    </div>
  );
};

export default Dashboard;

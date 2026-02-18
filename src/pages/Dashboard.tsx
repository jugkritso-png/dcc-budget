import React, { useState } from 'react';
import { CreditCard, Wallet, FileCheck, TrendingDown, ArrowLeftRight, Percent, LayoutGrid, Table as TableIcon, Folder, PieChart as PieChartIcon, BarChart3, Search } from 'lucide-react';
import { Card } from '../components/ui/Card'; // Use new Design System Card
import { useBudget } from '../context/BudgetContext';
import { getHexColor } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useChartDimensions } from '../hooks/useChartDimensions';

const Dashboard: React.FC = () => {
  const { getDashboardStats, categories, requests, settings } = useBudget();
  const { ref: pieRef, dimensions: pieDim } = useChartDimensions();
  const { ref: barRef, dimensions: barDim } = useChartDimensions();
  const stats = getDashboardStats();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter States
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [usageFilter, setUsageFilter] = useState('all'); // all, critical, warning, normal
  const [fundFilter, setFundFilter] = useState('all'); // all, internal, external
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper to format currency
  const fmt = (num: number) => `฿${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
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
        {/* Background Gradients - simplified for mobile */}
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
            <p className="text-base md:text-2xl font-bold text-gray-800 tracking-tight">{fmtShort((stats as any).totalActual || 0)}</p>
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

      {/* Budget Proportion Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="lg:col-span-1 p-4 md:p-6 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
              <PieChartIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">สัดส่วนงบประมาณ</h3>
              <p className="text-xs text-gray-400">แบ่งตามหมวดหมู่</p>
            </div>
          </div>
          <div ref={pieRef} style={{ width: '100%', height: 240, position: 'relative' }} className="md:!h-[320px]">
            {pieDim.width > 0 && (
              <ResponsiveContainer width="99%" height="100%" minHeight={100} minWidth={0} debounce={100}>
                <PieChart>
                  <Pie
                    data={processedCategories.map(cat => ({
                      name: cat.name,
                      value: cat.allocated,
                      color: cat.color
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {processedCategories.map((cat, index) => (
                      <Cell key={`cell-${index}`} fill={getHexColor(cat.color)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {processedCategories.slice(0, 6).map((cat, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  <span className="text-gray-600 text-xs font-medium truncate">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-900 text-xs">฿{cat.allocated.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Comparison Bar Chart */}
        <Card className="lg:col-span-2 p-4 md:p-6 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">เปรียบเทียบงบประมาณ</h3>
              <p className="text-xs text-gray-400">งบตั้ง vs อนุมัติ vs คงเหลือ</p>
            </div>
          </div>
          <div ref={barRef} style={{ width: '100%', height: 280, position: 'relative' }} className="md:!h-[400px]">
            {barDim.width > 0 && (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart
                  data={displayCategories.map(cat => ({
                    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
                    fullName: cat.name,
                    งบตั้ง: cat.allocated,
                    อนุมัติ: cat.catApprovedAmount,
                    คงเหลือ: cat.catRemaining,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                    labelFormatter={(label) => {
                      const item = displayCategories.find(cat =>
                        cat.name.startsWith(label.replace('...', ''))
                      );
                      return item?.name || label;
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="งบตั้ง" fill="#93C5FD" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="อนุมัติ" fill="#003964" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="คงเหลือ" fill="#00C4CC" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

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

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map(cat => (
              <Card key={cat.id} interactive className="p-6 relative overflow-hidden group">
                {/* Decorative top border */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${cat.color.replace('bg-', 'bg-')}`}></div>

                <div className="flex justify-between items-start mb-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform ${cat.color} bg-opacity-90`}>
                      <Wallet size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{cat.name}</h4>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{cat.code}</span>
                    </div>
                  </div>
                  {/* Fund Badge */}
                  {cat.fund && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${cat.fund === 'I' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-cyan-50 text-cyan-600 border-cyan-100'}`}>
                      {cat.fund === 'I' ? 'รายได้' : 'งบประมาณ'}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">งบประมาณ:</span>
                    <span className="font-bold text-gray-900">{fmt(cat.allocated)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">ขอใช้ (Pending):</span>
                    <span className="font-bold text-orange-500">{fmt(cat.catPending)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">งบที่ได้รับอนุมัติ:</span>
                    <span className="font-bold text-primary-600">{fmt(cat.catApprovedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200/50">
                    <span className="text-gray-900 font-bold">คงเหลือ:</span>
                    <span className="font-bold text-green-600">{fmt(cat.catRemaining)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cat.percent > 80 ? 'text-red-600 bg-red-50' : cat.percent > 50 ? 'text-yellow-600 bg-yellow-50' : 'text-primary-600 bg-primary-50'}`}>
                        {cat.percent > 80 ? 'วิกฤต' : cat.percent > 50 ? 'ปานกลาง' : 'ปกติ'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-600">
                        {cat.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded-full bg-gray-100 shadow-inner">
                    <div style={{ width: `${Math.min(cat.percent, 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${cat.percent > 80 ? 'bg-red-500' : cat.percent > 50 ? 'bg-yellow-500' : 'bg-primary-500'}`}></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-2 pl-6">หมวดหมู่</th>
                  <th className="py-2 text-right">งบตั้ง</th>
                  <th className="py-2 text-right">ขอใช้</th>
                  <th className="py-2 text-right">อนุมัติ</th>
                  <th className="py-2 text-right">คงเหลือ</th>
                  <th className="py-2 px-6 text-center w-32">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {displayCategories.map(cat => (
                  <tr key={cat.id} className="group bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl relative overflow-hidden transform hover:-translate-y-0.5">
                    <td className="py-4 pl-6 align-middle rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-primary-500 bg-white group-hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${cat.color}`}>
                          <Folder size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{cat.name}</div>
                          <div className="flex gap-2">
                            <div className="text-xs text-gray-400 font-medium">{cat.code}</div>
                            {cat.fund && <div className="text-[10px] text-gray-400 font-medium border border-gray-100 rounded px-1">{cat.fund === 'I' ? 'รายได้' : 'งปม.'}</div>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right align-middle font-bold text-gray-700 bg-white group-hover:bg-blue-50/30">{fmt(cat.allocated)}</td>
                    <td className="py-4 text-right align-middle font-medium text-orange-500 bg-white group-hover:bg-blue-50/30">{fmt(cat.catPending)}</td>
                    <td className="py-4 text-right align-middle font-bold text-blue-600 bg-white group-hover:bg-blue-50/30">{fmt(cat.catApprovedAmount)}</td>
                    <td className="py-4 text-right align-middle font-bold text-green-600 bg-white group-hover:bg-blue-50/30">{fmt(cat.catRemaining)}</td>
                    <td className="py-4 px-6 align-middle rounded-r-2xl bg-white group-hover:bg-blue-50/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                          <span>{cat.percent.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${cat.percent > 80 ? 'bg-red-500' : cat.percent > 50 ? 'bg-yellow-500' : 'bg-primary-500'}`}
                            style={{ width: `${Math.min(cat.percent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;

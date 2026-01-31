import React, { useState } from 'react';
import { CreditCard, Wallet, FileCheck, TrendingDown, ArrowLeftRight, Percent, LayoutGrid, Table as TableIcon, Folder, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/Card'; // Use new Design System Card
import { useBudget } from '../context/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard: React.FC = () => {
  const { getDashboardStats, categories, requests, settings } = useBudget();
  const stats = getDashboardStats();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter categories for display based on settings
  const displayCategories = categories.filter(cat => cat.year === settings.fiscalYear);

  // Helper to format currency
  const fmt = (num: number) => `฿${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const fmtShort = (num: number) => {
    if (num >= 1000000) {
      return `฿${(num / 1000000).toFixed(2)}M`;
    }
    return `฿${num.toLocaleString()}`;
  };

  // Color mapping function to convert Tailwind classes to hex colors
  const getHexColor = (colorClass: string): string => {
    const colorMap: Record<string, string> = {
      'bg-red-500': '#EF4444',
      'bg-red-600': '#DC2626',
      'bg-blue-500': '#3B82F6',
      'bg-blue-600': '#2563EB',
      'bg-green-500': '#10B981',
      'bg-green-600': '#059669',
      'bg-yellow-500': '#F59E0B',
      'bg-yellow-600': '#D97706',
      'bg-purple-500': '#8B5CF6',
      'bg-purple-600': '#7C3AED',
      'bg-pink-500': '#EC4899',
      'bg-pink-600': '#DB2777',
      'bg-indigo-500': '#6366F1',
      'bg-indigo-600': '#4F46E5',
      'bg-teal-500': '#14B8A6',
      'bg-teal-600': '#0D9488',
      'bg-orange-500': '#F97316',
      'bg-orange-600': '#EA580C',
      'bg-cyan-500': '#06B6D4',
      'bg-cyan-600': '#0891B2',
      'bg-emerald-500': '#10B981',
      'bg-emerald-600': '#059669',
      'bg-rose-500': '#F43F5E',
      'bg-rose-600': '#E11D48',
      'bg-violet-500': '#8B5CF6',
      'bg-violet-600': '#7C3AED',
      'bg-fuchsia-500': '#D946EF',
      'bg-fuchsia-600': '#C026D3',
      'bg-lime-500': '#84CC16',
      'bg-lime-600': '#65A30D',
    };
    return colorMap[colorClass] || '#3B82F6'; // Default to blue if not found
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">แดชบอร์ดภาพรวม</h2>
          <p className="text-gray-500 mt-1 font-medium">ติดตามและบริหารจัดการงบประมาณแบบ Real-time</p>
        </div>
        <div className="bg-white text-primary-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-soft border border-primary-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          ปีงบประมาณ {settings.fiscalYear}
        </div>
      </div>

      {/* Hero Section with Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-primary-900">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/30 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-10">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl shadow-inner border border-white/20">
                <Wallet className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">ภาพรวมงบประมาณ</h2>
                <p className="text-white/90 text-lg">ปีงบประมาณ {settings.fiscalYear}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
                ข้อมูลล่าสุด ณ วันนี้
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Budget */}
            <div className="space-y-2 group cursor-default">
              <p className="text-white/80 font-medium text-sm uppercase tracking-wider group-hover:text-white transition-colors">งบประมาณทั้งหมด</p>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight text-shadow-sm">{fmt(stats.totalBudget)}</p>
            </div>

            {/* Remaining */}
            <div className="space-y-2 group cursor-default">
              <p className="text-white/80 font-medium text-sm uppercase tracking-wider group-hover:text-white transition-colors">คงเหลือสุทธิ</p>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight text-shadow-sm">{fmt(stats.totalRemaining)}</p>
            </div>

            {/* Pending */}
            <div className="space-y-2 group cursor-default">
              <p className="text-white/80 font-medium text-sm uppercase tracking-wider group-hover:text-white transition-colors">รออนุมัติ</p>
              <p className="text-4xl md:text-5xl font-bold text-yellow-300 tracking-tight text-shadow-sm">{fmt(stats.totalPending)}</p>
            </div>

            {/* Used */}
            <div className="space-y-2 group cursor-default">
              <p className="text-white/80 font-medium text-sm uppercase tracking-wider group-hover:text-white transition-colors">ใช้จ่ายจริง</p>
              <p className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight text-shadow-sm">{fmt(stats.totalUsed)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row (Small Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Budget */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <CreditCard size={20} className="text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalBudget)}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">งบประมาณรวม</p>
          </div>
        </Card>

        {/* 2. Remaining */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <Wallet size={20} className="text-teal-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalRemaining)}</p>
            <p className="text-xs text-teal-600 font-bold mt-1">คงเหลือใช้ได้</p>
          </div>
        </Card>

        {/* 3. Pending (Blue for System Processing) */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FileCheck size={20} className="text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalPending)}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">รอการอนุมัติ</p>
          </div>
        </Card>

        {/* 4. Used (Dark Blue for Actual) */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <TrendingDown size={20} className="text-blue-900" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">{fmtShort(stats.totalUsed)}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">ใช้จ่ายจริงแล้ว</p>
          </div>
        </Card>

        {/* 5. Refund/Return (Placeholder) */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <ArrowLeftRight size={20} className="text-orange-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">฿0</p>
            <p className="text-xs text-gray-400 font-medium mt-1">งบรอเรียกคืน</p>
          </div>
        </Card>

        {/* 6. Percentage */}
        <Card interactive className="p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <Percent size={20} className="text-rose-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.usagePercentage.toFixed(1)}%</p>
            <p className="text-xs text-gray-400 font-medium mt-1">อัตราการเบิกจ่าย</p>
          </div>
        </Card>
      </div>

      {/* Budget Proportion Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="lg:col-span-1 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <PieChartIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">สัดส่วนงบประมาณ</h3>
              <p className="text-xs text-gray-400">แบ่งตามหมวดหมู่</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayCategories.map(cat => ({
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
                  {displayCategories.map((cat, index) => (
                    <Cell key={`cell-${index}`} fill={getHexColor(cat.color)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {displayCategories.slice(0, 6).map((cat, index) => (
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
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">เปรียบเทียบงบประมาณ</h3>
              <p className="text-xs text-gray-400">งบตั้ง vs ใช้จริง vs คงเหลือ</p>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayCategories.map(cat => {
                  const catUsed = requests
                    .filter(r => r.category === cat.name && r.status === 'approved')
                    .reduce((sum, r) => sum + r.amount, 0);
                  const catRemaining = cat.allocated - catUsed;

                  return {
                    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
                    fullName: cat.name,
                    งบตั้ง: cat.allocated,
                    ใช้จริง: catUsed,
                    คงเหลือ: catRemaining,
                  };
                })}
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
                <Bar dataKey="ใช้จริง" fill="#003964" radius={[8, 8, 0, 0]} />
                <Bar dataKey="คงเหลือ" fill="#00C4CC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Budget Categories Grid */}
      <Card className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
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

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map(cat => {
              // Calculate usage per category
              const catUsed = requests
                .filter(r => r.category === cat.name && r.status === 'approved')
                .reduce((sum, r) => sum + r.amount, 0);
              const catPending = requests
                .filter(r => r.category === cat.name && r.status === 'pending')
                .reduce((sum, r) => sum + r.amount, 0);
              const catRemaining = cat.allocated - catUsed;
              const percent = cat.allocated > 0 ? (catUsed / cat.allocated) * 100 : 0;

              return (
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
                  </div>

                  <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">งบประมาณ:</span>
                      <span className="font-bold text-gray-900">{fmt(cat.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">ขอใช้ (Pending):</span>
                      <span className="font-bold text-orange-500">{fmt(catPending)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">ใช้จริง:</span>
                      <span className="font-bold text-blue-600">{fmt(catUsed)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200/50">
                      <span className="text-gray-900 font-bold">คงเหลือ:</span>
                      <span className="font-bold text-green-600">{fmt(catRemaining)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${percent > 80 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                          {percent > 80 ? 'Critical' : 'Usage'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-600">
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded-full bg-gray-100 shadow-inner">
                      <div style={{ width: `${percent}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${percent > 80 ? 'bg-red-500' : 'bg-primary-500'}`}></div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-2 pl-6">หมวดหมู่</th>
                  <th className="py-2 text-right">งบประมาณ</th>
                  <th className="py-2 text-right">ขอใช้ (Pending)</th>
                  <th className="py-2 text-right">ใช้จริง</th>
                  <th className="py-2 text-right">คงเหลือ</th>
                  <th className="py-2 px-6 text-center w-32">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {displayCategories.map(cat => {
                  const catUsed = requests
                    .filter(r => r.category === cat.name && r.status === 'approved')
                    .reduce((sum, r) => sum + r.amount, 0);
                  const catPending = requests
                    .filter(r => r.category === cat.name && r.status === 'pending')
                    .reduce((sum, r) => sum + r.amount, 0);
                  const catRemaining = cat.allocated - catUsed;
                  const percent = cat.allocated > 0 ? (catUsed / cat.allocated) * 100 : 0;

                  return (
                    <tr key={cat.id} className="group bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl relative overflow-hidden transform hover:-translate-y-0.5">
                      <td className="py-4 pl-6 align-middle rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-primary-500 bg-white group-hover:bg-blue-50/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${cat.color}`}>
                            <Folder size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm">{cat.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{cat.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right align-middle font-bold text-gray-700 bg-white group-hover:bg-blue-50/30">{fmt(cat.allocated)}</td>
                      <td className="py-4 text-right align-middle font-medium text-orange-500 bg-white group-hover:bg-blue-50/30">{fmt(catPending)}</td>
                      <td className="py-4 text-right align-middle font-bold text-blue-600 bg-white group-hover:bg-blue-50/30">{fmt(catUsed)}</td>
                      <td className="py-4 text-right align-middle font-bold text-green-600 bg-white group-hover:bg-blue-50/30">{fmt(catRemaining)}</td>
                      <td className="py-4 px-6 align-middle rounded-r-2xl bg-white group-hover:bg-blue-50/30">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                            <span>{percent.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${percent > 80 ? 'bg-red-500' : 'bg-primary-500'}`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;

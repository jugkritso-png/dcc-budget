
import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Percent, Wallet, FileText, Calculator } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
    const { requests, categories, settings } = useBudget();

    // 1. Calculate Monthly Spending (Actual) vs Planned (Avg)
    const months = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
    const monthlyDataMap = new Map<string, { planned: number, actual: number }>();

    // Initialize
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const avgMonthlyPlan = totalAllocated / 12;

    months.forEach(m => monthlyDataMap.set(m, { planned: avgMonthlyPlan, actual: 0 }));

    // Populate Actual from Approved Requests
    requests.filter(r => r.status === 'approved').forEach(req => {
        const date = new Date(req.date);
        const monthIndex = date.getMonth(); // 0-11 (Jan-Dec)

        // Map to Fiscal Year Index (Oct=0, ..., Sept=11)
        let fiscalIndex = monthIndex - 9;
        if (fiscalIndex < 0) fiscalIndex += 12;

        if (fiscalIndex >= 0 && fiscalIndex < 12) {
            const mName = months[fiscalIndex];
            const current = monthlyDataMap.get(mName)!;
            monthlyDataMap.set(mName, { ...current, actual: current.actual + req.amount });
        }
    });

    const chartData = Array.from(monthlyDataMap.entries()).map(([name, val]) => ({
        name,
        planned: Math.round(val.planned),
        actual: val.actual
    }));

    // 2. Category Breakdown
    const categoryData = categories
        .filter(c => c.used > 0)
        .sort((a, b) => b.used - a.used)
        .slice(0, 4)
        .map(c => ({
            name: c.name,
            amount: c.used,
            totalAllocated: c.allocated
        }));

    // 3. KPI Stats
    const totalUsed = categories.reduce((sum, cat) => sum + cat.used, 0);
    const utilizationRate = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;
    const totalRemaining = totalAllocated - totalUsed;

    // Avg per approved request
    const approvedRequests = requests.filter(r => r.status === 'approved');
    const avgPerRequest = approvedRequests.length > 0 ? totalUsed / approvedRequests.length : 0;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card interactive className="p-5 group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Percent size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">{utilizationRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">อัตราการเบิกจ่ายรวม</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <Calculator size={20} className="text-orange-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">฿{avgPerRequest > 1000000 ? (avgPerRequest / 1000000).toFixed(2) + 'M' : (avgPerRequest / 1000).toFixed(1) + 'K'}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">งบเฉลี่ยต่อโครงการ</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                            <Wallet size={20} className="text-teal-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-teal-600 tracking-tight">฿{totalRemaining > 1000000 ? (totalRemaining / 1000000).toFixed(2) + 'M' : (totalRemaining / 1000).toFixed(0) + 'K'}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">งบประมาณคงเหลือ</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <FileText size={20} className="text-indigo-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">{approvedRequests.length}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">จำนวนโครงการอนุมัติ</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Planned vs Actual Chart */}
                <Card className="p-8 border-gray-100/60">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">เปรียบเทียบแผน vs ผลจริง</h3>
                        <p className="text-sm text-gray-400">แสดงการเปรียบเทียบงบเฉลี่ยรายเดือนกับการใช้จริง</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                barGap={8}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="planned" name="แผน (Planned)" fill="#93C5FD" radius={[6, 6, 6, 6]} barSize={20} />
                                <Bar dataKey="actual" name="ผลจริง (Actual)" fill="#003964" radius={[6, 6, 6, 6]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Trend Line Chart */}
                <Card className="p-8 border-gray-100/60">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">แนวโน้มการใช้จ่ายสะสม</h3>
                        <p className="text-sm text-gray-400">กราฟแสดงยอดการใช้จ่ายสะสมตลอดปีงบประมาณ</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#003964" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#003964" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#003964' }}
                                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                                />
                                <Area type="monotone" dataKey="actual" stroke="#003964" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="p-8 border-gray-100/60">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-800">สัดส่วนหมวดหมู่ที่มีการเบิกจ่ายสูงสุด</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categoryData.length > 0 ? categoryData.map((cat, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="font-bold text-gray-700 group-hover:text-primary-700 transition-colors">{cat.name}</span>
                                <span className="font-bold text-gray-900 border-b-2 border-primary-100 px-1">฿{cat.amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${(cat.amount / cat.totalAllocated) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-[10px] text-gray-400">จากงบ {cat.totalAllocated.toLocaleString()}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center text-gray-400 py-8">ไม่มีข้อมูลการเบิกจ่าย</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;

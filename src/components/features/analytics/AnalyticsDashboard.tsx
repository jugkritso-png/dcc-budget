
import React from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Percent, Wallet, FileText, Calculator, Download, Database, Layers } from 'lucide-react';
import { generateBudgetReport } from '@/utils/reportService';
import { Button } from '@/components/ui/Button';
import { useChartDimensions } from '@/hooks/useChartDimensions';
import { BudgetRequest, Category } from '@/types';

const AnalyticsDashboard: React.FC = () => {
    const { requests, categories, settings, getAllApprovalLogs } = useBudget();
    const { ref: barRef, dimensions: barDim } = useChartDimensions();
    const { ref: areaRef, dimensions: areaDim } = useChartDimensions();

    // 1. Calculate Monthly Spending (Actual) vs Planned (Avg)
    const months = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
    const monthlyDataMap = new Map<string, { planned: number, actual: number }>();

    // Initialize
    const totalAllocated = categories.reduce((sum: number, cat: Category) => sum + cat.allocated, 0);
    const avgMonthlyPlan = totalAllocated / 12;

    months.forEach(m => monthlyDataMap.set(m, { planned: avgMonthlyPlan, actual: 0 }));

    // Populate Actual from Completed Requests (Actual Spent)
    requests.filter((r: BudgetRequest) => r.status === 'completed').forEach((req: BudgetRequest) => {
        const date = new Date(req.date);
        const monthIndex = date.getMonth(); // 0-11 (Jan-Dec)

        // Map to Fiscal Year Index (Oct=0, ..., Sept=11)
        let fiscalIndex = monthIndex - 9;
        if (fiscalIndex < 0) fiscalIndex += 12;

        if (fiscalIndex >= 0 && fiscalIndex < 12) {
            const mName = months[fiscalIndex];
            const current = monthlyDataMap.get(mName)!;
            // Use actualAmount instead of amount (allocated)
            monthlyDataMap.set(mName, { ...current, actual: current.actual + (req.actualAmount || 0) });
        }
    });

    const chartData = Array.from(monthlyDataMap.entries()).map(([name, val]) => ({
        name,
        planned: Math.round(val.planned),
        actual: val.actual
    }));

    // 2. Category Breakdown
    const categoryData = categories
        .filter((c: Category) => c.used > 0)
        .sort((a: Category, b: Category) => b.used - a.used)
        .slice(0, 6)
        .map((c: Category) => ({
            name: c.name,
            amount: c.used,
            totalAllocated: c.allocated,
            code: c.code,
            costCenter: c.costCenter,
            fund: c.fund,
            functionalArea: c.functionalArea
        }));

    // 3. KPI Stats
    const totalUsed = categories.reduce((sum: number, cat: Category) => sum + cat.used, 0);
    const utilizationRate = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;
    const totalRemaining = totalAllocated - totalUsed;

    // 4. SAP Specifics: Internal vs External
    const internalBudget = categories.filter((c: Category) => c.fund === 'I').reduce((sum: number, c: Category) => sum + c.allocated, 0);
    const externalBudget = categories.filter((c: Category) => c.fund === 'E').reduce((sum: number, c: Category) => sum + c.allocated, 0);
    const internalUsed = categories.filter((c: Category) => c.fund === 'I').reduce((sum: number, c: Category) => sum + c.used, 0);
    const externalUsed = categories.filter((c: Category) => c.fund === 'E').reduce((sum: number, c: Category) => sum + c.used, 0);

    // Avg per approved request
    const approvedRequests = requests.filter((r: BudgetRequest) => r.status === 'approved');
    const avgPerRequest = approvedRequests.length > 0 ? totalUsed / approvedRequests.length : 0;

    const engMonths = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    const handleExport = async () => {
        // Fetch all logs for the detailed report
        const allLogs = await getAllApprovalLogs();

        // Map data for report
        const reportMonthly = chartData.map((d, index) => ({
            ...d,
            name: engMonths[index] || d.name
        }));

        generateBudgetReport({
            orgName: settings.orgName,
            fiscalYear: settings.fiscalYear,
            stats: {
                totalBudget: totalAllocated,
                totalUsed,
                totalRemaining,
                utilizationRate
            },
            monthlyData: reportMonthly,
            categoryData: categories.map((c: Category) => ({
                name: c.name,
                amount: c.used,
                totalAllocated: c.allocated,
                costCenter: c.costCenter,
                fund: c.fund,
                functionalArea: c.functionalArea,
                commitmentItem: c.commitmentItem
            })),
            requests: requests.map((r: BudgetRequest) => ({
                ...r,
                categoryData: categories.find((c: Category) => c.name === r.category)
            })),
            approvalLogs: allLogs
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end">
                <Button onClick={handleExport} className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all rounded-[14px] font-semibold">
                    <Download size={18} className="mr-2" />
                    Export Report (PDF)
                </Button>
            </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                            <Percent size={18} className="text-primary-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-none">{utilizationRate.toFixed(1)}%</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">เบิกจ่ายรวม</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <Calculator size={18} className="text-orange-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-none">฿{avgPerRequest > 1000000 ? (avgPerRequest / 1000000).toFixed(1) + 'M' : (avgPerRequest / 1000).toFixed(0) + 'K'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">เฉลี่ยต่อโครงการ</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <Database size={18} className="text-indigo-600" />
                        </div>
                        {internalBudget > 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{((internalUsed / internalBudget) * 100).toFixed(0)}%</span>}
                    </div>
                    <div>
                        <p className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">฿{(internalBudget / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">งบภายใน (Internal)</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                            <Layers size={18} className="text-amber-600" />
                        </div>
                        {externalBudget > 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{((externalUsed / externalBudget) * 100).toFixed(0)}%</span>}
                    </div>
                    <div>
                        <p className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">฿{(externalBudget / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">งบภายนอก (External)</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <Wallet size={18} className="text-emerald-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-emerald-600 tracking-tight leading-none">฿{totalRemaining > 1000000 ? (totalRemaining / 1000000).toFixed(1) + 'M' : (totalRemaining / 1000).toFixed(0) + 'K'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">งบประมาณคงเหลือ</p>
                    </div>
                </Card>

                <Card interactive className="p-5 group flex flex-col justify-between rounded-[20px] shadow-sm hover:shadow-md border-gray-100/60">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <FileText size={18} className="text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-none">{approvedRequests.length}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">โครงการอนุมัติ</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Planned vs Actual Chart */}
                <Card className="p-8 border-gray-100/60 min-w-0 rounded-[24px] shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-[22px] font-extrabold text-gray-900 tracking-tight">เปรียบเทียบแผน vs ผลจริง</h3>
                        <p className="text-sm text-gray-400">แสดงการเปรียบเทียบงบเฉลี่ยรายเดือนกับการใช้จริง</p>
                    </div>
                    <div ref={barRef} style={{ width: '100%', height: 320, position: 'relative' }}>
                        {barDim.width > 0 && (
                            <ResponsiveContainer width="100%" height="100%" debounce={100}>
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
                                        formatter={(value: number | undefined) => `฿${(value || 0).toLocaleString()}`}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="planned" name="แผน (Planned)" fill="var(--color-primary-300)" radius={[6, 6, 6, 6]} barSize={20} />
                                    <Bar dataKey="actual" name="ผลจริง (Actual)" fill="var(--color-primary-600)" radius={[6, 6, 6, 6]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Trend Line Chart */}
                <Card className="p-8 border-gray-100/60 min-w-0 rounded-[24px] shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-[22px] font-extrabold text-gray-900 tracking-tight">แนวโน้มการใช้จ่ายสะสม</h3>
                        <p className="text-sm text-gray-400">กราฟแสดงยอดการใช้จ่ายสะสมตลอดปีงบประมาณ</p>
                    </div>
                    <div ref={areaRef} style={{ width: '100%', height: 320, position: 'relative' }}>
                        {areaDim.width > 0 && (
                            <ResponsiveContainer width="100%" height="100%" debounce={100}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary-600)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--color-primary-600)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#003964' }}
                                        formatter={(value: number | undefined) => `฿${(value || 0).toLocaleString()}`}
                                    />
                                    <Area type="monotone" dataKey="actual" stroke="var(--color-primary-800)" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="p-8 border-gray-100/60 rounded-[24px] shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[22px] font-extrabold text-gray-900 tracking-tight">สัดส่วนหมวดหมู่ที่มีการเบิกจ่ายสูงสุด</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryData.length > 0 ? categoryData.map((cat, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 hover:border-primary-200 transition-all group hover:shadow-lg hover:shadow-primary-100/20">
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase tracking-tighter mb-1 inline-block">Code: {cat.code}</span>
                                    <h4 className="font-bold text-gray-800 group-hover:text-primary-700 transition-colors truncate">{cat.name}</h4>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-lg font-extrabold text-gray-900">฿{cat.amount.toLocaleString()}</span>
                                    <p className="text-[10px] text-gray-400 font-medium">Used of ฿{cat.totalAllocated.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
                                <div
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min((cat.amount / cat.totalAllocated) * 100, 100)}%` }}
                                ></div>
                            </div>

                            {/* SAP Details Overlay-like section */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-dashed border-gray-200 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Cost Center</p>
                                    <p className="text-xs font-bold text-gray-700">{cat.costCenter || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Fund Source</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${cat.fund === 'I' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                        <p className="text-xs font-bold text-gray-700">{cat.fund === 'I' ? 'Internal' : 'External'}</p>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Functional Area</p>
                                    <p className="text-xs font-bold text-gray-700 truncate">{cat.functionalArea || '-'}</p>
                                </div>
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

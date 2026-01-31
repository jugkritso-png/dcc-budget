import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, PieChart as PieChartIcon, TrendingUp, AlertCircle } from 'lucide-react';

const COLORS = ['#059669', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

const BudgetReport: React.FC = () => {
    const { requests, categories } = useBudget();

    // 1. Calculate Overall Budget Stats
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalUsed = categories.reduce((sum, cat) => sum + cat.used, 0); // Assuming 'used' is updated correctly
    const totalPending = requests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
    const totalRemaining = totalAllocated - totalUsed;

    // 2. Prepare Data for Pie Chart (Spending by Category)
    const categoryData = categories.map(cat => ({
        name: cat.name,
        value: cat.used
    })).filter(item => item.value > 0);

    // 3. Prepare Data for Bar Chart (Monthly Spending)
    // Group approved requests by month
    const monthlyDataMap = new Map<string, number>();
    const months = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];

    // Initialize months with 0
    months.forEach(m => monthlyDataMap.set(m, 0));

    requests.filter(r => r.status === 'approved').forEach(req => {
        const date = new Date(req.date);
        const monthIndex = date.getMonth(); // 0-11
        // Adjust for Thai Fiscal Year if needed, but simple mapping for now:
        // Fiscal Year starts Oct. simple display uses actual month name.
        const thaiMonth = date.toLocaleDateString('th-TH', { month: 'short' });
        // Clean up format "ม.ค."
        const cleanMonth = thaiMonth.replace('.', '') + '.';

        // This relies on browser locale, simpler to just map index to our fixed array if we assume standard year
        // Let's stick to standard Gregorian Map for simplicity of parsing 'YYYY-MM-DD'
        const reqMonth = parseInt(req.date.split('-')[1]) - 1; // 0-11
        // Map 0 (Jan) -> Index 3 in Fiscal Year (Oct, Nov, Dec, Jan) ??
        // Let's just show Calendar Year or Fiscal? Fiscal is standard.
        // Oct = 0, Nov = 1 ... Sept = 11
        let fiscalIndex = reqMonth - 9;
        if (fiscalIndex < 0) fiscalIndex += 12;

        if (fiscalIndex >= 0 && fiscalIndex < 12) {
            const mName = months[fiscalIndex];
            monthlyDataMap.set(mName, (monthlyDataMap.get(mName) || 0) + req.amount);
        }
    });

    const monthlyChartData = Array.from(monthlyDataMap.entries()).map(([name, amount]) => ({
        name,
        amount
    }));


    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Budget */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-50 rounded-lg text-gray-500">ปีงบ 2569</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">งบประมาณได้รับจัดสรร</p>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">฿{totalAllocated.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Used */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">ใช้ไปแล้ว (Actual)</p>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">฿{totalUsed.toLocaleString()}</h3>
                        <p className="text-xs text-blue-900 mt-1 font-bold">{((totalUsed / totalAllocated) * 100).toFixed(1)}% ของงบประมาณ</p>
                    </div>
                </div>

                {/* Pending (Blue) */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">รออนุมัติ (Pending)</p>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">฿{totalPending.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Remaining (Teal) */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <PieChartIcon size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">คงเหลือสุทธิ</p>
                        <h3 className="text-3xl font-bold text-teal-600 tracking-tight">฿{totalRemaining.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Spending Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">การใช้จ่ายรายเดือน (Monthly Spending)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดใช้จ่าย']}
                                />
                                <Bar dataKey="amount" fill="#003964" radius={[4, 4, 4, 4]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">สัดส่วนตามหมวดหมู่</h3>
                    <div className="h-64 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `฿${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {categoryData.slice(0, 5).map((entry, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-gray-600">{entry.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">฿{entry.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetReport;

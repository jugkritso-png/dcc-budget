
import React, { useState } from 'react';
import { Calendar, Save, Plus, Info, X, DollarSign } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import toast from 'react-hot-toast';

const BudgetPlanning: React.FC = () => {
    const { subActivities, budgetPlans, saveBudgetPlan } = useBudget();
    const [selectedYear, setSelectedYear] = useState(2569);

    // Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{ subId: string, subName: string, monthIndex: number, monthName: string } | null>(null);
    const [editAmount, setEditAmount] = useState('');

    const quarters = [
        { id: 'q1', name: 'ไตรมาส 1 (Q1)', color: 'bg-blue-600', months: ['ต.ค.', 'พ.ย.', 'ธ.ค.'] },
        { id: 'q2', name: 'ไตรมาส 2 (Q2)', color: 'bg-indigo-500', months: ['ม.ค.', 'ก.พ.', 'มี.ค.'] },
        { id: 'q3', name: 'ไตรมาส 3 (Q3)', color: 'bg-teal-500', months: ['เม.ย.', 'พ.ค.', 'มิ.ย.'] },
        { id: 'q4', name: 'ไตรมาส 4 (Q4)', color: 'bg-amber-500', months: ['ก.ค.', 'ส.ค.', 'ก.ย.'] },
    ];

    // Flatten months for easy indexing (0-11 where 0=Oct)
    const allMonths = quarters.flatMap(q => q.months);

    const getPlan = (subId: string, monthIndex: number) => {
        return budgetPlans.find(p =>
            p.subActivityId === subId &&
            p.year === selectedYear &&
            p.month === monthIndex
        );
    };

    const handleCellClick = (subId: string, subName: string, monthIndex: number) => {
        const plan = getPlan(subId, monthIndex);
        setEditingCell({
            subId,
            subName,
            monthIndex,
            monthName: allMonths[monthIndex]
        });
        setEditAmount(plan && plan.amount > 0 ? plan.amount.toString() : '');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCell) return;

        const amount = parseFloat(editAmount);

        await saveBudgetPlan({
            subActivityId: editingCell.subId,
            year: selectedYear,
            month: editingCell.monthIndex,
            amount: isNaN(amount) ? 0 : amount
        });

        toast.success(`บันทึกยอดเดือน ${editingCell.monthName} เรียบร้อย`);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar className="text-primary-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">วางแผนงบประมาณ (Budget Planning)</h2>
                        <p className="text-gray-500 text-sm">กำหนดแผนการใช้จ่ายรายกิจกรรมย่อย (Milestone Timeline)</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                        <span className="text-sm text-gray-500 mr-2 font-medium">ปีงบประมาณ:</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="text-primary-700 font-bold bg-transparent outline-none cursor-pointer text-sm"
                        >
                            <option value={2570}>2570</option>
                            <option value={2569}>2569</option>
                            <option value={2568}>2568</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-card border border-gray-100/60 p-6 md:p-8 relative">

                {/* Instruction Banner */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8 flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <h3 className="text-blue-900 font-bold mb-1 text-sm">การใช้งาน Milestone Timeline</h3>
                        <p className="text-blue-700/80 text-xs leading-relaxed">
                            คลิกที่ช่องเดือนเพื่อ "ระบุจำนวนเงิน" ที่วางแผนจะใช้ แถบสีจะแสดงขึ้นอัตโนมัติเมื่อมียอดเงิน &gt; 0
                        </p>
                    </div>
                </div>

                {/* Timeline Components */}
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                {/* Quarter Headers */}
                                <tr>
                                    <th className="p-4 text-left min-w-[220px] bg-white border-b border-r sticky left-0 z-20 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                        <div className="text-sm font-bold text-gray-800">กิจกรรมย่อย (Sub-Activity)</div>
                                    </th>
                                    {quarters.map(q => (
                                        <th key={q.id} colSpan={3} className={`${q.color} text-white py-2 px-1 text-center text-xs font-bold border-r border-white/20 last:border-r-0`}>
                                            {q.name}
                                        </th>
                                    ))}
                                </tr>
                                {/* Month Headers */}
                                <tr className="bg-gray-50/80 text-gray-500 text-xs text-center border-b border-gray-100">
                                    <th className="p-3 border-r sticky left-0 bg-gray-50 z-20 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]"></th>
                                    {quarters.map(q => (
                                        q.months.map((m, i) => (
                                            <th key={`${q.id}-${i}`} className="py-3 px-2 border-r border-gray-100 min-w-[90px] group cursor-default hover:bg-gray-100 transition-colors">
                                                <div className="font-bold text-gray-700 group-hover:text-primary-600">{m}</div>
                                            </th>
                                        ))
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {subActivities.length > 0 ? subActivities.map((sub, idx) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 border-r border-gray-100 bg-white sticky left-0 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold text-sm text-gray-800 truncate max-w-[200px]" title={sub.name}>{sub.name}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 border border-gray-200">
                                                        Allocated: ฿{sub.allocated > 1000 ? (sub.allocated / 1000).toFixed(0) + 'k' : sub.allocated.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Timeline Cells (12 Months) */}
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const plan = getPlan(sub.id, i);
                                            const hasAmount = plan && plan.amount > 0;

                                            // Determine bar color based on Quarter
                                            let barColor = 'bg-blue-100 border-blue-300 text-blue-700';
                                            if (i >= 3 && i <= 5) barColor = 'bg-indigo-100 border-indigo-300 text-indigo-700';
                                            else if (i >= 6 && i <= 8) barColor = 'bg-teal-100 border-teal-300 text-teal-700';
                                            else if (i >= 9) barColor = 'bg-amber-100 border-amber-300 text-amber-700';

                                            return (
                                                <td
                                                    key={i}
                                                    onClick={() => handleCellClick(sub.id, sub.name, i)}
                                                    className="p-1 border-r border-gray-100 relative h-16 cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    {hasAmount && (
                                                        <div className={`absolute top-2 bottom-2 left-0 right-[-1px] z-10 border-y-2 flex items-center justify-center shadow-sm ${barColor} animate-fade-in`}>
                                                            <span className="text-[10px] font-bold">฿{plan.amount > 1000 ? (plan.amount / 1000).toFixed(0) + 'k' : plan.amount}</span>
                                                        </div>
                                                    )}

                                                    {!hasAmount && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 z-0">
                                                            <Plus size={14} className="text-gray-300" />
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-16 text-gray-400 bg-white">
                                            <div className="flex flex-col items-center gap-3 opacity-50">
                                                <Calendar size={48} strokeWidth={1.5} />
                                                <p>ยังไม่มีกิจกรรมย่อยให้วางแผน</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingCell && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">กำหนดงบประมาณ</h3>
                                <p className="text-xs text-gray-500">{editingCell.monthName} - {editingCell.subName}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนเงิน (บาท)</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <DollarSign size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-lg text-gray-800"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setEditAmount('0'); handleSave({ preventDefault: () => { } } as any); }}
                                    className="flex-1 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                                >
                                    ล้างยอดเงิน
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5 text-sm"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetPlanning;

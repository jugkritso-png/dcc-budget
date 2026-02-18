import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { FileText, Save, CheckCircle2, AlertCircle, Calculator, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SubActivity, BudgetRequest, ExpenseLineItem, Page } from '../types'; // Import Page enum
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

interface CreateRequestProps {
    onNavigate?: (page: Page) => void;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ onNavigate }) => {
    const { addRequest, categories, subActivities, user } = useBudget();

    const [formData, setFormData] = useState<Partial<BudgetRequest> & { expenseItems: ExpenseLineItem[] }>({
        project: '',
        category: '',
        activity: '',
        subActivityId: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        reason: '',
        urgency: 'normal',
        startDate: '',
        endDate: '',
        expenseItems: []
    });

    // Derived state for budget checks
    const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>({});

    useEffect(() => {
        const usage: Record<string, number> = {};
        formData.expenseItems.forEach(item => {
            if (item.category) {
                usage[item.category] = (usage[item.category] || 0) + item.total;
            }
        });
        setCategoryUsage(usage);
    }, [formData.expenseItems]);

    const [availableSubActivities, setAvailableSubActivities] = useState<SubActivity[]>([]);
    const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);

    // Expense Item Handlers
    const addExpenseItem = () => {
        const newItem: ExpenseLineItem = {
            id: `EXP-${Date.now()}`,
            category: formData.category || (categories[0]?.name || ''), // Default to main category or first available
            description: '',
            quantity: 1,
            unitPrice: 0,
            unit: 'รายการ',
            total: 0
        };
        setFormData(prev => ({
            ...prev,
            expenseItems: [...(prev.expenseItems || []), newItem]
        }));
    };

    const removeExpenseItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            expenseItems: prev.expenseItems.filter(item => item.id !== id)
        }));
    };

    const updateExpenseItem = (id: string, field: keyof ExpenseLineItem, value: any) => {
        setFormData(prev => {
            const updatedItems = prev.expenseItems.map(item => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'unitPrice') {
                        updated.total = updated.quantity * updated.unitPrice;
                    }
                    return updated;
                }
                return item;
            });
            return { ...prev, expenseItems: updatedItems };
        });
    };

    const calculateExpenseTotal = () => {
        return (formData.expenseItems || []).reduce((sum, item) => sum + item.total, 0);
    };

    // Auto-update amount when expense items change
    useEffect(() => {
        if (formData.expenseItems && formData.expenseItems.length > 0) {
            const total = calculateExpenseTotal();
            if (total !== formData.amount) {
                setFormData(prev => ({ ...prev, amount: total }));
            }
        }
    }, [formData.expenseItems]);

    useEffect(() => {
        if (formData.category) {
            const category = categories.find(c => c.name === formData.category);
            setSelectedCategoryData(category || null);
            if (category) {
                setAvailableSubActivities(subActivities.filter(s => s.categoryId === category.id));
            } else {
                setAvailableSubActivities([]);
            }
        } else {
            setSelectedCategoryData(null);
            setAvailableSubActivities([]);
        }
    }, [formData.category, categories, subActivities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.project || !formData.category || !formData.amount) {
            toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }

        try {
            await addRequest({
                id: `REQ-${Date.now()}`,
                ...formData as any, // Cast to avoid partial index signature issues if strictly typed
                amount: Number(formData.amount),
                status: 'pending',
                requester: user?.name || 'Unknown User',
                department: user?.department || 'สำนักวิชา'
            });
            toast.success('สร้างคำขอใหม่สำเร็จ - รอการอนุมัติ');

            // Navigate back to Budget page
            if (onNavigate) {
                onNavigate(Page.BUDGET);
            } else {
                // Fallback: Reset Form
                setFormData({
                    project: '',
                    category: '',
                    activity: '',
                    amount: 0,
                    date: new Date().toISOString().split('T')[0],
                    reason: '',
                    urgency: 'normal',
                    startDate: '',
                    endDate: '',
                    expenseItems: []
                });
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการสร้างคำขอ');
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4 px-4 md:px-0">
                <div className="min-w-0 w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="text-primary-600 flex-shrink-0" size={22} />
                        <span>ขอใช้งบประมาณ</span>
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm mt-1 ml-8">กรอกรายละเอียดเพื่อขออนุมัติงบประมาณสำหรับโครงการหรือกิจกรรม</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full md:max-w-lg mx-auto">
                <div className="bg-white px-5 py-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm md:shadow-card border border-gray-100 space-y-6 md:space-y-8">

                    {/* Section 1: Project Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">1. ข้อมูลโครงการ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อโครงการ/กิจกรรม <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    placeholder="ระบุชื่อโครงการหรือกิจกรรม"
                                    required
                                    value={formData.project}
                                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">วันที่เริ่มต้น</label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">วันที่สิ้นสุด</label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">เหตุผลความจำเป็น / วัตถุประสงค์</label>
                                <textarea
                                    rows={3}
                                    className="w-full border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none border bg-gray-50 focus:bg-white transition-all resize-y min-h-[100px]"
                                    placeholder="อธิบายรายละเอียดและความจำเป็นของโครงการ..."
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Budget Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">2. รายละเอียดงบประมาณ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">หมวดงบประมาณ <span className="text-red-500">*</span></label>
                                <Select
                                    options={categories.map(c => ({
                                        value: c.name,
                                        label: c.name,
                                        color: c.color // Pass the color class
                                    }))}
                                    value={formData.category}
                                    onChange={(value) => {
                                        setFormData({ ...formData, category: value, activity: '' });
                                    }}
                                    placeholder="เลือกหมวดงบประมาณ"
                                    required
                                />
                                {selectedCategoryData && (
                                    <div className="mt-2 p-3 bg-primary-50 rounded-xl border border-primary-100 text-xs text-primary-700 flex items-center gap-2">
                                        <CheckCircle2 size={14} />
                                        <span>งบคงเหลือ: ฿{(selectedCategoryData.allocated - selectedCategoryData.used).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">กิจกรรมย่อย</label>
                                {availableSubActivities.length > 0 ? (
                                    <Select
                                        className="h-12 rounded-xl bg-white border-gray-200"
                                        value={formData.activity}
                                        onChange={(value) => {
                                            const selectedSub = availableSubActivities.find(s => s.name === value);
                                            setFormData({
                                                ...formData,
                                                activity: value,
                                                subActivityId: selectedSub ? selectedSub.id : undefined
                                            });
                                        }}
                                        options={[
                                            { value: '', label: 'เลือกกิจกรรมย่อย' },
                                            ...availableSubActivities.map(sub => ({ value: sub.name, label: sub.name })),
                                            { value: 'อื่นๆ', label: 'อื่นๆ' }
                                        ]}
                                    />
                                ) : (
                                    <Input
                                        type="text"
                                        placeholder="ระบุกิจกรรมย่อย"
                                        value={formData.activity}
                                        onChange={e => setFormData({ ...formData, activity: e.target.value })}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">วงเงินที่ขออนุมัติ (บาท) <span className="text-red-500">*</span></label>
                                <div className="relative w-full">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</div>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        required
                                        className="pl-8 font-bold text-gray-900"
                                        value={formData.amount || ''}
                                        onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ความเร่งด่วน</label>
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    {(['normal', 'urgent', 'critical'] as const).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, urgency: level })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.urgency === level
                                                ? level === 'critical' ? 'bg-red-500 text-white shadow-md'
                                                    : level === 'urgent' ? 'bg-orange-500 text-white shadow-md'
                                                        : 'bg-white text-primary-600 shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {level === 'normal' ? 'ปกติ' : level === 'urgent' ? 'ด่วน' : 'ด่วนที่สุด'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Expense Estimation */}
                    <div>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-bold text-gray-900">3. รายละเอียดประมาณการค่าใช้จ่าย</h3>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                    <Calculator size={20} />
                                </div>
                                <span className="text-sm font-bold text-gray-600">รวมทั้งสิ้น: <span className="text-primary-600 text-lg">฿{calculateExpenseTotal().toLocaleString()}</span></span>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#f8fafc] border-b border-gray-200 text-gray-500 font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 w-10">#</th>
                                            <th className="px-4 py-3 w-32">หมวดรายจ่าย</th>
                                            <th className="px-4 py-3">รายการ</th>
                                            <th className="px-4 py-3 w-24 text-center">จำนวน</th>
                                            <th className="px-4 py-3 w-24 text-center">หน่วย</th>
                                            <th className="px-4 py-3 w-32 text-right">ราคา/หน่วย</th>
                                            <th className="px-4 py-3 w-32 text-right">รวม (บาท)</th>
                                            <th className="px-4 py-3 w-16 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {formData.expenseItems.map((item, index) => (
                                            <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-center text-gray-400 font-mono text-xs">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className="w-full border-gray-200 rounded-lg py-1.5 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white"
                                                        value={item.category}
                                                        onChange={e => updateExpenseItem(item.id, 'category', e.target.value)}
                                                    >
                                                        <option value="">เลือกหมวดงบประมาณ</option>
                                                        {categories.map(c => (
                                                            <option key={c.id} value={c.name}>
                                                                {c.name} (คงเหลือ: ฿{(c.allocated - c.used - (categoryUsage[c.name] || 0) + (c.name === item.category ? item.total : 0)).toLocaleString()})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white placeholder-gray-300"
                                                        placeholder="รายละเอียดรายการ"
                                                        value={item.description}
                                                        onChange={e => updateExpenseItem(item.id, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-center"
                                                        value={item.quantity}
                                                        onChange={e => updateExpenseItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-center"
                                                        placeholder="หน่วย"
                                                        value={item.unit}
                                                        onChange={e => updateExpenseItem(item.id, 'unit', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-right"
                                                        value={item.unitPrice}
                                                        onChange={e => updateExpenseItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-700">
                                                    {item.total.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExpenseItem(item.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {formData.expenseItems.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                                                    ยังไม่มีรายการค่าใช้จ่าย คลิก "เพิ่มรายการ" เพื่อเริ่มต้น
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-center">
                                <button
                                    type="button"
                                    onClick={addExpenseItem}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
                                >
                                    <Plus size={16} />
                                    เพิ่มรายการ
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                if (confirm('คุณต้องการยกเลิกการทำรายการใช่หรือไม่? ข้อมูลที่กรอกจะหายไป')) {
                                    setFormData({
                                        project: '',
                                        category: '',
                                        activity: '',
                                        amount: 0,
                                        date: new Date().toISOString().split('T')[0],
                                        reason: '',
                                        urgency: 'normal',
                                        startDate: '',
                                        endDate: '',
                                        expenseItems: []
                                    });
                                }
                            }}
                            className="w-full md:w-auto px-6 py-3 h-auto text-gray-600 hover:bg-gray-100 order-2 md:order-1"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full md:w-auto px-8 py-3 h-auto text-sm font-bold flex items-center justify-center gap-2 order-1 md:order-2"
                        >
                            <Save size={18} />
                            บันทึกคำขอ
                        </Button>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default CreateRequest;

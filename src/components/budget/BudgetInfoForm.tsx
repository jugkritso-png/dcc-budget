
import React from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { PieChart, Zap } from 'lucide-react';
import { Category, SubActivity } from '../../types';

interface BudgetInfoFormProps {
    formData: {
        category: string;
        subActivity: string;
        amount: number;
        urgency: 'normal' | 'urgent' | 'critical';
    };
    categories: Category[];
    availableSubActivities: SubActivity[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const BudgetInfoForm: React.FC<BudgetInfoFormProps> = ({
    formData,
    categories,
    availableSubActivities,
    handleChange,
    setFormData
}) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <PieChart size={18} />
                </div>
                งบประมาณ
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">หมวดหมู่</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev: any) => ({ ...prev, category: value, subActivity: '' }));
                                }}
                                className="w-full h-11 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer font-bold text-gray-700 bg-white"
                                required
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.name} className="font-bold">
                                        {c.name} {c.remaining <= 0 ? '(งบหมด)' : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">กิจกรรมย่อย</label>
                        <Select
                            name="subActivity"
                            value={formData.subActivity}
                            onChange={(value) => setFormData((prev: any) => ({ ...prev, subActivity: value }))}
                            options={[
                                { value: '', label: 'ระบุกิจกรรมย่อย (ถ้ามี)' },
                                ...availableSubActivities.map(sub => ({
                                    value: sub.name,
                                    label: `${sub.name} (คงเหลือ: ฿${sub.remainingAmount.toLocaleString()})`
                                }))
                            ]}
                            disabled={!formData.category}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">จำนวนเงิน (บาท)</label>
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            className="font-bold text-lg text-primary-600"
                        // Read-only logic is handled in the parent/hook if needed (e.g., sum of items)
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ความเร่งด่วน</label>
                        <div className="grid grid-cols-3 gap-2">
                            <label className={`cursor-pointer rounded-xl border p-2 text-center transition-all ${formData.urgency === 'normal' ? 'bg-primary-50 border-primary-200 text-primary-700 ring-2 ring-primary-500/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="urgency" value="normal" checked={formData.urgency === 'normal'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm font-bold">ปกติ</span>
                            </label>
                            <label className={`cursor-pointer rounded-xl border p-2 text-center transition-all ${formData.urgency === 'urgent' ? 'bg-orange-50 border-orange-200 text-orange-700 ring-2 ring-orange-500/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="urgency" value="urgent" checked={formData.urgency === 'urgent'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm font-bold flex items-center justify-center gap-1"><Zap size={14} /> ด่วน</span>
                            </label>
                            <label className={`cursor-pointer rounded-xl border p-2 text-center transition-all ${formData.urgency === 'critical' ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="urgency" value="critical" checked={formData.urgency === 'critical'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm font-bold flex items-center justify-center gap-1"><Zap size={14} /> ด่วนที่สุด</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

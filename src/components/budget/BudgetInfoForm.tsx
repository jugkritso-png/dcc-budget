
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
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pt-4 border-t border-gray-100">
                2. รายละเอียดงบประมาณ
            </h3>
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">หมวดงบประมาณ <span className="text-red-500">*</span></label>
                        <Select
                            value={formData.category}
                            onChange={(value) => {
                                setFormData((prev: any) => ({ ...prev, category: value, subActivity: '' }));
                            }}
                            options={[
                                { value: '', label: 'เลือกหมวดงบประมาณ' },
                                ...categories.map(c => ({
                                    value: c.name,
                                    label: `${c.name} ${c.remaining <= 0 ? '(งบหมด)' : ''}`,
                                    color: c.color
                                }))
                            ]}
                            placeholder="เลือกหมวดงบประมาณ"
                            className="bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">กิจกรรมย่อย</label>
                        <Input
                            name="activity" // Using text input for activity based on screenshot "ระบุกิจกรรมย่อย" being a placeholder text in a text-like field, though Select is also fine. Keeping it simple.
                            value={formData.activity}
                            handleChange={handleChange}
                            placeholder="ระบุกิจกรรมย่อย"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">วงเงินที่ขออนุมัติ (บาท) <span className="text-red-500">*</span></label>
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            handleChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors font-bold text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ความเร่งด่วน</label>
                        <div className="grid grid-cols-3 gap-0 bg-gray-100 p-1 rounded-xl">
                            <label className={`cursor-pointer rounded-lg py-2 text-center transition-all ${formData.urgency === 'normal' ? 'bg-white text-primary-600 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
                                <input type="radio" name="urgency" value="normal" checked={formData.urgency === 'normal'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm">ปกติ</span>
                            </label>
                            <label className={`cursor-pointer rounded-lg py-2 text-center transition-all ${formData.urgency === 'urgent' ? 'bg-white text-orange-600 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
                                <input type="radio" name="urgency" value="urgent" checked={formData.urgency === 'urgent'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm">ด่วน</span>
                            </label>
                            <label className={`cursor-pointer rounded-lg py-2 text-center transition-all ${formData.urgency === 'critical' ? 'bg-white text-red-600 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
                                <input type="radio" name="urgency" value="critical" checked={formData.urgency === 'critical'} onChange={handleChange} className="sr-only" />
                                <span className="text-sm">ด่วนที่สุด</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Category } from '../../types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: Category | null;
    selectedYear: number;
    autoCode?: string;
    colors: { bg: string; label: string }[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    selectedYear,
    autoCode,
    colors
}) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        segment: '',
        allocated: '',
        color: colors[0].bg,
        businessPlace: '1000',
        businessArea: '1000',
        fund: 'I',
        fundCenter: '',
        costCenter: '',
        functionalArea: '',
        commitmentItem: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                segment: initialData.segment || '',
                allocated: initialData.allocated.toString(),
                color: initialData.color,
                businessPlace: initialData.businessPlace || '1000',
                businessArea: initialData.businessArea || '1000',
                fund: initialData.fund || 'I',
                fundCenter: initialData.fundCenter || '',
                costCenter: initialData.costCenter || '',
                functionalArea: initialData.functionalArea || '',
                commitmentItem: initialData.commitmentItem || ''
            });
        } else if (autoCode) {
            // Reset with auto code for new item
            setFormData({
                name: '',
                code: autoCode,
                segment: '',
                allocated: '',
                color: colors[0].bg,
                businessPlace: '1000',
                businessArea: '1000',
                fund: 'I',
                fundCenter: '',
                costCenter: '',
                functionalArea: '',
                commitmentItem: ''
            });
        }
    }, [initialData, autoCode, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-in fade-in zoom-in duration-200 border border-white/60 ring-1 ring-black/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{initialData ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่</label>
                        <input type="text" placeholder="เช่น ค่าวัสดุ, ค่าใช้สอย" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสหมวดหมู่ (สร้างอัตโนมัติ)</label>
                        <input
                            type="text"
                            placeholder="DCC-XXX"
                            className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            value={formData.code}
                            readOnly
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">งบประมาณที่ได้รับจัดสรร (บาท)</label>
                        <input type="number" placeholder="0.00" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.allocated} onChange={e => setFormData({ ...formData, allocated: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">สีสัญลักษณ์</label>
                        <div className="flex gap-3">
                            {colors.map(c => (
                                <button
                                    key={c.bg}
                                    onClick={() => setFormData({ ...formData, color: c.bg })}
                                    className={`w-8 h-8 rounded-full ${c.bg} transition-all ${formData.color === c.bg ? 'ring-2 ring-offset-2 ring-emerald-600 scale-110' : 'hover:scale-110'}`}
                                    title={c.label}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Codes Section */}
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-4">รหัสงบประมาณ (Budget Codes)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Place</label>
                                <input
                                    type="text"
                                    placeholder="1000 = มวล"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.businessPlace}
                                    onChange={e => setFormData({ ...formData, businessPlace: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Area</label>
                                <input
                                    type="text"
                                    placeholder="1000 = ทั่วไป"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.businessArea}
                                    onChange={e => setFormData({ ...formData, businessArea: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fund</label>
                                <select
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                    value={formData.fund}
                                    onChange={e => setFormData({ ...formData, fund: e.target.value })}
                                >
                                    <option value="I">I - เงินภายใน</option>
                                    <option value="E">E - เงินภายนอก</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Center</label>
                                <input
                                    type="text"
                                    placeholder="รหัสหน่วยงาน"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.fundCenter}
                                    onChange={e => setFormData({ ...formData, fundCenter: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                                <input
                                    type="text"
                                    placeholder="รหัสต้นทุน"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.costCenter}
                                    onChange={e => setFormData({ ...formData, costCenter: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Functional Area</label>
                                <input
                                    type="text"
                                    placeholder="รหัสกิจกรรม"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.functionalArea}
                                    onChange={e => setFormData({ ...formData, functionalArea: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Item</label>
                                <input
                                    type="text"
                                    placeholder="หมวดรายจ่าย"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={formData.commitmentItem}
                                    onChange={e => setFormData({ ...formData, commitmentItem: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">ยกเลิก</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-[#047857] text-white rounded-lg hover:bg-emerald-800 shadow-sm flex items-center gap-2">
                        <Save size={18} /> บันทึกข้อมูล
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;

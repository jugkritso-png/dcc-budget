import React, { useState, useEffect } from 'react';
import { Calendar, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';

const SettingsPolicies: React.FC = () => {
    const { settings, updateSettings } = useBudget();
    const [formData, setFormData] = useState({
        overBudgetAlert: false,
        fiscalYearCutoff: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData(prev => ({
                ...prev,
                overBudgetAlert: settings.overBudgetAlert,
                fiscalYearCutoff: settings.fiscalYearCutoff,
            }));
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings(formData);
        toast.success('บันทึกนโยบายเรียบร้อยแล้ว');
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">นโยบายงบประมาณ</h3>
                    <p className="text-gray-500 text-sm mt-1">กำหนดเงื่อนไขและข้อจำกัดในการใช้งบประมาณ</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                    <Save size={18} />
                    บันทึก
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-bold text-gray-900">แจ้งเตือนงบเกิน</h4>
                            <div className="relative inline-block w-12 align-middle select-none">
                                <input
                                    type="checkbox"
                                    name="toggle"
                                    id="toggle"
                                    className="peer sr-only"
                                    checked={formData.overBudgetAlert}
                                    onChange={(e) => setFormData({ ...formData, overBudgetAlert: e.target.checked })}
                                />
                                <label
                                    htmlFor="toggle"
                                    className="block h-7 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-green-500 transition-colors duration-300 ease-in-out"
                                ></label>
                                <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm"></div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">ระบบจะแจ้งเตือนเมื่อมีการขออนุมัติเกินวงเงินคงเหลือ แต่ยังสามารถบันทึกได้</p>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 gap-4">
                    <div>
                        <h4 className="text-base font-bold text-gray-900 mb-2">วันปิดงบประมาณ</h4>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all">
                            <Calendar size={18} className="text-primary-500" />
                            <input
                                type="date"
                                className="text-sm text-gray-700 outline-none border-none focus:ring-0 bg-transparent font-medium w-full"
                                value={formData.fiscalYearCutoff}
                                onChange={(e) => setFormData({ ...formData, fiscalYearCutoff: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">กำหนดวันสุดท้ายที่อนุญาตให้ส่งคำขอสำหรับปีงบประมาณนี้</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPolicies;

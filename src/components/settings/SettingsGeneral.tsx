import React, { useState, useEffect } from 'react';
import { Building, Calendar, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';

const SettingsGeneral: React.FC = () => {
    const { settings, updateSettings } = useBudget();
    const [formData, setFormData] = useState({
        orgName: '',
        fiscalYear: 2569,
        overBudgetAlert: false,
        fiscalYearCutoff: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData(prev => ({
                ...prev,
                orgName: settings.orgName,
                fiscalYear: settings.fiscalYear,
                // Preserve other fields that might not be in the initial settings object if partial
                ...settings
            }));
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings(formData);
        toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-48 rounded-t-3xl bg-gradient-to-r from-[#00A5E0] via-[#005C9E] to-[#12365D] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-8 left-8 text-white">
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                        <Building size={32} className="text-indigo-300" />
                        ข้อมูลองค์กร
                    </h3>
                    <p className="text-indigo-200 mt-1 pl-11">ตั้งค่าข้อมูลพื้นฐานของหน่วยงานและการแสดงผลเอกสาร</p>
                </div>
            </div>

            <div className="px-8 pb-12 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-card border border-white/60 p-8 max-w-3xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">รายละเอียดทั่วไป</h4>
                            <p className="text-sm text-gray-500">ข้อมูลเหล่านี้จะถูกแสดงในเอกสารและรายงานต่างๆ</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Save size={18} />
                            <span>บันทึกการเปลี่ยนแปลง</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="group space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Building size={16} className="text-primary-500" />
                                ชื่อหน่วยงาน / องค์กร
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.orgName}
                                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                    className="w-full rounded-xl border-gray-200 px-5 py-4 text-lg font-medium text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm group-hover:bg-white"
                                    placeholder="ระบุชื่อหน่วยงาน"
                                />
                            </div>
                        </div>

                        <div className="group space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-primary-500" />
                                ปีงบประมาณปัจจุบัน (Fiscal Year)
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.fiscalYear}
                                    onChange={(e) => setFormData({ ...formData, fiscalYear: parseInt(e.target.value) })}
                                    className="w-full rounded-xl border-gray-200 px-5 py-4 text-lg font-medium text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm appearance-none cursor-pointer group-hover:bg-white"
                                >
                                    <option value={2568}>2568</option>
                                    <option value={2569}>2569</option>
                                    <option value={2570}>2570</option>
                                    <option value={2571}>2571</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronRight size={24} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsGeneral;

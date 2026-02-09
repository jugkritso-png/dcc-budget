import React, { useState, useEffect } from 'react';
import { Building, Calendar, Save, Globe, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

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
                ...settings
            }));
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings(formData);
        toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">ข้อมูลองค์กร</h2>
                        <p className="text-gray-500 text-sm mt-1">ตั้งค่าข้อมูลพื้นฐานของหน่วยงานและการแสดงผลเอกสาร</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                        <Save size={18} className="mr-2" />
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-50/50 to-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50/40 to-pink-50/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4"></div>

                    {/* Card Header (Glass Effect) */}
                    <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                        {/* Abstract Shapes */}
                        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-white/5 rotate-12 blur-3xl"></div>

                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>

                        <div className="absolute bottom-6 left-8 flex items-end gap-6 z-10">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-600 border-4 border-white/50 backdrop-blur-md">
                                <Landmark size={48} />
                            </div>
                            <div className="pb-2">
                                <h3 className="text-2xl font-bold text-white drop-shadow-md">{formData.orgName || 'ชื่อหน่วยงาน'}</h3>
                                <div className="flex items-center gap-2 text-primary-100 text-sm">
                                    <Globe size={14} />
                                    <span>Organization Settings</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Form */}
                    <div className="p-8 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">

                            {/* Organization Name Input */}
                            <div className="md:col-span-2 space-y-2 group">
                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                    <Building size={16} className="text-primary-500" />
                                    ชื่อหน่วยงาน / องค์กร
                                </label>
                                <Input
                                    type="text"
                                    value={formData.orgName}
                                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 h-14 text-lg"
                                    placeholder="ระบุชื่อหน่วยงาน"
                                    icon={Building}
                                />
                            </div>

                            {/* Fiscal Year Select */}
                            <div className="space-y-2 group">
                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-500" />
                                    ปีงบประมาณ (Fiscal Year)
                                </label>
                                <div className="relative">
                                    <Select
                                        value={formData.fiscalYear.toString()}
                                        onChange={(value) => setFormData({ ...formData, fiscalYear: parseInt(value) })}
                                        options={[
                                            { value: '2568', label: 'ปีงบประมาณ 2568' },
                                            { value: '2569', label: 'ปีงบประมาณ 2569' },
                                            { value: '2570', label: 'ปีงบประมาณ 2570' },
                                            { value: '2571', label: 'ปีงบประมาณ 2571' },
                                        ]}
                                        className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 h-14 pl-12"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Calendar size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
                                <div className="bg-white p-2 rounded-full shadow-sm text-primary-600 shrink-0">
                                    <Landmark size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary-900 text-sm mb-1">เกี่ยวกับปีงบประมาณ</h4>
                                    <p className="text-xs text-primary-700/80 leading-relaxed">
                                        การเปลี่ยนปีงบประมาณจะมีผลต่อเลขอ้างอิงเอกสารและรายงานสรุปยอดใช้จ่ายทั้งหมดในระบบ กรุณาตรวจสอบความถูกต้องก่อนบันทึก
                                    </p>
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

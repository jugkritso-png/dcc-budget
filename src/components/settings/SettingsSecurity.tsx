import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';

const SettingsSecurity: React.FC = () => {
    const { changePassword } = useBudget();
    const [securityForm, setSecurityForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: false
    });

    const handleSecuritySave = async () => {
        if (!securityForm.currentPassword || !securityForm.newPassword) {
            toast.error('กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่');
            return;
        }
        if (securityForm.newPassword !== securityForm.confirmPassword) {
            toast.error('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }
        try {
            await changePassword(securityForm.currentPassword, securityForm.newPassword);
            toast.success('บันทึกการตั้งค่าความปลอดภัยเรียบร้อยแล้ว');
            setSecurityForm({ ...securityForm, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('รหัสผ่านปัจจุบันไม่ถูกต้อง หรือเกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">ความปลอดภัย</h3>
                    <p className="text-gray-500 text-sm mt-1">จัดการรหัสผ่านและการเข้าถึงระบบ (Mock ID: 8820)</p>
                </div>
                <button
                    onClick={handleSecuritySave}
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                    <Save size={18} />
                    บันทึก
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Change Password */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-card space-y-4">
                    <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-2">เปลี่ยนรหัสผ่าน</h4>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">รหัสผ่านบัญชีปัจจุบัน</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={securityForm.currentPassword}
                                onChange={e => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={securityForm.newPassword}
                                onChange={e => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={securityForm.confirmPassword}
                                onChange={e => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 2FA & Sessions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-card space-y-4">
                        <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-2">การยืนยันตัวตน 2 ชั้น (2FA)</h4>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">เปิดใช้งาน 2FA</p>
                                <p className="text-xs text-gray-500">เพิ่มความปลอดภัยด้วย OTP</p>
                            </div>
                            <input type="checkbox" checked={securityForm.twoFactor} onChange={e => setSecurityForm({ ...securityForm, twoFactor: e.target.checked })} className="toggle toggle-primary h-6 w-11 rounded-full bg-gray-200 cursor-pointer appearance-none checked:bg-primary-600 transition-colors relative before:content-[''] before:absolute before:left-1 before:top-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:checked:translate-x-5" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-card space-y-4">
                        <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-2">ประวัติการเข้าใช้งาน</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800">MacBook Pro (Chrome)</p>
                                        <p className="text-xs text-gray-400">Bangkok, TH • Current Session</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    <div>
                                        <p className="font-medium text-gray-800">iPhone 13 (Safari)</p>
                                        <p className="text-xs text-gray-400">Bangkok, TH • 2 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSecurity;

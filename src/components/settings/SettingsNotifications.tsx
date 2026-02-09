import React, { useState } from 'react';
import { Save, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const SettingsNotifications: React.FC = () => {
    // Notification State
    const [notificationSettings, setNotificationSettings] = useState({
        emailEnabled: true,
        lineEnabled: false,
        notifyOnOverBudget: true,
        notifyOnRequest: true,
        notifyOnApproval: true,
        lineToken: 'xOs...7d9'
    });

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">กำหนดการแจ้งเตือน</h3>
                    <p className="text-gray-500 text-sm mt-1">เลือกช่องทางและเหตุการณ์ที่ต้องการรับการแจ้งเตือน</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Save size={18} className="mr-2" />
                    บันทึก
                </Button>
            </div>

            <div className="space-y-6 max-w-3xl">
                {/* Channels */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-card space-y-4">
                    <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-2">ช่องทางการแจ้งเตือน</h4>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-xs text-gray-500">รับสรุปข้อมูลผ่านอีเมล</p>
                            </div>
                        </div>
                        <input type="checkbox" checked={notificationSettings.emailEnabled} onChange={e => setNotificationSettings({ ...notificationSettings, emailEnabled: e.target.checked })} className="toggle toggle-primary h-6 w-11 rounded-full bg-gray-200 cursor-pointer appearance-none checked:bg-primary-600 transition-all duration-200 relative before:content-[''] before:absolute before:left-1 before:top-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:checked:translate-x-5" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">LINE Notify</p>
                                <p className="text-xs text-gray-500">รับการแจ้งเตือนทันทีผ่าน LINE</p>
                            </div>
                        </div>
                        <input type="checkbox" checked={notificationSettings.lineEnabled} onChange={e => setNotificationSettings({ ...notificationSettings, lineEnabled: e.target.checked })} className="toggle toggle-primary h-6 w-11 rounded-full bg-gray-200 cursor-pointer appearance-none checked:bg-primary-600 transition-all duration-200 relative before:content-[''] before:absolute before:left-1 before:top-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:checked:translate-x-5" />
                    </div>

                    {notificationSettings.lineEnabled && (
                        <div className="mt-2 pl-12 animate-in slide-in-from-top-2">
                            <Input
                                type="text"
                                placeholder="LINE Notify Token"
                                className="border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-green-500 h-auto"
                                value={notificationSettings.lineToken}
                                onChange={e => setNotificationSettings({ ...notificationSettings, lineToken: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Triggers */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-card space-y-4">
                    <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-2">เงื่อนไขการแจ้งเตือน</h4>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={notificationSettings.notifyOnOverBudget} onChange={e => setNotificationSettings({ ...notificationSettings, notifyOnOverBudget: e.target.checked })} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                        <span className="text-sm text-gray-700">แจ้งเตือนเมื่อการใช้งบประมาณเกิน 80%</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={notificationSettings.notifyOnRequest} onChange={e => setNotificationSettings({ ...notificationSettings, notifyOnRequest: e.target.checked })} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                        <span className="text-sm text-gray-700">แจ้งเตือนเมื่อมีคำขออนุมัติใหม่</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={notificationSettings.notifyOnApproval} onChange={e => setNotificationSettings({ ...notificationSettings, notifyOnApproval: e.target.checked })} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                        <span className="text-sm text-gray-700">แจ้งเตือนเมื่อคำขอได้รับการอนุมัติ/ปฏิเสธ</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SettingsNotifications;

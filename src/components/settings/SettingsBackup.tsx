import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';

const SettingsBackup: React.FC = () => {
    const { settings, departments, users, user, requests, categories } = useBudget();
    const [lastBackup, setLastBackup] = useState<string | null>('2025-01-20 09:30:00');

    const handleBackup = () => {
        const data = {
            settings,
            departments,
            users,
            currentUser: user,
            requests,
            categories,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dcc_budget_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setLastBackup(new Date().toLocaleString('th-TH'));
    };

    return (
        <div className="p-8 h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-card border border-white/60">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Download size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">สำรองข้อมูล (Backup)</h3>
                <p className="text-gray-500 text-sm mb-8">ดาวน์โหลดข้อมูลทั้งหมดของระบบเก็บไว้ในรูปแบบไฟล์ JSON เพื่อความปลอดภัย</p>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl text-left">
                    <p className="text-xs text-gray-500 mb-1">Backup ล่าสุด</p>
                    <p className="text-sm font-semibold text-gray-900">{lastBackup || 'ยังไม่เคยสำรองข้อมูล'}</p>
                </div>

                <Button
                    onClick={handleBackup}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 border-none rounded-xl py-6 font-bold hover:shadow-lg active:scale-95 shadow-primary-200"
                >
                    <Download size={20} className="mr-2" />
                    ดาวน์โหลดไฟล์ Backup
                </Button>

            </div>
        </div>
    );
};

export default SettingsBackup;

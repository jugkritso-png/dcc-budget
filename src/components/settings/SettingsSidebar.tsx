import React from 'react';
import { Building, User, AlertCircle, Database, Users, Bell, Download, Lock } from 'lucide-react';
import { User as UserType } from '../../types';

interface SettingsSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    user: UserType | null;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab, user }) => {
    const menuItems = [
        ...(user?.role === 'admin' ? [
            { id: 'general', label: 'ข้อมูลทั่วไป', icon: <Building size={20} /> },
        ] : []),
        { id: 'profile', label: 'โปรไฟล์ส่วนตัว', icon: <User size={20} /> },
        ...(user?.role === 'admin' ? [
            { id: 'policies', label: 'นโยบายงบประมาณ', icon: <AlertCircle size={20} /> },
            { id: 'departments', label: 'หน่วยงาน / แผนก', icon: <Database size={20} /> },
            { id: 'users', label: 'ผู้ใช้งาน', icon: <Users size={20} /> },
            { id: 'notifications', label: 'การแจ้งเตือน', icon: <Bell size={20} /> },
            { id: 'backup', label: 'สำรองข้อมูล', icon: <Download size={20} /> },
        ] : []),
        { id: 'security', label: 'ความปลอดภัย', icon: <Lock size={20} /> },
    ];

    return (
        <aside className="w-full md:w-64 shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${activeTab === item.id
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-200'
                            : 'text-gray-500 hover:bg-white hover:shadow-sm hover:text-primary-600'
                            }`}
                    >
                        <div className={`${activeTab === item.id ? 'opacity-100 text-white' : 'opacity-70'}`}>
                            {item.icon}
                        </div>
                        <span className={activeTab === item.id ? 'text-white' : ''}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-8 p-6 bg-primary-50/50 rounded-3xl border border-primary-100 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <h4 className="font-bold text-primary-900 mb-2 relative z-10">ดูแลระบบ</h4>
                <p className="text-xs text-primary-700 mb-4 relative z-10 leading-relaxed">
                    จัดการข้อมูลและการตั้งค่าต่างๆ เพื่อให้ระบบทำงานได้อย่างมีประสิทธิภาพ
                </p>
                <button className="text-xs font-bold text-white bg-primary-600 px-4 py-2.5 rounded-xl w-full hover:bg-primary-700 hover:shadow-md transition-all relative z-10">
                    ดูคู่มือการใช้งาน
                </button>
            </div>
        </aside>
    );
};

export default SettingsSidebar;

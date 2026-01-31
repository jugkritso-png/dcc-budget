import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import SettingsGeneral from '../components/settings/SettingsGeneral';
import SettingsProfile from '../components/settings/SettingsProfile';
import SettingsPolicies from '../components/settings/SettingsPolicies';
import SettingsDepartments from '../components/settings/SettingsDepartments';
import SettingsUsers from '../components/settings/SettingsUsers';
import SettingsNotifications from '../components/settings/SettingsNotifications';
import SettingsBackup from '../components/settings/SettingsBackup';
import SettingsSecurity from '../components/settings/SettingsSecurity';
import SettingsActivityLogs from '../components/settings/SettingsActivityLogs';
import { Building, User, AlertCircle, Database, Users, Bell, Download, Lock, History } from 'lucide-react';

const Settings: React.FC = () => {
   const { user } = useBudget();
   const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'general' : 'profile');

   const menuItems = [
      ...(user?.role === 'admin' ? [
         { id: 'general', label: 'ข้อมูลทั่วไป', icon: <Building size={18} /> },
      ] : []),
      { id: 'profile', label: 'โปรไฟล์ส่วนตัว', icon: <User size={18} /> },
      ...(user?.role === 'admin' ? [
         { id: 'policies', label: 'นโยบาย', icon: <AlertCircle size={18} /> },
         { id: 'departments', label: 'หน่วยงาน', icon: <Database size={18} /> },
         { id: 'users', label: 'ผู้ใช้งาน', icon: <Users size={18} /> },
         { id: 'notifications', label: 'แจ้งเตือน', icon: <Bell size={18} /> },
         { id: 'activity', label: 'ประวัติการใช้งาน', icon: <History size={18} /> },
         { id: 'backup', label: 'สำรองข้อมูล', icon: <Download size={18} /> },
      ] : []),
      { id: 'security', label: 'ความปลอดภัย', icon: <Lock size={18} /> },
   ];

   return (
      <div className="animate-fade-in min-h-[calc(100vh-100px)] space-y-6">
         <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">ตั้งค่าระบบ</h2>
            <p className="text-gray-500 text-lg mb-6">จัดการข้อมูลพื้นฐานและการตั้งค่าต่างๆ ของระบบ</p>

            {/* Horizontal Tabs Navigation */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide">
               <div className="flex gap-1 min-w-max">
                  {menuItems.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === item.id
                           ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-200 scale-100'
                           : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600 scale-95 hover:scale-100'
                           }`}
                     >
                        <div className={activeTab === item.id ? 'text-white' : 'opacity-70'}>
                           {item.icon}
                        </div>
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 min-h-[600px] overflow-hidden relative">
            {/* Content Area */}
            <main className="w-full">
               {/* General Tab */}
               {activeTab === 'general' && <SettingsGeneral />}

               {/* Profile Tab */}
               {activeTab === 'profile' && <SettingsProfile />}

               {/* Policies Tab */}
               {activeTab === 'policies' && <SettingsPolicies />}

               {/* Departments Tab */}
               {activeTab === 'departments' && <SettingsDepartments />}

               {/* Users Tab */}
               {activeTab === 'users' && <SettingsUsers />}

               {/* Notifications Tab */}
               {activeTab === 'notifications' && <SettingsNotifications />}

               {/* Backup Tab */}
               {activeTab === 'backup' && <SettingsBackup />}

               {/* Activity Logs Tab */}
               {activeTab === 'activity' && <SettingsActivityLogs />}

               {/* Security Tab */}
               {activeTab === 'security' && <SettingsSecurity />}
            </main>
         </div>
      </div>
   );
};

export default Settings;
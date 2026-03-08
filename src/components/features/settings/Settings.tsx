"use client";
import React, { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { useAuth } from "@/context/AuthContext";
import SettingsGeneral from "@/components/features/settings/SettingsGeneral";
import SettingsProfile from "@/components/features/settings/SettingsProfile";
import SettingsPolicies from "@/components/features/settings/SettingsPolicies";
import SettingsDepartments from "@/components/features/settings/SettingsDepartments";
import SettingsUsers from "@/components/features/settings/SettingsUsers";
import SettingsNotifications from "@/components/features/settings/SettingsNotifications";
import SettingsBackup from "@/components/features/settings/SettingsBackup";
import SettingsActivityLogs from "@/components/features/settings/SettingsActivityLogs";
import SettingsAppearance from "@/components/features/settings/SettingsAppearance";
import {
  Building,
  User,
  AlertCircle,
  Database,
  Users,
  Bell,
  Download,
  Lock,
  History,
  Palette,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

import SettingsPermissions from "@/components/features/settings/SettingsPermissions";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    user?.role === "user" ? "profile" : "profile",
  ); // Default to profile for safety, can be smarter if needed

  const userRole = user?.role?.toLowerCase() || "";

  const menuItems = [
    ...(["admin", "manager", "finance"].includes(userRole)
      ? [{ id: "general", label: "ข้อมูลทั่วไป", icon: <Building size={18} /> }]
      : []),
    { id: "profile", label: "โปรไฟล์ส่วนตัว", icon: <User size={18} /> },
    { id: "appearance", label: "การแสดงผล", icon: <Palette size={18} /> }, // Added Appearance tab
    ...(["admin", "finance"].includes(userRole)
      ? [{ id: "policies", label: "นโยบาย", icon: <AlertCircle size={18} /> }]
      : []),
    ...(["admin", "finance", "manager"].includes(userRole)
      ? [{ id: "departments", label: "หน่วยงาน", icon: <Database size={18} /> }]
      : []),
    ...(userRole === "admin"
      ? [
          { id: "users", label: "ผู้ใช้งาน", icon: <Users size={18} /> },
          {
            id: "permissions",
            label: "สิทธิ์การใช้งาน",
            icon: <Shield size={18} />,
          },
        ]
      : []),
    ...(["admin", "finance", "manager", "approver"].includes(userRole)
      ? [
          { id: "notifications", label: "แจ้งเตือน", icon: <Bell size={18} /> },
          {
            id: "activity",
            label: "ประวัติการใช้งาน",
            icon: <History size={18} />,
          },
        ]
      : []),
    ...(userRole === "admin"
      ? [{ id: "backup", label: "สำรองข้อมูล", icon: <Download size={18} /> }]
      : []),
  ];

  return (
    <div className="animate-fade-in min-h-[calc(100vh-100px)] space-y-6">
      <div className="mb-8 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          ตั้งค่าระบบ {userRole === "admin" ? "(Admin)" : ""}
        </h2>
        <p className="text-gray-500 text-sm md:text-lg mb-6">
          จัดการข้อมูลพื้นฐานและการตั้งค่าต่างๆ ของระบบ | Role:{" "}
          {userRole || "none"}
        </p>

        {/* Horizontal Tabs Navigation */}
        <div className="bg-white rounded-[24px] p-2 md:p-3 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-[15px] font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#00A1E4] to-[#0066B3] text-white shadow-md scale-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#0066B3] scale-[0.98] hover:scale-100"
                }`}
              >
                <div
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "opacity-70 group-hover:opacity-100 transition-opacity"
                  }
                >
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-card min-h-[600px] overflow-hidden relative border border-gray-100 p-6 md:p-8">
        {/* Content Area */}
        <main className="w-full">
          {/* General Tab */}
          {activeTab === "general" && <SettingsGeneral />}

          {/* Profile Tab */}
          {activeTab === "profile" && <SettingsProfile />}

          {/* Appearance Tab */}
          {activeTab === "appearance" && <SettingsAppearance />}

          {/* Policies Tab */}
          {activeTab === "policies" && <SettingsPolicies />}

          {/* Departments Tab */}
          {activeTab === "departments" && <SettingsDepartments />}

          {/* Users Tab */}
          {activeTab === "users" && <SettingsUsers />}

          {/* Notifications Tab */}
          {activeTab === "notifications" && <SettingsNotifications />}

          {/* Backup Tab */}
          {activeTab === "backup" && <SettingsBackup />}

          {/* Activity Logs Tab */}
          {activeTab === "activity" && <SettingsActivityLogs />}

          {/* Permissions Tab */}
          {activeTab === "permissions" && <SettingsPermissions />}
        </main>
      </div>
    </div>
  );
};

export default Settings;

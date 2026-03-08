import React, { useState } from "react";
import { Download } from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const SettingsBackup: React.FC = () => {
  const { settings, departments, requests, categories } = useBudget();
  const { users, user } = useAuth();
  const [lastBackup, setLastBackup] = useState<string | null>(
    "2025-01-20 09:30:00",
  );

  const handleBackup = () => {
    const data = {
      settings,
      departments,
      users,
      currentUser: user,
      requests,
      categories,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dcc_budget_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastBackup(new Date().toLocaleString("th-TH"));
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="max-w-md w-full bg-white p-8 rounded-[24px] shadow-sm hover:shadow-card transition-shadow duration-300 border border-gray-100">
        <div className="w-16 h-16 bg-[#00A1E4]/10 text-[#0066B3] rounded-[16px] flex items-center justify-center mx-auto mb-6">
          <Download size={32} className="stroke-[2px]" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
          สำรองข้อมูล (Backup)
        </h3>
        <p className="text-gray-500 text-sm mb-8 font-medium">
          ดาวน์โหลดข้อมูลทั้งหมดของระบบเก็บไว้ในรูปแบบไฟล์ JSON เพื่อความปลอดภัย
        </p>

        <div className="mb-6 p-5 bg-[#F4F6F9] rounded-[16px] text-left border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">
            Backup ล่าสุด
          </p>
          <p className="text-sm font-bold text-gray-900">
            {lastBackup || "ยังไม่เคยสำรองข้อมูล"}
          </p>
        </div>

        <Button
          onClick={handleBackup}
          className="w-full bg-gradient-to-r from-[#00A1E4] to-[#0066B3] border-none rounded-[16px] py-4 font-bold hover:shadow-lg active:scale-95 shadow-md flex items-center justify-center"
        >
          <Download size={20} className="mr-2 stroke-[2.5px]" />
          ดาวน์โหลดไฟล์ Backup
        </Button>
      </div>
    </div>
  );
};

export default SettingsBackup;

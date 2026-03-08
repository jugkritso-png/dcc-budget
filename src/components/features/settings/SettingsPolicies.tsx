import React, { useState, useEffect } from "react";
import { Calendar, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useBudget } from "@/context/BudgetContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SettingsPolicies: React.FC = () => {
  const { settings, updateSettings } = useBudget();
  const [formData, setFormData] = useState({
    overBudgetAlert: false,
    fiscalYearCutoff: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        overBudgetAlert: settings.overBudgetAlert,
        fiscalYearCutoff: settings.fiscalYearCutoff,
      }));
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({ ...settings, ...formData });
    toast.success("บันทึกนโยบายเรียบร้อยแล้ว");
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            นโยบายงบประมาณ
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            กำหนดเงื่อนไขและข้อจำกัดในการใช้งบประมาณ
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="w-full md:w-auto bg-gradient-to-r from-[#00A1E4] to-[#0066B3] border-none shadow-md hover:shadow-lg w-full md:w-auto rounded-xl font-bold"
        >
          <Save size={18} className="mr-2" />
          บันทึก
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col justify-between p-6 md:p-8 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-card transition-all duration-300 gap-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#0066B3] transition-colors">
                แจ้งเตือนงบเกิน
              </h4>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="peer sr-only"
                  checked={formData.overBudgetAlert}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      overBudgetAlert: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="toggle"
                  className="block h-7 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-[#00A1E4] transition-colors duration-300 ease-in-out"
                ></label>
                <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm leading-none flex items-center justify-center pointer-events-none"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              ระบบจะแจ้งเตือนเมื่อมีการขออนุมัติเกินวงเงินคงเหลือ
              แต่ยังสามารถบันทึกได้
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 md:p-8 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-card transition-all duration-300 gap-4 group">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#0066B3] transition-colors">
              วันปิดงบประมาณ
            </h4>
            <div className="relative flex items-center gap-2 bg-gray-50/50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#00A1E4]/20 focus-within:border-[#00A1E4] transition-all overflow-hidden p-1">
              <div className="pl-3 z-10 text-[#00A1E4]">
                <Calendar size={20} />
              </div>
              <Input
                type="date"
                className="border-none focus:ring-0 bg-transparent h-12 flex-1 outline-none font-medium text-gray-700"
                value={formData.fiscalYearCutoff}
                onChange={(e) =>
                  setFormData({ ...formData, fiscalYearCutoff: e.target.value })
                }
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              กำหนดวันสุดท้ายที่อนุญาตให้ส่งคำขอสำหรับปีงบประมาณนี้
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPolicies;

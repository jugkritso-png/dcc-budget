import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Palette, Check } from "lucide-react";

const themes = [
  { id: "blue", name: "Blue", color: "#0085DB" },
  { id: "green", name: "Green", color: "#22C55E" },
  { id: "purple", name: "Purple", color: "#A855F7" },
  { id: "orange", name: "Orange", color: "#F97316" },
  { id: "red", name: "Red", color: "#EF4444" },
];

const SettingsAppearance: React.FC = () => {
  const { user } = useAuth();
  const { changeTheme } = useUI();
  const currentTheme = user?.theme || "blue";

  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 md:p-8">
          <CardTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Palette size={20} className="stroke-[2.5px]" />
            </div>
            การแสดงผล (Appearance)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-4">
                ธีมสีของระบบ (Color Theme)
              </label>
              <div className="flex flex-wrap gap-5">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`
                                            group relative w-[72px] h-[72px] rounded-[24px] flex items-center justify-center transition-all duration-300
                                            ${
                                              currentTheme === theme.id
                                                ? "ring-[6px] ring-offset-2 ring-primary-100 scale-[1.05] shadow-lg"
                                                : "hover:scale-[1.05] hover:shadow-md"
                                            }
                                        `}
                    style={{ backgroundColor: theme.color }}
                  >
                    {currentTheme === theme.id && (
                      <Check
                        className="text-white w-8 h-8 drop-shadow-md"
                        strokeWidth={3}
                      />
                    )}
                    <span className="absolute -bottom-8 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50/50 -mx-6 md:-mx-8 px-6 md:px-8 -mb-6 md:-mb-8 pb-6 md:pb-8">
              <p className="text-sm text-gray-500 font-medium">
                การเปลี่ยนธีมสีจำแนกตามสีเพื่อให้สามารถเปลี่ยนสีปุ่ม, แถบสถานะ,
                และองค์ประกอบหลักอื่นๆ ของระบบได้อย่างสวยงาม
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsAppearance;

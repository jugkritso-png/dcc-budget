import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Palette, Check } from 'lucide-react';

const themes = [
    { id: 'blue', name: 'Blue', color: '#0085DB' },
    { id: 'green', name: 'Green', color: '#22C55E' },
    { id: 'purple', name: 'Purple', color: '#A855F7' },
    { id: 'orange', name: 'Orange', color: '#F97316' },
    { id: 'red', name: 'Red', color: '#EF4444' },
];

const SettingsAppearance: React.FC = () => {
    const { user, changeTheme } = useBudget();
    const currentTheme = user?.theme || 'blue';

    const handleThemeChange = (themeId: string) => {
        changeTheme(themeId);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary-600" />
                        การแสดงผล (Appearance)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-3">ธีมสีของระบบ (Color Theme)</label>
                            <div className="flex flex-wrap gap-4">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeChange(theme.id)}
                                        className={`
                      group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
                      ${currentTheme === theme.id
                                                ? 'ring-4 ring-offset-2 ring-primary-300 scale-105 shadow-lg'
                                                : 'hover:scale-105 hover:shadow-md'
                                            }
                    `}
                                        style={{ backgroundColor: theme.color }}
                                    >
                                        {currentTheme === theme.id && (
                                            <Check className="text-white w-8 h-8 drop-shadow-md" strokeWidth={3} />
                                        )}
                                        <span className="absolute -bottom-8 text-xs font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {theme.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                การเปลี่ยนธีมสีจะส่งผลต่อปุ่ม, แถบสถานะ, และองค์ประกอบหลักอื่นๆ ของระบบ
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsAppearance;

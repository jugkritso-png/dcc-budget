import React from 'react';
import { Card } from '../ui/Card';
import { Wallet, Folder } from 'lucide-react';

interface DashboardCategoryListProps {
    displayCategories: any[];
    viewMode: 'grid' | 'table';
}

export const DashboardCategoryList: React.FC<DashboardCategoryListProps> = ({ displayCategories, viewMode }) => {
    // Helper to format currency
    const fmt = (num: number) => `฿${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCategories.map(cat => (
                    <Card key={cat.id} interactive className="p-6 relative overflow-hidden group">
                        {/* Decorative top border */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${cat.color.replace('bg-', 'bg-')}`}></div>

                        <div className="flex justify-between items-start mb-6 pt-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform ${cat.color} bg-opacity-90`}>
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{cat.name}</h4>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{cat.code}</span>
                                </div>
                            </div>
                            {/* Fund Badge */}
                            {cat.fund && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${cat.fund === 'I' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-cyan-50 text-cyan-600 border-cyan-100'}`}>
                                    {cat.fund === 'I' ? 'รายได้' : 'งบประมาณ'}
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">งบประมาณ:</span>
                                <span className="font-bold text-gray-900">{fmt(cat.allocated)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">ขอใช้ (Pending):</span>
                                <span className="font-bold text-orange-500">{fmt(cat.catPending)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">งบที่ได้รับอนุมัติ:</span>
                                <span className="font-bold text-primary-600">{fmt(cat.catApprovedAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200/50">
                                <span className="text-gray-900 font-bold">คงเหลือ:</span>
                                <span className="font-bold text-green-600">{fmt(cat.catRemaining)}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cat.percent > 80 ? 'text-red-600 bg-red-50' : cat.percent > 50 ? 'text-yellow-600 bg-yellow-50' : 'text-primary-600 bg-primary-50'}`}>
                                        {cat.percent > 80 ? 'วิกฤต' : cat.percent > 50 ? 'ปานกลาง' : 'ปกติ'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-600">
                                        {cat.percent.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded-full bg-gray-100 shadow-inner">
                                <div style={{ width: `${Math.min(cat.percent, 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${cat.percent > 80 ? 'bg-red-500' : cat.percent > 50 ? 'bg-yellow-500' : 'bg-primary-500'}`}></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="py-2 pl-6">หมวดหมู่</th>
                        <th className="py-2 text-right">งบตั้ง</th>
                        <th className="py-2 text-right">ขอใช้</th>
                        <th className="py-2 text-right">อนุมัติ</th>
                        <th className="py-2 text-right">คงเหลือ</th>
                        <th className="py-2 px-6 text-center w-32">สถานะ</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600">
                    {displayCategories.map(cat => (
                        <tr key={cat.id} className="group bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl relative overflow-hidden transform hover:-translate-y-0.5">
                            <td className="py-4 pl-6 align-middle rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-primary-500 bg-white group-hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${cat.color}`}>
                                        <Folder size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm">{cat.name}</div>
                                        <div className="flex gap-2">
                                            <div className="text-xs text-gray-400 font-medium">{cat.code}</div>
                                            {cat.fund && <div className="text-[10px] text-gray-400 font-medium border border-gray-100 rounded px-1">{cat.fund === 'I' ? 'รายได้' : 'งปม.'}</div>}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 text-right align-middle font-bold text-gray-700 bg-white group-hover:bg-blue-50/30">{fmt(cat.allocated)}</td>
                            <td className="py-4 text-right align-middle font-medium text-orange-500 bg-white group-hover:bg-blue-50/30">{fmt(cat.catPending)}</td>
                            <td className="py-4 text-right align-middle font-bold text-blue-600 bg-white group-hover:bg-blue-50/30">{fmt(cat.catApprovedAmount)}</td>
                            <td className="py-4 text-right align-middle font-bold text-green-600 bg-white group-hover:bg-blue-50/30">{fmt(cat.catRemaining)}</td>
                            <td className="py-4 px-6 align-middle rounded-r-2xl bg-white group-hover:bg-blue-50/30">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                                        <span>{cat.percent.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${cat.percent > 80 ? 'bg-red-500' : cat.percent > 50 ? 'bg-yellow-500' : 'bg-primary-500'}`}
                                            style={{ width: `${Math.min(cat.percent, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

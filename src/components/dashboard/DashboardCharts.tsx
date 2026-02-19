import React from 'react';
import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useChartDimensions } from '../../hooks/useChartDimensions';
import { getHexColor } from '../../lib/utils';

interface DashboardChartsProps {
    processedCategories: any[];
    displayCategories: any[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ processedCategories, displayCategories }) => {
    const { ref: pieRef, dimensions: pieDim } = useChartDimensions();
    const { ref: barRef, dimensions: barDim } = useChartDimensions();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <Card className="lg:col-span-1 p-4 md:p-6 min-w-0">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                        <PieChartIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">สัดส่วนงบประมาณ</h3>
                        <p className="text-xs text-gray-400">แบ่งตามหมวดหมู่</p>
                    </div>
                </div>
                <div ref={pieRef} style={{ width: '100%', height: 240, position: 'relative' }} className="md:!h-[320px]">
                    {pieDim.width > 0 && (
                        <ResponsiveContainer width="99%" height="100%" minHeight={100} minWidth={0} debounce={100}>
                            <PieChart>
                                <Pie
                                    data={processedCategories.map(cat => ({
                                        name: cat.name,
                                        value: cat.allocated,
                                        color: cat.color
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {processedCategories.map((cat, index) => (
                                        <Cell key={`cell-${index}`} fill={getHexColor(cat.color)} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {processedCategories.slice(0, 6).map((cat, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                <span className="text-gray-600 text-xs font-medium truncate">{cat.name}</span>
                            </div>
                            <span className="font-bold text-gray-900 text-xs">฿{cat.allocated.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Budget Comparison Bar Chart */}
            <Card className="lg:col-span-2 p-4 md:p-6 min-w-0">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">เปรียบเทียบงบประมาณ</h3>
                        <p className="text-xs text-gray-400">งบตั้ง vs อนุมัติ vs คงเหลือ</p>
                    </div>
                </div>
                <div ref={barRef} style={{ width: '100%', height: 280, position: 'relative' }} className="md:!h-[400px]">
                    {barDim.width > 0 && (
                        <ResponsiveContainer width="100%" height="100%" debounce={100}>
                            <BarChart
                                data={displayCategories.map(cat => ({
                                    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
                                    fullName: cat.name,
                                    งบตั้ง: cat.allocated,
                                    อนุมัติ: cat.catApprovedAmount,
                                    คงเหลือ: cat.catRemaining,
                                }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
                                />
                                <YAxis
                                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
                                    tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}K`}
                                />
                                <Tooltip
                                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                                    labelFormatter={(label) => {
                                        const item = displayCategories.find(cat =>
                                            cat.name.startsWith(label.replace('...', ''))
                                        );
                                        return item?.name || label;
                                    }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    iconType="circle"
                                />
                                <Bar dataKey="งบตั้ง" fill="#93C5FD" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="อนุมัติ" fill="#003964" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="คงเหลือ" fill="#00C4CC" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    );
};

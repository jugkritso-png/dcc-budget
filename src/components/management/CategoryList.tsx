import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Category } from '../../types';
import CategoryCard from './CategoryCard';

interface CategoryListProps {
    categories: Category[];
    selectedYear: number;
    onYearChange: (year: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddClick: () => void;
    onEditClick: (cat: Category) => void;
    onDeleteClick: (id: string) => void;
    onViewClick: (cat: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedYear,
    onYearChange,
    searchQuery,
    onSearchChange,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onViewClick
}) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-card border border-white/60 ring-1 ring-black/5 p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500"></div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold">รายการหมวดหมู่</h3>
                    <select value={selectedYear} onChange={(e) => onYearChange(Number(e.target.value))} className="bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-bold border border-primary-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-primary-50 transition-colors">
                        <option value={2570}>ปีงบประมาณ 2570</option>
                        <option value={2569}>ปีงบประมาณ 2569</option>
                        <option value={2568}>ปีงบประมาณ 2568</option>
                    </select>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="ค้นหาหมวดหมู่..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all shadow-inner" />
                    </div>
                    <button onClick={onAddClick} className="bg-gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary-500/40 flex items-center gap-2 whitespace-nowrap transition-all hover:-translate-y-0.5">
                        <Plus size={20} /> <span className="hidden sm:inline">เพิ่มหมวดหมู่ใหม่</span>
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {categories.map((cat) => {
                    const percent = cat.allocated > 0 ? (cat.used / cat.allocated) * 100 : 0;
                    const isCritical = percent > 80;

                    return (
                        <div key={cat.id} onClick={() => onViewClick(cat)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cat.color}`}></div>

                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${cat.color}`}>
                                        {/* Simple Folder Icon placeholder or import it if needed */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">{cat.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mt-1 inline-block">{cat.code}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditClick(cat); }}
                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                    >
                                        <div className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></div>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteClick(cat.id); }}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <div className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg></div>
                                    </button>
                                </div>
                            </div>

                            <div className="pl-3 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">งบประมาณ</span>
                                    <span className="font-bold text-gray-900">฿{cat.allocated.toLocaleString()}</span>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs text-gray-500">ใช้ไปแล้ว</span>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-gray-900">฿{cat.used.toLocaleString()}</span>
                                            <span className={`text-[10px] ml-1 ${isCritical ? 'text-red-500 font-bold' : 'text-gray-400'}`}>({percent.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : cat.color}`}
                                            style={{ width: `${Math.min(percent, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                            <th className="py-2 pl-6">ชื่อหมวดหมู่</th>
                            <th className="py-2 text-right">งบประมาณ</th>
                            <th className="py-2 text-right">สถานะการใช้</th>
                            <th className="py-2 text-right pr-6">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {categories.map((cat) => (
                            <CategoryCard
                                key={cat.id}
                                category={cat}
                                onClick={onViewClick}
                                onEdit={onEditClick}
                                onDelete={onDeleteClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;

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
        <div className="bg-white rounded-3xl shadow-card border border-gray-100/50 p-4 md:p-8 relative overflow-hidden">
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

            <div className="overflow-x-auto">
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

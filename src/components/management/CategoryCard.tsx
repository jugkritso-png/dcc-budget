import React from 'react';
import { Folder, Edit2, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import Swal from 'sweetalert2';

interface CategoryCardProps {
    category: Category;
    onClick: (cat: Category) => void;
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, onEdit, onDelete }) => {
    const percent = category.allocated > 0 ? (category.used / category.allocated) * 100 : 0;
    const isCritical = percent > 80;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        Swal.fire({
            title: 'ยืนยันการลบ',
            html: `คุณต้องการลบหมวดหมู่ <strong>"${category.name}"</strong> ใช่หรือไม่?<br><br><small class="text-gray-500">การลบจะไม่สามารถย้อนกลับได้</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(category.id);
                Swal.fire({
                    title: 'ลบสำเร็จ!',
                    text: 'หมวดหมู่ถูกลบเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <tr
            className="group bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer rounded-2xl relative overflow-hidden transform hover:-translate-y-0.5"
            onClick={() => onClick(category)}
        >
            {/* Floating card look hack: Apply border radius to the first and last cells */}
            <td className="py-5 pl-6 align-middle rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-primary-500 bg-white group-hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 transition-transform group-hover:scale-110 group-hover:rotate-3 ${category.color}`}>
                        <Folder size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">{category.name}</span>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 group-hover:border-primary-200 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">{category.code}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            {category.segment || 'No Segment'}
                        </div>
                    </div>
                </div>
            </td>
            <td className="py-5 text-right font-bold text-gray-700 align-middle text-lg bg-white group-hover:bg-blue-50/30">฿{category.allocated.toLocaleString()}</td>
            <td className="py-5 text-right align-middle bg-white group-hover:bg-blue-50/30">
                <div className="flex flex-col items-end gap-1.5">
                    <span className="font-bold text-gray-900">฿{category.used.toLocaleString()}</span>
                    <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : category.color}`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                    </div>
                    <span className={`text-[10px] font-medium ${isCritical ? 'text-red-600' : 'text-gray-400'}`}>
                        {percent.toFixed(1)}% Used
                    </span>
                </div>
            </td>
            <td className="py-5 text-right pr-6 align-middle">
                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(category); }}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip"
                        title="แก้ไข"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CategoryCard;

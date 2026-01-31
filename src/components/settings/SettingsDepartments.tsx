import React, { useState, useEffect } from 'react';
import { Database, Plus, Check, X, Pencil, Trash2, Building, Search, LayoutGrid, List as ListIcon, Palette, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Department } from '../../types';
import { useBudget } from '../../context/BudgetContext';

const SettingsDepartments: React.FC = () => {
    const { departments, addDepartment, updateDepartment, deleteDepartment } = useBudget();
    const [newDept, setNewDept] = useState({ name: '', code: '', color: '#3B82F6' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRowData, setEditRowData] = useState<Department | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);

    // Filter departments based on search
    const filteredDepartments = departments?.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Auto-increment code logic
    useEffect(() => {
        if (!editingId && departments && isAddMode) {
            const numericCodes = departments
                .map(d => parseInt(d.code))
                .filter(n => !isNaN(n));

            if (numericCodes.length > 0) {
                const maxCode = Math.max(...numericCodes);
                const nextCode = (maxCode + 1).toString().padStart(3, '0');
                setNewDept(prev => ({ ...prev, code: nextCode }));
            } else {
                setNewDept(prev => ({ ...prev, code: '001' }));
            }
        }
    }, [departments, editingId, isAddMode]);

    const handleAddDepartment = async () => {
        if (newDept.name && newDept.code) {
            await addDepartment({
                id: '',
                name: newDept.name,
                code: newDept.code,
                color: newDept.color
            });
            setNewDept({ name: '', code: '', color: '#3B82F6' });
            setIsAddMode(false);
            toast.success('เพิ่มหน่วยงานเรียบร้อยแล้ว');
        } else {
            toast.error("กรุณากรอกรหัสและชื่อหน่วยงาน");
        }
    };

    const handleDelete = (id: string, name: string) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `คุณต้องการลบหน่วยงาน <strong>"${name}"</strong> ใช่หรือไม่?<br><span class="text-sm text-gray-500">การกระทำนี้ไม่สามารถย้อนกลับได้</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
            background: '#fff',
            customClass: {
                popup: 'rounded-3xl shadow-xl border border-gray-100',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDepartment(id);
                toast.success('ลบหน่วยงานเรียบร้อยแล้ว');
            }
        });
    };

    const startInlineEdit = (dept: Department) => {
        setEditingId(dept.id);
        setEditRowData({ ...dept });
    };

    const saveInlineEdit = async () => {
        if (editRowData && editRowData.name && editRowData.code) {
            await updateDepartment(editRowData);
            setEditingId(null);
            setEditRowData(null);
            toast.success('อัปเดตข้อมูลสำเร็จ');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full bg-gray-50/50 min-h-screen">

            {/* Header Section */}
            <div className="p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Building className="text-primary-600" size={28} />
                            จัดการหน่วยงาน
                        </h2>
                        <p className="text-gray-500 mt-1">
                            มีทั้งหมด <span className="text-primary-600 font-bold">{departments?.length || 0}</span> หน่วยงานในระบบ
                        </p>
                    </div>

                    {!isAddMode && (
                        <button
                            onClick={() => setIsAddMode(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            <span>เพิ่มหน่วยงานใหม่</span>
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อหน่วยงาน หรือ รหัส..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="px-8 pb-12 overflow-y-auto flex-1">

                {/* Add New Department Form (Collapsible) */}
                {isAddMode && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-white rounded-3xl p-1 shadow-card border border-primary-100 ring-4 ring-primary-50">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                        <Plus size={18} />
                                    </div>
                                    สร้างหน่วยงานใหม่
                                </h3>
                                <button onClick={() => setIsAddMode(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">รหัส (Code)</label>
                                    <input
                                        type="text"
                                        value={newDept.code}
                                        readOnly
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-gray-700 text-center"
                                    />
                                </div>
                                <div className="md:col-span-6 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">ชื่อหน่วยงาน (Department Name) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newDept.name}
                                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                        placeholder="ระบุชื่อหน่วยงาน..."
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">สีระบุ (Color)</label>
                                    <div className="relative h-[50px] w-full">
                                        <input
                                            type="color"
                                            value={newDept.color}
                                            onChange={(e) => setNewDept({ ...newDept, color: e.target.value })}
                                            className="absolute inset-0 w-full h-full cursor-pointer rounded-xl border-0 p-0 overflow-hidden"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex items-end">
                                    <button
                                        onClick={handleAddDepartment}
                                        className="w-full h-[50px] bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                                    >
                                        ยืนยัน
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filteredDepartments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">ไม่พบข้อมูลหน่วยงาน</h3>
                        <p className="text-gray-500">ลองค้นหาด้วยคำอื่น หรือเพิ่มหน่วยงานใหม่</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                                    <th className="py-2 pl-6">Code</th>
                                    <th className="py-2">Department Name</th>
                                    <th className="py-2 text-center">Color Tag</th>
                                    <th className="py-2 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                {filteredDepartments.map(dept => (
                                    <tr
                                        key={dept.id}
                                        className="group bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl relative overflow-hidden transform hover:-translate-y-0.5"
                                    >
                                        {/* Code Column */}
                                        <td className="py-4 pl-6 align-middle rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-primary-500 bg-white group-hover:bg-blue-50/30 transition-colors w-32">
                                            {editingId === dept.id && editRowData ? (
                                                <input
                                                    type="text"
                                                    value={editRowData.code}
                                                    onChange={(e) => setEditRowData({ ...editRowData, code: e.target.value })}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-center"
                                                />
                                            ) : (
                                                <div className="font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 w-fit text-sm">
                                                    {dept.code}
                                                </div>
                                            )}
                                        </td>

                                        {/* Name Column */}
                                        <td className="py-4 align-middle bg-white group-hover:bg-blue-50/30">
                                            {editingId === dept.id && editRowData ? (
                                                <input
                                                    type="text"
                                                    value={editRowData.name}
                                                    onChange={(e) => setEditRowData({ ...editRowData, name: e.target.value })}
                                                    className="w-full p-2 bg-white border border-primary-500 ring-2 ring-primary-100 rounded-lg text-sm font-bold"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`} style={{ backgroundColor: dept.color }}>
                                                        <Building size={18} />
                                                    </div>
                                                    <span className="font-medium text-gray-800 text-base group-hover:text-primary-700 transition-colors">
                                                        {dept.name}
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Color Column */}
                                        <td className="py-4 align-middle text-center bg-white group-hover:bg-blue-50/30 w-32">
                                            {editingId === dept.id && editRowData ? (
                                                <div className="flex justify-center">
                                                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                                                        <input
                                                            type="color"
                                                            value={editRowData.color}
                                                            onChange={(e) => setEditRowData({ ...editRowData, color: e.target.value })}
                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                                                    <span className="text-xs font-mono text-gray-400 uppercase">{dept.color}</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions Column */}
                                        <td className="py-4 align-middle text-right pr-6 rounded-r-2xl bg-white group-hover:bg-blue-50/30 w-40">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                {editingId === dept.id ? (
                                                    <>
                                                        <button
                                                            onClick={saveInlineEdit}
                                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="บันทึก"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="ยกเลิก"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startInlineEdit(dept)}
                                                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                            title="แก้ไข"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(dept.id, dept.name)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="ลบ"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsDepartments;

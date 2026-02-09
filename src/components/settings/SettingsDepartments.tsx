import React, { useState, useEffect } from 'react';
import { Building, Plus, Check, X, Pencil, Trash2, Search, LayoutGrid, Palette, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Department } from '../../types';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 md:p-8 h-full flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex flex-col h-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                                <LayoutGrid size={24} />
                            </div>
                            จัดการหน่วยงาน
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 ml-12">
                            มีทั้งหมด <span className="text-primary-600 font-bold">{departments?.length || 0}</span> หน่วยงานในระบบ
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                className="pl-11 pr-4 py-2.5 h-auto rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300 w-48 transition-all hover:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {!isAddMode && (
                            <Button
                                onClick={() => setIsAddMode(true)}
                                className="bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl"
                            >
                                <Plus size={20} className="mr-2" />
                                <span>เพิ่มหน่วยงาน</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2 pb-12">
                    <AnimatePresence mode="popLayout">
                        {isAddMode && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-xl border border-primary-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                                                <Plus size={18} />
                                            </div>
                                            สร้างหน่วยงานใหม่
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={() => setIsAddMode(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                                            <X size={20} />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">รหัส</label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    value={newDept.code}
                                                    readOnly
                                                    className="bg-gray-50 border-gray-200 text-center font-mono font-bold text-primary-600 text-lg tracking-wider"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">ชื่อหน่วยงาน <span className="text-red-500">*</span></label>
                                            <Input
                                                type="text"
                                                autoFocus
                                                value={newDept.name}
                                                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                                placeholder="ระบุชื่อหน่วยงาน..."
                                                className="bg-white border-gray-200 focus:ring-primary-500/20"
                                                icon={Building}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">สีระบุ</label>
                                            <div className="relative h-[48px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-[1.02]">
                                                <input
                                                    type="color"
                                                    value={newDept.color}
                                                    onChange={(e) => setNewDept({ ...newDept, color: e.target.value })}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference text-white font-mono text-xs uppercase">
                                                    {newDept.color}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex items-end">
                                            <Button
                                                onClick={handleAddDepartment}
                                                className="w-full h-[48px] bg-primary-600 hover:bg-primary-700 border-none shadow-lg shadow-primary-200 hover:shadow-xl transition-all"
                                            >
                                                บันทึก
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {filteredDepartments.length === 0 ? (
                        <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-gray-900 font-bold text-xl mb-2">ไม่พบข้อมูลหน่วยงาน</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">ลองค้นหาด้วยคำอื่น หรือกดปุ่ม "เพิ่มหน่วยงาน" เพื่อสร้างรายการใหม่</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {filteredDepartments.map((dept, index) => (
                                    <motion.div
                                        key={dept.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                        className="group bg-white hover:bg-primary-50/40 border border-transparent hover:border-primary-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 md:gap-6 relative overflow-hidden"
                                    >
                                        {/* Color Indicator */}
                                        <div className="w-1.5 self-stretch rounded-full bg-gray-200 group-hover:scale-y-110 transition-transform duration-300" style={{ backgroundColor: dept.color }}></div>

                                        {/* Code Badge */}
                                        <div className="shrink-0">
                                            {editingId === dept.id && editRowData ? (
                                                <input
                                                    className="w-16 text-center font-mono font-bold text-sm bg-white border border-primary-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-200 text-primary-700"
                                                    value={editRowData.code}
                                                    onChange={(e) => setEditRowData({ ...editRowData, code: e.target.value })}
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-500 font-mono text-sm font-bold shadow-sm group-hover:shadow-inner group-hover:bg-white transition-all">
                                                    <span className="text-[10px] uppercase text-gray-400 font-normal mb-0.5">Code</span>
                                                    {dept.code}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Info */}
                                        <div className="flex-1 min-w-0">
                                            {editingId === dept.id && editRowData ? (
                                                <div className="flex items-center gap-4">
                                                    <Input
                                                        autoFocus
                                                        className="h-10 text-lg font-bold bg-white focus:bg-white"
                                                        value={editRowData.name}
                                                        onChange={(e) => setEditRowData({ ...editRowData, name: e.target.value })}
                                                    />
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                        <input
                                                            type="color"
                                                            value={editRowData.color}
                                                            onChange={(e) => setEditRowData({ ...editRowData, color: e.target.value })}
                                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                                                            {dept.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-xs text-gray-500">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }}></div>
                                                                Color Tag
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-4 group-hover:translate-x-0">
                                            {editingId === dept.id ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={saveInlineEdit}
                                                        className="w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all border border-green-200"
                                                        title="บันทึก"
                                                    >
                                                        <Save size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingId(null)}
                                                        className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:scale-110 transition-all border border-gray-200"
                                                        title="ยกเลิก"
                                                    >
                                                        <X size={18} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => startInlineEdit(dept)}
                                                        className="w-10 h-10 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm hover:scale-110 transition-all"
                                                        title="แก้ไข"
                                                    >
                                                        <Pencil size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(dept.id, dept.name)}
                                                        className="w-10 h-10 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:shadow-sm hover:scale-110 transition-all"
                                                        title="ลบ"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsDepartments;

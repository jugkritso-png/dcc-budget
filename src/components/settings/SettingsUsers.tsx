import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, User, Lock, Mail, Briefcase, BadgeCheck, Users, Search, Shield, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';

const SettingsUsers: React.FC = () => {
    const { users, addUser, updateUser, deleteUser, departments } = useBudget();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'user',
        section: '',
        position: ''
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddUser = () => {
        setEditingUser(null);
        setUserForm({ username: '', password: '', name: '', email: '', role: 'user', section: '', position: '' });
        setIsUserModalOpen(true);
    };

    const handleEditUser = (userToEdit: any) => {
        setEditingUser(userToEdit);
        setUserForm({
            username: userToEdit.username,
            password: '',
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
            section: userToEdit.department || '',
            position: userToEdit.position || ''
        });
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `คุณต้องการลบผู้ใช้งาน <strong>"${name}"</strong> ใช่หรือไม่?<br><span class="text-xs text-gray-500">ข้อมูลจะถูกลบถาวรและไม่สามารถกู้คืนได้</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
            background: '#fff',
            customClass: {
                popup: 'rounded-[32px] shadow-2xl border border-gray-100',
                confirmButton: 'rounded-xl shadow-lg shadow-red-200',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                toast.success('ลบผู้ใช้งานเรียบร้อยแล้ว');
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
            }
        }
    };

    const saveUser = async () => {
        // Update Logic
        if (editingUser) {
            try {
                const updatePayload: any = {
                    name: userForm.name,
                    email: userForm.email.trim(),
                    role: userForm.role,
                    department: userForm.section,
                    position: userForm.position
                };
                if (userForm.password) {
                    updatePayload.password = userForm.password;
                }

                await updateUser(editingUser.id, updatePayload);
                setIsUserModalOpen(false);
                toast.success("แก้ไขข้อมูลผู้ใช้งานเรียบร้อยแล้ว");
                setEditingUser(null);
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
            }
        } else {
            // Create Logic
            if (!userForm.username || !userForm.password || !userForm.name || !userForm.email) {
                toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
                return;
            }

            try {
                await addUser({
                    username: userForm.username.trim(),
                    password: userForm.password,
                    name: userForm.name,
                    email: userForm.email.trim(),
                    role: userForm.role,
                    department: userForm.section,
                    position: userForm.position
                });
                setIsUserModalOpen(false);
                toast.success("เพิ่มผู้ใช้งานเรียบร้อยแล้ว");
            } catch (error: any) {
                const errorMsg = error.message || "เกิดข้อผิดพลาด";
                if (errorMsg.includes("Username")) toast.error("Username นี้มีผู้ใช้งานแล้ว");
                else if (errorMsg.includes("Email")) toast.error("Email นี้มีผู้ใช้งานแล้ว");
                else toast.error("เกิดข้อผิดพลาด: " + errorMsg);
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 md:p-8 h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-3">
                            <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                                <Users size={24} />
                            </div>
                            จัดการผู้ใช้งาน
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 md:ml-12 text-center md:text-left">
                            บริหารจัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึงทั้งหมด <span className="text-primary-600 font-bold">{users.length}</span> บัญชี
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                            <input
                                type="text"
                                placeholder="ค้นหาผู้ใช้งาน..."
                                className="pl-11 pr-4 py-2.5 h-auto rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300 w-full md:w-64 transition-all hover:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleAddUser}
                            className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl"
                        >
                            <Plus size={20} className="mr-2" />
                            <span>เพิ่มผู้ใช้งาน</span>
                        </Button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2 pb-12">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-gray-900 font-bold text-xl mb-2">ไม่พบผู้ใช้งานที่ค้นหา</h3>
                            <p className="text-gray-500">ลองค้นหาด้วยคำอื่น หรือกดปุ่ม "เพิ่มผู้ใช้งาน" เพื่อสร้างรายการใหม่</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence>
                                {filteredUsers.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                        className="group relative bg-white hover:bg-white/80 border border-gray-100 hover:border-primary-100 rounded-[24px] p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col"
                                    >
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-2 group-hover:translate-x-0">
                                            <button onClick={() => handleEditUser(user)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="แก้ไข">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" title="ลบ">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner overflow-hidden shrink-0 ${user.role === 'admin' ? 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white' :
                                                'bg-gray-50 text-gray-500'
                                                }`}>
                                                {(() => {
                                                    const cleanAvatar = user.avatar ? String(user.avatar).trim() : '';
                                                    const isImage = cleanAvatar.startsWith('http') || cleanAvatar.startsWith('data:');

                                                    if (isImage) {
                                                        return <img src={cleanAvatar} alt={user.name} className="w-full h-full object-cover" />;
                                                    }
                                                    return (
                                                        <span className="truncate max-w-full px-1">
                                                            {cleanAvatar && cleanAvatar.length <= 3 ? cleanAvatar : user.name.charAt(0)}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">{user.name}</h4>
                                                <p className="text-xs text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 inline-block mt-1 max-w-full truncate">@{user.username}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-2 flex-1">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="truncate" title={user.email}>{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                    <Briefcase size={14} />
                                                </div>
                                                <span className="truncate">{user.department || '-'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                user.role === 'finance' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    user.role === 'manager' || user.role === 'approver' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Active
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Edit/Add User Modal */}
                <Modal
                    isOpen={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    title={editingUser ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsUserModalOpen(false)}>ยกเลิก</Button>
                            <Button onClick={saveUser} className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-md shadow-primary-200">
                                {editingUser ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-5 py-2">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Username
                                {editingUser && <span className="ml-2 text-[10px] text-gray-400 font-normal normal-case">(แก้ไขไม่ได้)</span>}
                            </label>
                            <Input
                                type="text"
                                placeholder="ระบุชื่อผู้ใช้งาน"
                                value={userForm.username}
                                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                disabled={!!editingUser}
                                className={`bg-gray-50/50 transition-all duration-200 ${!editingUser ? 'focus:bg-white focus:shadow-md focus:border-primary-200' : ''}`}
                                icon={User}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Password
                                {editingUser ?
                                    <span className="ml-2 text-[10px] text-primary-500 font-normal normal-case">(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</span> :
                                    <span className="text-red-500 ml-1">*</span>
                                }
                            </label>
                            <Input
                                type="password"
                                placeholder={editingUser ? "••••••••" : "กำหนดรหัสผ่านเข้าใช้งาน"}
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                icon={Lock}
                                className="bg-gray-50/50 focus:bg-white focus:shadow-md focus:border-primary-200 transition-all duration-200"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                ชื่อ-นามสกุล <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="เช่น สมชาย ใจดี"
                                value={userForm.name}
                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                icon={BadgeCheck}
                                className="bg-gray-50/50 focus:bg-white focus:shadow-md focus:border-primary-200 transition-all duration-200"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                อีเมล <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                placeholder="example@dcc.ac.th"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                icon={Mail}
                                className="bg-gray-50/50 focus:bg-white focus:shadow-md focus:border-primary-200 transition-all duration-200"
                            />
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">หน่วยงาน</label>
                                <Select
                                    value={userForm.section}
                                    onChange={(value) => setUserForm({ ...userForm, section: value })}
                                    options={[
                                        { value: '', label: '-- เลือกหน่วยงาน --' },
                                        ...departments.map(d => ({ value: d.name, label: d.name }))
                                    ]}
                                />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ตำแหน่ง</label>
                                <Input
                                    type="text"
                                    placeholder="ระบุตำแหน่ง"
                                    value={userForm.position || ''}
                                    onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
                                    icon={Briefcase}
                                    className="bg-gray-50/50 focus:bg-white focus:shadow-md focus:border-primary-200 transition-all duration-200"
                                />
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">สิทธิ์การใช้งาน (Role)</label>
                            <div className="relative">
                                <Select
                                    value={userForm.role}
                                    onChange={(value) => setUserForm({ ...userForm, role: value })}
                                    options={[
                                        { value: 'user', label: 'User (ผู้ใช้งานทั่วไป)' },
                                        { value: 'admin', label: 'Administrator (ผู้ดูแลระบบ)' },
                                        { value: 'finance', label: 'Finance (การเงิน)' },
                                        { value: 'manager', label: 'Manager (ผู้จัดการ)' },
                                        { value: 'approver', label: 'Approver (ผู้อนุมัติ)' }
                                    ]}
                                />
                            </div>
                        </motion.div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default SettingsUsers;

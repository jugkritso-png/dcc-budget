import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'user',
        section: ''
    });

    const handleAddUser = () => {
        setEditingUser(null);
        setUserForm({ username: '', password: '', name: '', email: '', role: 'user', section: '' });
        setIsUserModalOpen(true);
    };

    const handleEditUser = (userToEdit: any) => {
        setEditingUser(userToEdit);
        setUserForm({
            username: userToEdit.username,
            password: '', // Leave blank to keep unchanged
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
            section: userToEdit.department || '',
        });
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = async (id: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบผู้ใช้งาน?',
            text: "ข้อมูลผู้ใช้งานจะถูกลบถาวร ไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบข้อมูล',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'rounded-2xl shadow-xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                // Context usually handles toast, but we can add secondary confirmation if context doesn't
                Swal.fire({
                    title: 'ลบข้อมูลสำเร็จ!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl' }
                });
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
            }
        }
    };

    const saveUser = async () => {
        if (editingUser) {
            // Update Logic
            try {
                const updatePayload: any = {
                    name: userForm.name,
                    email: userForm.email,
                    role: userForm.role,
                    department: userForm.section
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
            if (!userForm.username || !userForm.password || !userForm.name) {
                toast.error("กรุณากรอก Username, Password และ ชื่อ");
                return;
            }
            try {
                await addUser({
                    ...userForm,
                    department: userForm.section
                });
                setIsUserModalOpen(false);
                toast.success("เพิ่มผู้ใช้งานเรียบร้อยแล้ว");
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน");
            }
        }
    };

    return (
        <div className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        จัดการผู้ใช้งาน (Users)
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">บริหารจัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึง</p>
                </div>
                <Button
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                    <Plus size={18} />
                    เพิ่มผู้ใช้งาน
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="group flex flex-col bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-card transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                    {user.avatar}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} className="text-gray-400 hover:text-primary-600 hover:bg-primary-50">
                                        <Pencil size={18} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-rose-600 hover:bg-rose-50">
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-1">{user.name}</h4>
                            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                               ${user.role === 'Administrator' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'Finance' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {user.role}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit/Add User Modal */}
            <Modal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title={editingUser ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username {editingUser && <span className="text-xs text-gray-400 font-normal">(แก้ไขไม่ได้)</span>}</label>
                        <Input
                            type="text"
                            placeholder="ระบุชื่อผู้ใช้งาน"
                            value={userForm.username}
                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                            disabled={!!editingUser}
                            className="bg-gray-50 bg-opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password
                            {editingUser && <span className="text-xs text-primary-500 font-normal ml-2">(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</span>}
                            {!editingUser && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <Input
                            type="password"
                            placeholder={editingUser ? "••••••••" : "กำหนดรหัสผ่านเข้าใช้งาน"}
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                        <Input
                            type="text"
                            placeholder="เช่น สมชาย ใจดี"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
                        <Input
                            type="email"
                            placeholder="example@dcc.ac.th"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">หน่วยงาน (Section)</label>
                            <Select
                                value={userForm.section}
                                onChange={(e) => setUserForm({ ...userForm, section: e.target.value })}
                            >
                                <option value="">-- เลือกหน่วยงาน --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ตำแหน่ง</label>
                            <Input
                                type="text"
                                placeholder="ระบุตำแหน่ง"
                                value={userForm.position || ''}
                                onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">สิทธิ์การใช้งาน (Role)</label>
                        <Select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        >
                            <option value="user">User (ผู้ใช้งานทั่วไป)</option>
                            <option value="admin">Administrator (ผู้ดูแลระบบ)</option>
                        </Select>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsUserModalOpen(false)}>ยกเลิก</Button>
                        <Button onClick={saveUser} className="bg-gradient-to-r from-primary-600 to-indigo-600">
                            {editingUser ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SettingsUsers;

import React, { useState, useEffect } from 'react';
import { Save, Shield, Check, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';
import { Permission } from '../../types';

interface RolePermission {
    role: string;
    label: string;
}

const ROLES: RolePermission[] = [
    { role: 'admin', label: 'Admin' },
    { role: 'finance', label: 'Finance' },
    { role: 'manager', label: 'Manager' },
    { role: 'approver', label: 'Approver' },
    { role: 'user', label: 'User' },
];

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
    { id: 'view_dashboard', label: 'View Dashboard', description: 'Access the main dashboard' },
    { id: 'view_budget', label: 'View Budget', description: 'View budget requests list' },
    { id: 'manage_budget', label: 'Manage Budget', description: 'Create/Edit budget requests' },
    { id: 'approve_budget', label: 'Approve Requests', description: 'Approve/Reject budget requests' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access reports and charts' },
    { id: 'view_activity_log', label: 'View Logs', description: 'View system activity history' },
    { id: 'manage_departments', label: 'Manage Departments', description: 'Add/Edit departments' },
    { id: 'manage_policies', label: 'Manage Policies', description: 'Edit fiscal policies' },
    { id: 'manage_users', label: 'Manage Users', description: 'Add/Edit system users' },
    { id: 'manage_settings', label: 'Manage Settings', description: 'Access general settings' },
];

const SettingsPermissions: React.FC = () => {
    const { settings, updateSettings, user } = useBudget();
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (settings?.permissions) {
            setPermissions(settings.permissions);
        } else {
            // Initialize with defaults if empty
            setPermissions({
                admin: PERMISSIONS.map(p => p.id), // Admin gets everything
                finance: ['view_dashboard', 'view_budget', 'manage_budget', 'approve_budget', 'view_analytics', 'manage_policies', 'manage_departments', 'view_activity_log'],
                manager: ['view_dashboard', 'view_budget', 'approve_budget', 'view_analytics', 'manage_departments'],
                approver: ['view_dashboard', 'view_budget', 'approve_budget', 'view_activity_log'],
                user: ['view_dashboard', 'view_budget', 'manage_budget'],
            });
        }
    }, [settings]);

    const togglePermission = (role: string, permissionId: Permission) => {
        if (role === 'admin') return; // Admin always has all permissions

        setPermissions(prev => {
            const currentRolePermissions = prev[role] || [];
            const hasPermission = currentRolePermissions.includes(permissionId);

            let newRolePermissions;
            if (hasPermission) {
                newRolePermissions = currentRolePermissions.filter(p => p !== permissionId);
            } else {
                newRolePermissions = [...currentRolePermissions, permissionId];
            }

            return {
                ...prev,
                [role]: newRolePermissions
            };
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            await updateSettings({
                ...settings,
                permissions: permissions
            });
            setIsDirty(false);
            toast.success('บันทึกสิทธิ์การใช้งานเรียบร้อยแล้ว');
        } catch (error) {
            console.error(error);
            toast.error('บันทึกไม่สำเร็จ');
        }
    };

    const hasPermission = (role: string, permissionId: Permission) => {
        if (role === 'admin') return true;
        return (permissions[role] || []).includes(permissionId);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="text-primary-600" size={24} />
                        กำหนดสิทธิ์การใช้งาน (Permissions Matrix)
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">ตั้งค่าสิทธิ์การเข้าถึงเมนูและการทำงานต่างๆ ของแต่ละ Role</p>
                </div>
                {isDirty && (
                    <Button
                        onClick={handleSave}
                        className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-lg hover:shadow-xl active:scale-95 animate-pulse"
                    >
                        <Save size={18} className="mr-2" />
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 min-w-[200px]">Permission / Role</th>
                                {ROLES.map(role => (
                                    <th key={role.role} className="px-4 py-4 text-center min-w-[100px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`px-2 py-0.5 rounded text-xs ${role.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                                role.role === 'finance' ? 'bg-emerald-100 text-emerald-700' :
                                                    role.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                                        role.role === 'approver' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {role.label}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {PERMISSIONS.map((perm) => (
                                <tr key={perm.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{perm.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{perm.description}</div>
                                    </td>
                                    {ROLES.map(role => {
                                        const isEnabled = hasPermission(role.role, perm.id);
                                        const isAdmin = role.role === 'admin';

                                        return (
                                            <td key={`${role.role}-${perm.id}`} className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => togglePermission(role.role, perm.id)}
                                                    disabled={isAdmin}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isAdmin
                                                        ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed opacity-50'
                                                        : isEnabled
                                                            ? 'bg-primary-100 text-primary-600 shadow-sm hover:scale-110 hover:shadow-md'
                                                            : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400'
                                                        }`}
                                                >
                                                    {isEnabled || isAdmin ? <Check size={18} strokeWidth={3} /> : <X size={18} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">หมายเหตุ</h4>
                    <p className="text-blue-600 text-xs mt-1">
                        - <strong>Admin</strong> จะมีสิทธิ์ครบถ้วนเสมอ ไม่สามารถแก้ไขได้<br />
                        - การเปลี่ยนแปลงสิทธิ์จะมีผลทันทีหลังจากกดบันทึก แต่ User ที่ใช้งานอยู่จำเป็นต้อง Refresh หน้าจอเพื่อรับค่าใหม่
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPermissions;

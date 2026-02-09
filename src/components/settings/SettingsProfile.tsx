import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, User, Briefcase, Mail, Phone, Building, Check, Monitor, CreditCard, QrCode, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const SettingsProfile: React.FC = () => {
    const { user, updateUserProfile, departments, changePassword } = useBudget();
    const [securityForm, setSecurityForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: false
    });
    const [profileForm, setProfileForm] = useState({
        name: '',
        englishName: '',
        employeeId: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        theme: 'light',
        language: 'th',
        bio: '',
        avatar: '',
        startDate: ''
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                englishName: user.englishName || '', // Now connected to backend
                employeeId: user.employeeId || '',
                position: user.position || '',
                department: user.department || '',
                email: user.email || '',
                phone: user.phone || '',
                theme: (user.theme as string) || 'light',
                language: (user.language as string) || 'th',
                bio: user.bio || '',
                avatar: user.avatar || '',
                startDate: user.startDate || ''  // Now connected to backend
            });
        }
    }, [user]);

    const handleProfileSave = async () => {
        try {
            await updateUserProfile(profileForm);
            // In a real app, we would save englishName and startDate here
            toast.success('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSecuritySave = async () => {
        if (!securityForm.currentPassword || !securityForm.newPassword) {
            toast.error('กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่');
            return;
        }
        if (securityForm.newPassword !== securityForm.confirmPassword) {
            toast.error('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }
        try {
            await changePassword(securityForm.currentPassword, securityForm.newPassword);
            toast.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
            setSecurityForm({ ...securityForm, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง หรือเกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 md:p-8">
            <div className="flex flex-col xl:flex-row gap-12 items-start justify-center">

                {/* Left Column: Vertical ID Card */}
                <div className="flex flex-col gap-6 sticky top-8 items-center">

                    {/* ID Card Container */}
                    <div className="group perspective-1000 w-[320px]">
                        <div className="relative transform transition-all duration-500 group-hover:scale-[1.02]">
                            {/* Card Ratio: Vertical ID Card - approx 2:3.2 */}
                            <div className="w-full aspect-[2/3.2] rounded-[24px] bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden relative flex flex-col items-center border border-gray-100">

                                {/* Background Pattern/Texture */}
                                <div className="absolute inset-0 z-0">
                                    {/* Decorative Bubbles/Shapes - Smoother Gradients */}
                                    <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-purple-100/50 blur-3xl mix-blend-multiply"></div>
                                    <div className="absolute -left-20 top-1/3 w-72 h-72 rounded-full bg-orange-50/60 blur-3xl mix-blend-multiply"></div>
                                    <div className="absolute right-0 bottom-0 w-full h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                                    {/* Texture overlay */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
                                </div>

                                {/* Header */}
                                <div className="z-10 w-full px-6 py-7 flex gap-4 items-center shrink-0">
                                    {/* Logo Placeholder - Simulating the WU logo with better styling */}
                                    {/* <div className="w-12 h-16 bg-gradient-to-br from-[#E65100] to-[#6A1B9A] rounded-xl flex items-center justify-center shadow-md shrink-0 relative overflow-hidden ring-1 ring-white/50">
                                        <div className="absolute inset-0 bg-white/20"></div>
                                        <div className="text-white font-bold text-[10px] leading-tight text-center drop-shadow-sm">WU<br/>LOGO</div>
                                     </div> */}
                                    <img src="/Logo-WU.svg" alt="WU Logo" className="w-[52px] h-auto drop-shadow-sm" />

                                    <div className="flex flex-col justify-center">
                                        <span className="text-[#3f1052] font-extrabold text-[1.15rem] leading-none tracking-tight">มหาวิทยาลัยวลัยลักษณ์</span>
                                        <span className="text-[#591b6e] font-bold text-[0.65rem] tracking-[0.08em] uppercase mt-1 opacity-90">WALAILAK UNIVERSITY</span>
                                    </div>
                                </div>

                                {/* Watermark Logo (Large, Faded) */}
                                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none mix-blend-multiply">
                                    <Building size={280} />
                                </div>

                                {/* Photo Section */}
                                <div className="relative w-full px-8 mt-1 flex flex-col items-end z-10 shrink-0">
                                    <div className="w-[120px] h-[150px] bg-white rounded-2xl p-1.5 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.15)] mb-1 relative group overflow-hidden ring-1 ring-gray-100">
                                        {profileForm.avatar ? (
                                            <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                                                <User size={64} className="opacity-40" />
                                            </div>
                                        )}
                                        {/* Hover Overlay for Photo */}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                                            <Camera className="text-white/90 drop-shadow-md" size={28} />
                                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                                        </div>
                                    </div>
                                    <div className="w-full text-right px-1">
                                        <span className="text-[#F57F17] font-bold text-lg tracking-wider font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">#{user?.employeeId || '6018000101'}</span>
                                    </div>
                                </div>

                                {/* Identity Section */}
                                <div className="w-full px-7 mt-2 z-10 flex-1 flex flex-col justify-center min-h-0 overflow-visible text-left pb-4">
                                    {/* Name Group */}
                                    <div className="mb-3 shrink-0 relative">
                                        <div className="text-[#310b42] font-extrabold text-[1.5rem] leading-[1.3] mb-1 break-words overflow-visible tracking-tight drop-shadow-sm">
                                            {profileForm.name || 'นางสาวฉมธร ชูช่วยสุวรรณ'}
                                        </div>
                                        <div className="text-[#5e35b1] font-semibold text-[0.85rem] leading-tight break-words tracking-wide uppercase opacity-90">
                                            {profileForm.englishName || 'Miss Chamatorn Chuchuaysuwan'}
                                        </div>
                                    </div>

                                    <div className="h-[3px] w-[50px] bg-gradient-to-r from-[#F57C00] to-[#FFB74D] mb-4 rounded-full shrink-0"></div>

                                    {/* Position Group */}
                                    <div className="space-y-1 overflow-visible">
                                        <div className="text-[#E65100] font-bold text-[1.1rem] leading-snug break-words drop-shadow-sm">
                                            {profileForm.position || 'รักษาการแทนหัวหน้าแผนก'}
                                        </div>
                                        <div className="text-[#F57C00] font-medium text-[0.9rem] leading-snug break-words opacity-95">
                                            {profileForm.department || 'ศูนย์การแพทย์มหาวิทยาลัยวลัยลักษณ์'}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Section (Bottom Curve) */}
                                <div className="mt-auto w-full h-[90px] relative overflow-hidden shrink-0">
                                    {/* Curved Backgrounds */}
                                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-gray-50/80 to-transparent clip-path-wave"></div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-50 rounded-full blur-2xl"></div>

                                    <div className="absolute inset-0 px-8 py-5 flex justify-end items-end">
                                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-1">
                                            <QrCode size={48} className="text-black/80" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-400 mt-2">คลิกที่รูปภาพบนบัตรเพื่อเปลี่ยนรูปโปรไฟล์</p>
                    </div>

                </div>

                {/* Right Column: Edit Forms */}
                <div className="flex-1 space-y-6 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h2>
                            <p className="text-gray-500 text-sm">จัดการข้อมูลโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
                        </div>
                        <Button
                            onClick={handleProfileSave}
                            variant="primary"
                            className="bg-gradient-to-r from-primary-600 to-indigo-600 border-none shadow-md hover:shadow-lg hover:shadow-primary-200"
                        >
                            <Save size={18} className="mr-2" />
                            บันทึก
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {/* Section 1: Personal Information */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
                                <User className="text-primary-600" size={20} />
                                ข้อมูลส่วนตัว (Personal Information)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล (TH) <span className="text-red-500">*</span></label>
                                    <Input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        icon={User}
                                        placeholder="ระบุชื่อภาษาไทย"
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล (EN)</label>
                                    <Input
                                        type="text"
                                        value={profileForm.englishName}
                                        onChange={(e) => setProfileForm({ ...profileForm, englishName: e.target.value })}
                                        icon={User}
                                        placeholder="Full Name in English"
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Work Information */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
                                <Briefcase className="text-orange-500" size={20} />
                                ข้อมูลการทำงาน (Work Information)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">ตำแหน่ง</label>
                                    <Input
                                        type="text"
                                        value={profileForm.position}
                                        onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                                        icon={Briefcase}
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">แผนก / สังกัด</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                            <Building size={18} />
                                        </div>
                                        <Select
                                            value={profileForm.department}
                                            onChange={(value) => setProfileForm({ ...profileForm, department: value })}
                                            options={[
                                                { value: '', label: '-- เลือกแผนก --' },
                                                ...(departments || []).map(d => ({ value: d.name, label: d.name }))
                                            ]}
                                            className="pl-12 bg-gray-50/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">รหัสพนักงาน</label>
                                    <Input
                                        type="text"
                                        value={profileForm.employeeId}
                                        disabled
                                        icon={CreditCard}
                                        className="bg-gray-100/80 text-gray-500 cursor-not-allowed border-dashed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">วันที่เริ่มงาน (Start Date)</label>
                                    <Input
                                        type="text"
                                        value={profileForm.startDate}
                                        onChange={(e) => setProfileForm({ ...profileForm, startDate: e.target.value })}
                                        placeholder="DD MMM YYYY (เช่น 04 เม.ย. 2560)"
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contact Information */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
                                <Phone className="text-purple-500" size={20} />
                                ข้อมูลติดต่อ (Contact Information)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">อีเมล</label>
                                    <Input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        icon={Mail}
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
                                    <Input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        icon={Phone}
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Security Information */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Lock className="text-rose-500" size={20} />
                                    ความปลอดภัย (Security)
                                </h3>
                                <Button
                                    onClick={handleSecuritySave}
                                    size="sm"
                                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border-none shadow-none"
                                >
                                    เปลี่ยนรหัสผ่าน
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">รหัสผ่านปัจจุบัน</label>
                                    <Input
                                        type="password"
                                        value={securityForm.currentPassword}
                                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                                        icon={Lock}
                                        placeholder="ระบุรหัสผ่านเดิมเพื่อยืนยัน"
                                        className="bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">รหัสผ่านใหม่</label>
                                        <Input
                                            type="password"
                                            value={securityForm.newPassword}
                                            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                                            icon={Lock}
                                            placeholder="กำหนดรหัสผ่านใหม่"
                                            className="bg-gray-50/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                                        <Input
                                            type="password"
                                            value={securityForm.confirmPassword}
                                            onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                                            icon={Lock}
                                            placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                                            className="bg-gray-50/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-50 mt-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">การยืนยันตัวตน 2 ชั้น (2FA)</p>
                                            <p className="text-xs text-gray-500">เพิ่มความปลอดภัยด้วย OTP</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={securityForm.twoFactor}
                                            onChange={e => setSecurityForm({ ...securityForm, twoFactor: e.target.checked })}
                                            className="toggle toggle-primary h-5 w-9 rounded-full bg-gray-200 cursor-pointer appearance-none checked:bg-green-500 transition-colors relative before:content-[''] before:absolute before:left-[2px] before:top-[2px] before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform before:checked:translate-x-4 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <style>{`
                .clip-path-curve {
                    clip-path: ellipse(130% 100% at 50% 100%);
                }
                .clip-path-wave {
                    clip-path: ellipse(150% 100% at 50% 100%);
                }
            `}</style>
        </div>
    );
};

export default SettingsProfile;

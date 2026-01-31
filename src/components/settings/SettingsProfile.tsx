import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, User, Briefcase, Shield, Mail, Phone, Building, Check, Globe, Sun, Moon, Monitor, CreditCard, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudget } from '../../context/BudgetContext';

const SettingsProfile: React.FC = () => {
    const { user, updateUserProfile, departments } = useBudget();
    const [profileForm, setProfileForm] = useState({
        name: '',
        employeeId: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        theme: 'light',
        language: 'th',
        bio: '',
        avatar: ''
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                employeeId: user.employeeId || '',
                position: user.position || '',
                department: user.department || '',
                email: user.email || '',
                phone: user.phone || '',
                theme: (user.theme as string) || 'light',
                language: (user.language as string) || 'th',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleProfileSave = async () => {
        try {
            await updateUserProfile(profileForm);
            toast.success('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว');
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 md:p-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">

                {/* Left Column: Card & Identity */}
                <div className="w-full xl:w-[420px] flex flex-col gap-6 sticky top-8">

                    {/* Perspective Container */}
                    <div className="group perspective-1000 w-full mx-auto">
                        <div className="relative">
                            {/* Realistic Credit Card Ratio: 85.6mm x 53.98mm (~1.586) */}
                            <div className="w-full aspect-[1.586/1] rounded-[24px] bg-gradient-to-br from-[#091E3A] via-[#2F80ED] to-[#2D9CDB] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-[24px] text-white relative overflow-hidden transition-all duration-500 transform group-hover:scale-[1.02] group-hover:rotate-y-2 border border-white/10 flex flex-col justify-between select-none ring-1 ring-white/20">

                                {/* Texture & Effects */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-900/40 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                                {/* Top Row */}
                                <div className="flex justify-between items-start z-10 relative">
                                    <div className="flex items-center gap-3">
                                        {/* EMV Chip */}
                                        <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f9e9a5] to-[#a38027] shadow-inner border border-[#8e6e1d] flex items-center justify-center relative overflow-hidden opacity-90">
                                            <div className="absolute inset-0 border-[0.5px] border-black/20 rounded-[inherit]"></div>
                                            <div className="w-full h-[1px] bg-black/20 absolute top-1/3"></div>
                                            <div className="w-full h-[1px] bg-black/20 absolute bottom-1/3"></div>
                                            <div className="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
                                            <div className="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
                                            <div className="w-4 h-3 border border-black/20 rounded-[2px]"></div>
                                        </div>
                                        <Wifi className="text-white/60 rotate-90" size={20} />
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black italic text-xl tracking-tighter text-white drop-shadow-md">NEXT</div>
                                        <div className="text-[0.55rem] uppercase tracking-[0.2em] text-blue-100/80 font-medium">Budget Privilege</div>
                                    </div>
                                </div>

                                {/* Main Card Number */}
                                <div className="z-10 mt-2 relative">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-2xl sm:text-3xl tracking-[0.14em] text-white drop-shadow-lg font-medium" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.3)' }}>
                                            {user?.employeeId ? (
                                                <>
                                                    {user.employeeId.substring(0, 4)}&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;{user.employeeId.slice(-4).padStart(4, '0')}
                                                </>
                                            ) : (
                                                "0000  0000  0000  0000"
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[0.45rem] uppercase text-white/70 tracking-widest">VALID<br />THRU</span>
                                        <span className="font-mono text-sm text-white/90 tracking-widest">12/28</span>
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="flex justify-between items-end z-10 relative">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm sm:text-base uppercase tracking-widest text-white/95 drop-shadow-md truncate w-full pr-4" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>
                                            {profileForm.name || 'YOUR NAME'}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                                        <div className="text-[0.55rem] uppercase text-white/80 font-bold tracking-wider">
                                            {profileForm.position || 'MEMBER'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicator (Outside Card) */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/40">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">System Active</span>
                            </div>
                        </div>

                        {/* Avatar Section - Separate from Card */}
                        <div className="mt-16 flex items-center gap-6 bg-white p-5 rounded-2xl shadow-card border border-gray-100">
                            <div className="relative group/avatar cursor-pointer">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-indigo-500">
                                    <div className="w-full h-full rounded-full border-2 border-white bg-gray-100 overflow-hidden relative">
                                        {profileForm.avatar ? (
                                            <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={24} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            <Camera size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden absolute inset-0 cursor-pointer" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">รูปโปรไฟล์</h4>
                                <p className="text-xs text-gray-500 mt-1">อัปโหลดรูปภาพของคุณ<br />(แนะนำขนาด 1:1)</p>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors">
                                <Edit2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="flex-1 space-y-8 w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h2>
                            <p className="text-gray-500 text-sm">จัดการข้อมูลโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
                        </div>
                        <button
                            onClick={handleProfileSave}
                            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Save size={18} />
                            <span>บันทึก</span>
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-card space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></div>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="ระบุชื่อภาษาไทย"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">รหัสพนักงาน</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><CreditCard size={18} /></div>
                                    <input
                                        type="text"
                                        value={profileForm.employeeId}
                                        disabled
                                        className="w-full pl-10 p-3 bg-gray-100 border border-transparent rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">ตำแหน่ง</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Briefcase size={18} /></div>
                                    <input
                                        type="text"
                                        value={profileForm.position}
                                        onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">แผนก / สังกัด</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Building size={18} /></div>
                                    <select
                                        value={profileForm.department}
                                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium"
                                    >
                                        <option value="">-- เลือกแผนก --</option>
                                        {departments && departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">อีเมล</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></div>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></div>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Bio (เกี่ยวกับฉัน)</label>
                                <textarea
                                    rows={3}
                                    placeholder="เพิ่มคำอธิบายสั้นๆ เกี่ยวกับตัวคุณ..."
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none font-medium text-gray-600"
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-card">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Monitor className="text-primary-500" size={20} />
                            การแสดงผล (Appearance)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'light', label: 'Light Mode', icon: <Sun size={24} /> },
                                { id: 'dark', label: 'Dark Mode', icon: <Moon size={24} /> },
                                { id: 'system', label: 'System', icon: <Monitor size={24} /> }
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setProfileForm({ ...profileForm, theme: theme.id })}
                                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${profileForm.theme === theme.id
                                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md ring-2 ring-primary-200 ring-offset-2'
                                        : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {theme.icon}
                                    <span className="font-semibold text-sm">{theme.label}</span>
                                    {profileForm.theme === theme.id && (
                                        <div className="absolute top-3 right-3 text-primary-600">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsProfile;

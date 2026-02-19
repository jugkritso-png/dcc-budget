import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Lock, ArrowRight, Loader, Mail, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
    const { login, loginWithGoogle } = useBudget();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await login(emailOrUsername, password);
            if (!success) {
                setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-primary-900 justify-center items-center">
                {/* Background Image / Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-800/95 to-primary-950/90 mix-blend-multiply"></div>
                    {/* Animated Blobs */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-500/30 rounded-full blur-[120px] -mr-32 -mt-32 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-[100px] -ml-20 -mb-20"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-16 text-white max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-100 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse box-shadow-glow"></span>
                        ระบบบริหารจัดการงบประมาณองค์กร
                    </div>
                    <h1 className="text-6xl font-extrabold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 tracking-tight">
                        Smart Budget <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-primary-200">Management</span>
                    </h1>
                    <p className="text-xl text-primary-100/80 mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 font-light">
                        ยกระดับการบริหารงบประมาณด้วยความโปร่งใส รวดเร็ว และแม่นยำ ด้วยระบบ Digital Trust Platform ที่ทันสมัยที่สุด
                    </p>

                    {/* Feature Pills */}
                    <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-default group">
                            <div className="text-3xl font-bold mb-1 text-white group-hover:text-accent-300 transition-colors">100%</div>
                            <div className="text-sm text-primary-200 font-medium">Data Security</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-default group">
                            <div className="text-3xl font-bold mb-1 text-white group-hover:text-accent-300 transition-colors">Real-time</div>
                            <div className="text-sm text-primary-200 font-medium">Budget Tracking</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-10 left-10 text-[10px] text-white/30 font-mono z-10 tracking-widest uppercase">
                    Secured by DCC Platform • v2.0.0
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-white relative">
                {/* Mobile Header (only visible on small screens) */}
                <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="font-bold text-lg">DCC Budget</span>
                    </div>
                </div>

                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    {/* Header */}
                    <div className="space-y-3 text-center lg:text-left">
                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 mx-auto lg:mx-0 shadow-sm">
                            <ShieldCheck size={28} />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">ยินดีต้อนรับกลับมา!</h2>
                        <p className="text-gray-500 font-medium">
                            เข้าสู่ระบบเพื่อดำเนินการบริหารงบประมาณ
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-in shake font-medium shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">อีเมลหรือชื่อผู้ใช้งาน</label>
                                <div className="relative group w-full">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={emailOrUsername}
                                        onChange={(e) => setEmailOrUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium hover:bg-white"
                                        placeholder="example@email.com หรือ username"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">รหัสผ่าน</label>
                                <div className="relative group w-full">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium hover:bg-white"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500 font-bold">Or continue with</span>
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        setIsLoading(true);
                                        try {
                                            const success = await loginWithGoogle(credentialResponse.credential);
                                            if (!success) {
                                                setError('Google Sign-In Failed');
                                            }
                                        } catch (err) {
                                            setError('Google Sign-In Error');
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }
                                }}

                                onError={() => {
                                    setError('Google Sign-In Failed');
                                }}
                                shape="circle"
                                theme="outline"
                                text="signin_with"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary-500/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    เข้าสู่ระบบ
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-6 text-center text-sm text-gray-500 border-t border-gray-100 space-y-3">
                        <p>
                            ไม่มีบัญชีผู้ใช้งาน?{' '}
                            <span className="text-primary-600 font-bold cursor-pointer hover:underline">
                                ติดต่อผู้ดูแลระบบ
                            </span>
                        </p>
                        <p>
                            <a href="#" className="text-primary-600 font-bold hover:text-primary-800 hover:underline transition-colors">
                                ลืมรหัสผ่าน?
                            </a>
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-6 text-[10px] text-gray-400 font-medium">
                    © 2026 DCC Motor Ltd. System v2.0.0
                </div>
            </div>
        </div>
    );
};

export default Login;

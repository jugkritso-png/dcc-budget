'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Wallet,
    FileText,
    CheckCircle,
    Settings,
    BarChart3,
    LayoutGrid,
    LogOut,
} from 'lucide-react'
import { useBudget } from '@/context/BudgetContext'

export function Sidebar() {
    const { settings, logout, hasPermission } = useBudget()
    const pathname = usePathname()

    const navItems = [
        { id: '/dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
        ...(hasPermission('view_budget') ? [{ id: '/budget', label: 'งบประมาณ', icon: Wallet }] : []),
        { id: '/request', label: 'ขอใช้งบประมาณ', icon: FileText },
        { id: '/report', label: 'รายงานผล', icon: CheckCircle },
        ...(hasPermission('manage_budget') || hasPermission('manage_departments') ? [{ id: '/management', label: 'การจัดการ', icon: Settings }] : []),
        ...(hasPermission('view_analytics') ? [{ id: '/analytics', label: 'วิเคราะห์', icon: BarChart3 }] : []),
        { id: '/settings', label: 'ตั้งค่า', icon: LayoutGrid },
    ]

    return (
        <aside className="hidden md:flex flex-col w-[240px] h-screen fixed top-0 left-0 z-20"
            style={{
                background: 'var(--surface-card)',
                borderRight: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
            }}>

            {/* ── Logo / Brand ── */}
            <div className="px-5 pt-6 pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0066B3, #005191)' }}>
                        <Wallet className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {settings?.orgName || 'DCC Budget'}
                        </p>
                        <p className="text-[10px] font-medium tracking-wider uppercase"
                            style={{ color: 'var(--text-tertiary)' }}>
                            Budget Manager
                        </p>
                    </div>
                </div>
            </div>

            {/* Section label */}
            <div className="px-5 mb-1.5">
                <p className="text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: 'var(--text-tertiary)' }}>เมนูหลัก</p>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.id || (item.id !== '/' && pathname?.startsWith(item.id))
                    return (
                        <Link
                            key={item.id}
                            href={item.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                            style={isActive ? {
                                background: 'linear-gradient(135deg, #0066B3, #005191)',
                                color: '#FFFFFF',
                                boxShadow: '0 4px 12px rgba(0,102,179,0.25)',
                            } : {
                                color: 'var(--text-secondary)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-50)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-700)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = '';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <item.icon
                                className="w-[18px] h-[18px] flex-shrink-0"
                                strokeWidth={isActive ? 2.2 : 1.8}
                                style={{ color: isActive ? 'white' : 'var(--text-tertiary)' }}
                            />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* ── Logout ── */}
            <div className="px-3 pb-4 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--accent-red-light)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--accent-red)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
                    }}
                >
                    <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    <span>ออกจากระบบ</span>
                </button>
            </div>

            {/* ── Version ── */}
            <div className="px-5 pb-4">
                <p className="text-[10px]" style={{ color: 'var(--border-default)' }}>v2.0.0 • DCC Platform</p>
            </div>
        </aside>
    )
}

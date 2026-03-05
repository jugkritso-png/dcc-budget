'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import { useBudget } from '@/context/BudgetContext'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'ภาพรวม',
    '/budget': 'งบประมาณ',
    '/request': 'ขอใช้งบประมาณ',
    '/report': 'รายงานผล',
    '/management': 'การจัดการ',
    '/analytics': 'วิเคราะห์',
    '/settings': 'ตั้งค่า',
}

export function Header() {
    const { user } = useBudget()
    const pathname = usePathname()

    const pageTitle = Object.entries(PAGE_TITLES).find(([key]) =>
        key !== '/' && pathname?.startsWith(key)
    )?.[1] ?? 'หน้าหลัก'

    const avatarContent = () => {
        const cleanAvatar = user?.avatar ? String(user.avatar).trim() : ''
        const isImage = cleanAvatar.startsWith('http') || cleanAvatar.startsWith('data:')
        if (isImage) return <img src={cleanAvatar} alt={user?.name} className="w-full h-full object-cover rounded-full" />
        return cleanAvatar?.length <= 3 ? cleanAvatar : (user?.name?.substring(0, 2).toUpperCase() || 'US')
    }

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-30">
            {/* Left: Page title */}
            <div className="hidden md:block">
                <h2 className="text-lg font-bold text-gray-900">{pageTitle}</h2>
                <p className="text-[11px] text-gray-400 font-medium -mt-0.5">
                    ยินดีต้อนรับ, {user?.name}
                </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 ml-auto">
                {/* Notification */}
                <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                    <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>

                {/* Divider */}
                <div className="w-px h-7 bg-gray-100" />

                {/* User */}
                <div className="flex items-center gap-2.5">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user?.name}</p>
                        <p className="text-[10px] text-primary-600 font-semibold mt-0.5">
                            {user?.role === 'admin' ? 'Administrator' : 'Staff'}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {avatarContent()}
                    </div>
                </div>
            </div>
        </header>
    )
}

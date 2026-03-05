
'use client'

import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F7FAFC] text-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden md:ml-[240px]">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

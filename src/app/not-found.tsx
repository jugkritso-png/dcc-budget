
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-600">404</h1>
                <h2 className="mt-4 text-3xl font-semibold text-gray-900">ไม่พบหน้าที่คุณต้องการ</h2>
                <p className="mt-2 text-gray-600">ขออภัย เราไม่พบหน้าที่คุณกำลังมองหา</p>
                <div className="mt-10">
                    <Link
                        href="/"
                        className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        กลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    )
}

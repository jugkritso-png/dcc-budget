
import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Check } from 'lucide-react';
import { Page } from '../types';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: 'success' | 'warning' | 'info';
    targetPage?: Page;
    date: string;
}

interface NotificationsProps {
    onNavigate: (page: Page) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
    // Mock Data - effectively this would come from an API/Context in a real app
    const allNotifications: Notification[] = [
        { id: 1, title: 'อนุมัติงบประมาณ', message: 'คำขอ #REQ-2024-001 ได้รับการอนุมัติแล้ว โดยผู้มีอำนาจ', time: '5 นาทีที่แล้ว', unread: true, type: 'success', targetPage: Page.BUDGET, date: 'วันนี้' },
        { id: 2, title: 'แจ้งเตือนงบประมาณ', message: 'หมวด "ค่าเดินทาง" ใกล้เต็มวงเงินแล้ว (เหลือ 5%)', time: '1 ชั่วโมงที่แล้ว', unread: true, type: 'warning', targetPage: Page.DASHBOARD, date: 'วันนี้' },
        { id: 3, title: 'คำขอใหม่', message: 'มีคำขอเบิกจ่ายใหม่รอการตรวจสอบ #REQ-2024-002', time: '2 ชั่วโมงที่แล้ว', unread: false, type: 'info', targetPage: Page.BUDGET, date: 'วันนี้' },
        { id: 4, title: 'บันทึกค่าใช้จ่ายสำเร็จ', message: 'บันทึกค่าใช้จ่าย "ค่ารับรองลูกค้า" เรียบร้อยแล้ว', time: 'เมื่อวาน', unread: false, type: 'success', targetPage: Page.BUDGET, date: 'เมื่อวาน' },
        { id: 5, title: 'เข้าสู่ระบบสำเร็จ', message: 'ตรวจพบการเข้าสู่ระบบจากอุปกรณ์ใหม่', time: 'เมื่อวาน', unread: false, type: 'info', targetPage: Page.SETTINGS, date: 'เมื่อวาน' },
        { id: 6, title: 'ปรับปรุงงบประมาณ', message: 'มีการโยกงบประมาณเข้าหมวด "วัสดุสำนักงาน"', time: '2 วันที่แล้ว', unread: false, type: 'info', targetPage: Page.BUDGET, date: 'สัปดาห์นี้' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-white" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-white" />;
            default: return <Info className="w-5 h-5 text-white" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-500 shadow-green-200';
            case 'warning': return 'bg-amber-500 shadow-amber-200';
            default: return 'bg-blue-500 shadow-blue-200';
        }
    };

    // Group by date
    const grouped = allNotifications.reduce((acc, curr) => {
        if (!acc[curr.date]) acc[curr.date] = [];
        acc[curr.date].push(curr);
        return acc;
    }, {} as Record<string, typeof allNotifications>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">การแจ้งเตือน</h2>
                    <p className="text-gray-500 mt-1 font-medium">ประวัติการแจ้งเตือนและการทำงานทั้งหมด</p>
                </div>
                <button className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                {Object.entries(grouped).map(([date, items], groupIndex) => (
                    <div key={date}>
                        <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-500">{date}</span>
                        </div>
                        <div>
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => item.targetPage && onNavigate(item.targetPage)}
                                    className={`p-6 flex gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group border-b border-gray-100 last:border-0 ${item.unread ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${getBgColor(item.type)} flex-shrink-0`}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-base font-bold ${item.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {item.title}
                                                {item.unread && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                            </h3>
                                            <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-4">{item.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {allNotifications.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>ไม่มีการแจ้งเตือน</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;

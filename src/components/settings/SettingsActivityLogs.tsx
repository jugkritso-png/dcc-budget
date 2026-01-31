import React, { useEffect, useState } from 'react';
import { Clock, User as UserIcon, Activity, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ActivityLog {
    id: string;
    userId: string | null;
    user: {
        name: string;
        role: string;
        avatar: string | null;
        username: string;
    } | null;
    action: string;
    details: string;
    ipAddress: string | null;
    createdAt: string;
}

const SettingsActivityLogs: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3002/api/activity-logs');
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionColor = (action: string) => {
        if (action.includes('LOGIN')) return 'text-green-600 bg-green-50';
        if (action.includes('CREATE')) return 'text-blue-600 bg-blue-50';
        if (action.includes('UPDATE')) return 'text-orange-600 bg-orange-50';
        if (action.includes('DELETE')) return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">ประวัติการใช้งานระบบ</h3>
                    <p className="text-gray-500 text-sm mt-1">บันทึกการกระทำต่างๆ ของผู้ใช้งานในระบบ (Audit Logs)</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={fetchLogs}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full"
                    title="Refresh Logs"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">เวลา</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">การกระทำ</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                    </tr>
                                ))
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                            <Clock size={14} />
                                            {formatDate(log.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.user ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                                                        {log.user.avatar || log.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{log.user.name}</p>
                                                        <p className="text-xs text-gray-400">@{log.user.username}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 opacity-60">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <span className="text-sm text-gray-500 font-medium">System / Unknown</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border border-current/10 ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                                            {log.details}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Activity size={48} className="text-gray-200" />
                                            <p>ยังไม่มีประวัติการใช้งาน</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SettingsActivityLogs;

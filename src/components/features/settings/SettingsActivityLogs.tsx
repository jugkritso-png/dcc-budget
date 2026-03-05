import React from 'react';
import { Clock, User as UserIcon, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBudget } from '@/context/BudgetContext';
import { useQueryClient } from '@tanstack/react-query';

const SettingsActivityLogs: React.FC = () => {
    const { activityLogs, user } = useBudget();
    const queryClient = useQueryClient();
    const [loading, setLoading] = React.useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        await queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
        setLoading(false);
    };

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
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return 'text-green-600 bg-green-50';
        if (a.includes('CREATE') || a.includes('SUBMIT')) return 'text-primary-600 bg-primary-50';
        if (a.includes('UPDATE') || a.includes('APPROVE') || a.includes('ADJUST')) return 'text-orange-600 bg-orange-50';
        if (a.includes('DELETE') || a.includes('REJECT')) return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-50';
    };

    if (user?.role !== 'admin') {
        return (
            <div className="p-12 text-center">
                <Activity size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">เข้าถึงไม่ได้</h3>
                <p className="text-gray-500">คุณต้องเป็นผู้ดูแลระบบเพื่อดูประวัติการใช้งาน</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">ประวัติการใช้งานระบบ</h3>
                    <p className="text-gray-500 text-sm mt-1.5 font-medium">บันทึกการกระทำต่างๆ ของผู้ใช้งานในระบบ (Audit Logs)</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={handleRefresh}
                    className="p-2.5 text-gray-500 hover:text-[#0066B3] hover:bg-[#00A1E4]/10 rounded-[12px] w-full md:w-auto transition-colors duration-200"
                    title="Refresh Logs"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm hover:shadow-card transition-shadow duration-300 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead className="bg-[#F4F6F9] border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">เวลา</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">การกระทำ</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activityLogs.length > 0 ? (
                                activityLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            {formatDate(log.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.user ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[11px] font-extrabold border-2 border-white shadow-sm overflow-hidden">
                                                        {(() => {
                                                            const cleanAvatar = log.user.avatar ? String(log.user.avatar).trim() : '';
                                                            const isImage = cleanAvatar.startsWith('http') || cleanAvatar.startsWith('data:');

                                                            if (isImage) {
                                                                return <img src={cleanAvatar} alt={log.user.name} className="w-full h-full object-cover" />;
                                                            }
                                                            return log.user.name.charAt(0);
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-gray-900">{log.user.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-semibold">@{log.user.username}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 opacity-60">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <span className="text-[13px] text-gray-500 font-bold">System</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border border-current/10 ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-gray-600 max-w-xs truncate font-medium" title={log.details}>
                                            {log.details}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                                <Activity size={32} className="text-gray-200" />
                                            </div>
                                            <p className="font-bold text-gray-400 italic">ยังไม่มีประวัติการใช้งานในขณะนี้</p>
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

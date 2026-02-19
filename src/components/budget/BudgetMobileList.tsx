
import React from 'react';
import { BudgetRequest, Category } from '../../types';
import { User, Search } from 'lucide-react';

interface BudgetMobileListProps {
    requests: BudgetRequest[];
    categories: Category[];
    onSelectRequest: (request: BudgetRequest) => void;
}

export const BudgetMobileList: React.FC<BudgetMobileListProps> = ({
    requests,
    categories,
    onSelectRequest
}) => {
    return (
        <div className="md:hidden space-y-4">
            {requests.map((req) => {
                const category = categories.find(c => c.name === req.category);

                // Status Logic
                let statusLabel = '';
                let statusColorClass = '';

                switch (req.status) {
                    case 'pending':
                        statusLabel = 'รออนุมัติ';
                        statusColorClass = 'bg-yellow-50 text-yellow-700 border-yellow-100';
                        break;
                    case 'approved':
                        statusLabel = 'อนุมัติ';
                        statusColorClass = 'bg-green-50 text-green-700 border-green-100';
                        break;
                    case 'rejected':
                        statusLabel = 'ไม่อนุมัติ';
                        statusColorClass = 'bg-red-50 text-red-700 border-red-100';
                        break;
                    case 'waiting_verification':
                        statusLabel = 'อยู่ระหว่างรายงานผล';
                        statusColorClass = 'bg-blue-50 text-blue-700 border-blue-100';
                        break;
                    case 'completed':
                        statusLabel = 'รายงานผลเรียบร้อยแล้ว';
                        statusColorClass = 'bg-gray-100 text-gray-700 border-gray-200';
                        break;
                    default:
                        statusLabel = req.status;
                        statusColorClass = 'bg-gray-50 text-gray-600 border-gray-100';
                }

                return (
                    <div
                        key={req.id}
                        onClick={() => onSelectRequest(req)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-all"
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${category ? category.color : 'bg-gray-300'}`}></div>

                        <div className="flex justify-between items-start mb-3 pl-3">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{req.project}</h4>
                                <div className="text-xs text-gray-500 flex gap-2 mt-1">
                                    <span>{req.id}</span>
                                    <span>•</span>
                                    <span>{req.date}</span>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColorClass} whitespace-nowrap`}>
                                {statusLabel}
                            </span>
                        </div>

                        <div className="flex justify-between items-end pl-3">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${category ? category.color.replace('bg-', 'bg-') : 'bg-gray-400'}`}></div>
                                    <span className="text-xs text-gray-600 font-medium">{req.category}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <User size={12} />
                                    {req.requester}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium mb-0.5">งบประมาณ</p>
                                <p className="text-lg font-extrabold text-primary-600">฿{req.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            {requests.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Search className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">ไม่พบรายการ</p>
                </div>
            )}
        </div>
    );
};

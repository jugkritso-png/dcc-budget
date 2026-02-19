
import React, { useState } from 'react';
import { BudgetRequest, Category } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { User, FileText, CheckCircle2, Clock, XCircle, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface BudgetTableProps {
    requests: BudgetRequest[];
    categories: Category[];
    hasPermission: (permission: string) => boolean;
    onSelectRequest: (request: BudgetRequest) => void;
    onDeleteRequest: (id: string) => void;
    updateRequestStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
    openApprovalModal: (request: BudgetRequest) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
    requests,
    categories,
    hasPermission,
    onSelectRequest,
    onDeleteRequest,
    updateRequestStatus,
    openApprovalModal
}) => {
    const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

    // Close dropdown when clicking outside (handled by backdrop in render)

    return (
        <div className="hidden md:block overflow-x-auto min-h-[400px]">
            <Table className="w-full text-left border-separate border-spacing-y-3 px-1">
                <TableHeader>
                    <tr>
                        <TableHead className="py-2 px-6 pl-8 font-semibold text-gray-400 uppercase tracking-wider">วันที่ / รหัส</TableHead>
                        <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">โครงการ</TableHead>
                        <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">หมวดหมู่</TableHead>
                        <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">ผู้ขอ</TableHead>
                        <TableHead className="py-2 px-4 text-right font-semibold text-gray-400 uppercase tracking-wider">งบประมาณ</TableHead>
                        <TableHead className="py-2 px-4 text-center font-semibold text-gray-400 uppercase tracking-wider">สถานะ</TableHead>
                        <TableHead className="py-2 px-6 text-right pr-8 font-semibold text-gray-400 uppercase tracking-wider">จัดการ</TableHead>
                    </tr>
                </TableHeader>
                <TableBody className="text-gray-600">
                    {requests.map((req) => {
                        const category = categories.find(c => c.name === req.category);

                        // Status Logic
                        let statusLabel = '';
                        let statusColorClass = '';
                        let statusDotClass = '';

                        switch (req.status) {
                            case 'pending':
                                statusLabel = 'รออนุมัติ';
                                statusColorClass = 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100';
                                statusDotClass = 'bg-yellow-500 animate-pulse';
                                break;
                            case 'approved':
                                statusLabel = 'อนุมัติ';
                                statusColorClass = 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100';
                                statusDotClass = 'bg-green-500 animate-pulse';
                                break;
                            case 'rejected':
                                statusLabel = 'ไม่อนุมัติ';
                                statusColorClass = 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100';
                                statusDotClass = 'bg-red-500';
                                break;
                            case 'waiting_verification':
                                statusLabel = 'อยู่ระหว่างรายงานผล';
                                statusColorClass = 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
                                statusDotClass = 'bg-blue-500 animate-pulse';
                                break;
                            case 'completed':
                                statusLabel = 'รายงานผลเรียบร้อยแล้ว';
                                statusColorClass = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
                                statusDotClass = 'bg-gray-500';
                                break;
                            default:
                                statusLabel = req.status;
                                statusColorClass = 'bg-gray-50 text-gray-600 border-gray-100';
                                statusDotClass = 'bg-gray-400';
                        }

                        return (
                            <TableRow
                                key={req.id}
                                className="group bg-white transition-all duration-300 shadow-sm hover:shadow-card-hover rounded-2xl relative overflow-hidden transform hover:-translate-y-1 hover:z-10"
                            >
                                {/* Left Accent Strip */}
                                <TableCell className="py-4 px-6 pl-8 rounded-l-2xl align-middle relative">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 md:w-2 ${category ? category.color : 'bg-gray-300'} group-hover:scale-y-100 transition-transform origin-bottom`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{req.date}</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 w-fit mt-1 font-mono">{req.id}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 px-4 align-middle">
                                    <p className="text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1 text-base">{req.project}</p>
                                    {req.urgency === 'urgent' && <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 mt-1 inline-block">ด่วน</span>}
                                    {req.urgency === 'critical' && <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 mt-1 inline-block">ด่วนที่สุด</span>}
                                </TableCell>

                                <TableCell className="py-4 px-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${category ? category.color : 'bg-gray-400'}`}>
                                            <FileText size={14} />
                                        </div>
                                        <span className="text-sm text-gray-700 font-bold">{req.category}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 px-4 text-sm text-gray-600 font-medium align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User size={12} />
                                        </div>
                                        {req.requester}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 px-4 text-right align-middle">
                                    <span className="text-base font-extrabold text-gray-900 tracking-tight">฿{req.amount.toLocaleString()}</span>
                                </TableCell>

                                <TableCell className="py-4 px-4 text-center align-middle">
                                    <div className="relative inline-block">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') {
                                                    setStatusDropdownOpen(statusDropdownOpen === req.id ? null : req.id);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm border cursor-pointer hover:shadow-md transition-all active:scale-95 ${statusColorClass}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
                                            {statusLabel}
                                            {(hasPermission('approve_budget')) && (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') && (
                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Dropdown Menu - Only for Approver Actions */}
                                        {statusDropdownOpen === req.id && (hasPermission('approve_budget')) && (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setStatusDropdownOpen(null)}
                                                ></div>
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openApprovalModal(req);
                                                            setStatusDropdownOpen(null);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                                        ตรวจสอบ / อนุมัติ
                                                        {req.status === 'approved' && <span className="ml-auto text-emerald-600">✓</span>}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateRequestStatus(req.id, 'pending');
                                                            toast.success('เปลี่ยนเป็นรออนุมัติ');
                                                            setStatusDropdownOpen(null);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Clock size={16} className="text-amber-600" />
                                                        รออนุมัติ
                                                        {req.status === 'pending' && <span className="ml-auto text-amber-600">✓</span>}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openApprovalModal(req);
                                                            setStatusDropdownOpen(null);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <XCircle size={16} className="text-rose-600" />
                                                        ไม่อนุมัติ
                                                        {req.status === 'rejected' && <span className="ml-auto text-rose-600">✓</span>}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 px-6 text-right rounded-r-2xl align-middle pr-8">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
                                        {/* Action Buttons with Tooltips */}
                                        {req.status === 'pending' && (hasPermission('approve_budget')) && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateRequestStatus(req.id, 'approved'); toast.success('อนุมัติคำขอสำเร็จ'); }}
                                                    className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-green-200"
                                                    title="อนุมัติ"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openApprovalModal(req); }}
                                                    className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-orange-200"
                                                    title="ไม่อนุมัติ"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                                            </>
                                        )}

                                        <button
                                            onClick={() => onSelectRequest(req)}
                                            className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-primary-200"
                                            title="ดูรายละเอียด"
                                        >
                                            <FileText size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteRequest(req.id); }}
                                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-red-200"
                                            title="ลบรายการ"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            {requests.length === 0 && (
                <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100 m-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Search className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-1">ไม่พบคำขอที่ค้นหา</h3>
                    <p className="text-gray-500 text-sm">ลองปรับตัวกรองหรือใช้คำค้นหาอื่น</p>
                </div>
            )}
        </div>
    );
};

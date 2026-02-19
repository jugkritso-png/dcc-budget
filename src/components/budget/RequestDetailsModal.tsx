
import React, { useState } from 'react';
import { BudgetRequest, Category } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Clock, XCircle, FileCheck2, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface RequestDetailsModalProps {
    selectedRequest: BudgetRequest | null;
    onClose: () => void;
    categories: Category[];
    updateRequestStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
    openApprovalModal: (request: BudgetRequest) => void;
    onCreateMemo: (request: BudgetRequest) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
    selectedRequest,
    onClose,
    categories,
    updateRequestStatus,
    openApprovalModal,
    onCreateMemo
}) => {
    if (!selectedRequest) return null;

    return (
        <Modal
            isOpen={!!selectedRequest}
            onClose={onClose}
            title="รายละเอียดคำขอ"
        >
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-full flex-shrink-0",
                        selectedRequest.status === 'approved' ? 'bg-green-100 text-green-600' :
                            selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                    selectedRequest.status === 'waiting_verification' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                    )}>
                        {selectedRequest.status === 'approved' ? <CheckCircle2 size={32} /> :
                            selectedRequest.status === 'pending' ? <Clock size={32} /> :
                                selectedRequest.status === 'rejected' ? <XCircle size={32} /> :
                                    selectedRequest.status === 'waiting_verification' ? <FileCheck2 size={32} /> :
                                        <CheckCircle2 size={32} />}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedRequest.project}</h4>
                        <p className="text-sm text-gray-500">รหัส: {selectedRequest.id} | วันที่: {selectedRequest.date}</p>
                        {selectedRequest.approvalRef && <p className="text-xs text-primary-500 mt-1">Ref: {selectedRequest.approvalRef}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-xs text-gray-500 block">จำนวนเงิน</span>
                        <span className="text-lg font-bold text-primary-600">฿{selectedRequest.amount.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-xs text-gray-500 block">หมวดหมู่</span>
                        <span className="text-lg font-bold text-gray-800">{selectedRequest.category}</span>
                    </div>
                    {selectedRequest.department && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-500 block">หน่วยงาน</span>
                            <span className="text-sm font-bold text-gray-800">{selectedRequest.department}</span>
                        </div>
                    )}
                    {selectedRequest.urgency && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-500 block">ความเร่งด่วน</span>
                            <Badge variant={selectedRequest.urgency === 'critical' ? 'error' : selectedRequest.urgency === 'urgent' ? 'warning' : 'default'}>
                                {selectedRequest.urgency === 'critical' ? 'ด่วนที่สุด' : selectedRequest.urgency === 'urgent' ? 'ด่วน' : 'ปกติ'}
                            </Badge>
                        </div>
                    )}
                </div>

                {selectedRequest.reason && (
                    <div>
                        <h5 className="text-sm font-bold text-gray-700 mb-1">เหตุผลและความจำเป็น</h5>
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedRequest.reason}</p>
                    </div>
                )}

                <div>
                    <h5 className="text-sm font-bold text-gray-700 mb-1">หมายเหตุ</h5>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedRequest.notes || '-'}</p>
                </div>

                {/* Expense Items Table */}
                {selectedRequest.expenseItems && selectedRequest.expenseItems.length > 0 && (
                    <div>
                        <h5 className="text-sm font-bold text-gray-700 mb-2">รายละเอียดค่าใช้จ่าย</h5>
                        <div className="bg-gray-50 rounded-xl overflow-x-auto border border-gray-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-500 font-semibold text-xs border-b border-gray-200">
                                    <tr>
                                        <th className="px-3 py-2">รายการ</th>
                                        <th className="px-3 py-2 text-center">จำนวน</th>
                                        <th className="px-3 py-2 text-center">หน่วย</th>
                                        <th className="px-3 py-2 text-right">ราคา/หน่วย</th>
                                        <th className="px-3 py-2 text-right">รวม</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedRequest.expenseItems.map((item, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="px-3 py-2">
                                                <span className="font-bold text-gray-700 block text-xs">{item.description}</span>
                                                <span className="text-[10px] text-gray-400">{item.categoryId || item.category}</span>
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-3 py-2 text-center text-gray-600">{item.unit}</td>
                                            <td className="px-3 py-2 text-right text-gray-600">{item.unitPrice.toLocaleString()}</td>
                                            <td className="px-3 py-2 text-right font-bold text-gray-800">{item.total.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan={4} className="px-3 py-2 text-right font-bold text-gray-600 text-xs">รวมทั้งสิ้น</td>
                                        <td className="px-3 py-2 text-right font-extrabold text-primary-600">{selectedRequest.expenseItems.reduce((sum, i) => sum + i.total, 0).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Status Change Controls */}
                <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-bold text-gray-700 mb-3">เปลี่ยนสถานะการอนุมัติ</h5>
                    <div className="flex gap-3">
                        <Button
                            variant={selectedRequest.status === 'approved' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                                updateRequestStatus(selectedRequest.id, 'approved');
                                toast.success('อนุมัติคำขอสำเร็จ');
                                onClose();
                            }}
                            className={cn("flex-1", selectedRequest.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50')}
                        >
                            <CheckCircle2 size={18} className="mr-2" /> อนุมัติ
                        </Button>
                        <Button
                            variant={selectedRequest.status === 'pending' ? 'warning' : 'outline'}
                            size="sm"
                            onClick={() => {
                                updateRequestStatus(selectedRequest.id, 'pending');
                                toast.success('เปลี่ยนสถานะเป็นรออนุมัติ');
                                onClose();
                            }}
                            className={cn("flex-1", selectedRequest.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white' : 'text-amber-600 border-amber-200 hover:bg-amber-50')}
                        >
                            <Clock size={18} className="mr-2" /> รออนุมัติ
                        </Button>
                        <Button
                            variant={selectedRequest.status === 'rejected' ? 'danger' : 'outline'}
                            size="sm"
                            onClick={() => {
                                openApprovalModal(selectedRequest);
                            }}
                            className={cn("flex-1", selectedRequest.status === 'rejected' ? '' : 'text-rose-600 border-rose-200 hover:bg-rose-50')}
                        >
                            <XCircle size={18} className="mr-2" /> ไม่อนุมัติ
                        </Button>
                    </div>
                </div>

                {/* Official Memo Button */}
                <div className="pt-2">
                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => onCreateMemo(selectedRequest)}
                    >
                        <FileText className="w-5 h-5 mr-2" /> สร้างบันทึกข้อความ
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

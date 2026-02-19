
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { BudgetRequest } from '../../types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRequest: BudgetRequest | null;
    handleConfirmVerification: () => Promise<void>;
    handleRejectVerification: () => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    selectedRequest,
    handleConfirmVerification,
    handleRejectVerification
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="ตรวจสอบความถูกต้อง (Verify Expense Report)"
            maxWidth="3xl"
            footer={
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRejectVerification}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                            <ArrowLeft size={18} className="mr-2" /> ส่งกลับแก้ไข
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                        <Button onClick={handleConfirmVerification} className="bg-orange-500 hover:bg-orange-600 text-white">
                            <CheckCircle size={18} className="mr-2" /> ยืนยันตรวจสอบและปิดโครงการ
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-orange-600 font-medium">โครงการที่ตรวจสอบ</p>
                        <p className="text-lg font-bold text-orange-900">{selectedRequest?.project}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-orange-600 font-medium">ผู้ขอเบิก</p>
                        <p className="text-lg font-bold text-orange-900">{selectedRequest?.requester}</p>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto overflow-x-auto pr-2">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 bg-gray-50 sticky top-0">
                            <tr>
                                <th className="p-3 rounded-tl-lg">รายการ</th>
                                <th className="p-3">จำนวน</th>
                                <th className="p-3 text-right">งบประมาณ (บาท)</th>
                                <th className="p-3 rounded-tr-lg text-right">ใช้จ่ายจริง (บาท)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {selectedRequest?.expenseItems?.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50/50">
                                    <td className="p-3 font-medium text-gray-700">{item.description}</td>
                                    <td className="p-3 text-gray-500">{item.quantity} {item.unit}</td>
                                    <td className="p-3 text-right text-gray-900">฿{item.total.toLocaleString()}</td>
                                    <td className="p-3 text-right font-bold text-blue-600">
                                        ฿{(item.actualAmount || 0).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                            <tr>
                                <td colSpan={2} className="p-3 text-right">รวมทั้งหมด</td>
                                <td className="p-3 text-right">฿{selectedRequest?.amount.toLocaleString()}</td>
                                <td className="p-3 text-right text-blue-700">
                                    ฿{(selectedRequest?.actualAmount || 0).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="p-3 text-right text-green-600">เงินคงเหลือคืนงบประมาณ</td>
                                <td className="p-3 text-right text-green-700">
                                    ฿{((selectedRequest?.amount || 0) - (selectedRequest?.actualAmount || 0)).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </Modal>
    );
};

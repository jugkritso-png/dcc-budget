import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    ArrowLeft
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExpenseLineItem, BudgetRequest } from '../types';
import toast from 'react-hot-toast';

const ExpenseReport: React.FC = () => {
    const { requests, user, submitExpenseReport, completeRequest, revertComplete, rejectExpenseReport } = useBudget();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

    // Expenses Editing State
    const [expenseData, setExpenseData] = useState<ExpenseLineItem[]>([]);

    // Filter modes
    const [viewMode, setViewMode] = useState<'active' | 'history' | 'verify'>('active');

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            // 1. Filter by Status
            if (viewMode === 'active' && req.status !== 'approved') return false;
            if (viewMode === 'history' && req.status !== 'completed') return false;
            if (viewMode === 'verify' && req.status !== 'waiting_verification') return false;

            // 2. Filter by User
            // ... (keep existing logic)

            // 3. Search
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                return (
                    req.project.toLowerCase().includes(lowerTerm) ||
                    req.requester.toLowerCase().includes(lowerTerm)
                );
            }
            return true;
        });
    }, [requests, viewMode, searchTerm, user]);

    const handleOpenVerifyModal = (request: BudgetRequest) => {
        setSelectedRequest(request);
        setIsVerifyModalOpen(true);
    };

    const handleConfirmVerification = async () => {
        if (!selectedRequest) return;
        try {
            await completeRequest(selectedRequest.id);
            toast.success('ตรวจสอบและปิดโครงการเรียบร้อยแล้ว');
            setIsVerifyModalOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการตรวจสอบ');
        }
    };

    const handleRejectVerification = async () => {
        if (!selectedRequest) return;
        const reason = prompt('ระบุเหตุผลที่ส่งกลับ (Optional):');
        if (reason === null) return; // Cancelled

        try {
            await rejectExpenseReport(selectedRequest.id, reason);
            toast.success('ส่งกลับให้แก้ไขเรียบร้อยแล้ว');
            setIsVerifyModalOpen(false);
            setSelectedRequest(null);
            setViewMode('active'); // Switch to active tab to show the item
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการส่งกลับ');
        }
    };

    const handleOpenReport = (request: BudgetRequest) => {
        setSelectedRequest(request);
        // Initialize actual amounts with 0 if undefined
        const items = request.expenseItems?.map(item => ({
            ...item,
            actualAmount: item.actualAmount ?? 0
        })) || [];
        setExpenseData(items);
        setIsModalOpen(true);
    };

    const handleExpenseChange = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setExpenseData(prev =>
            prev.map(item => item.id === id ? { ...item, actualAmount: numValue } : item)
        );
    };

    const calculateTotals = () => {
        // Use the original approved request amount as the budget baseline
        // This ensures that even if items are removed/added, the Total Budget remains the approved amount.
        const totalBudget = selectedRequest?.amount || 0;
        const totalActual = expenseData.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
        const returnAmount = totalBudget - totalActual;
        return { totalBudget, totalActual, returnAmount };
    };

    const handleSubmit = async () => {
        if (!selectedRequest) return;

        try {
            const { totalActual, returnAmount } = calculateTotals();



            await submitExpenseReport(selectedRequest.id, {
                expenseItems: expenseData,
                actualTotal: totalActual,
                returnAmount: returnAmount
            });

            toast.success('ส่งรายงานผลการตรวจสอบเรียบร้อยแล้ว (Waiting for Verification)');
            setIsModalOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const { totalBudget, totalActual, returnAmount } = calculateTotals();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        รายงานผลการใช้จ่าย (Expense Report)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        บันทึกค่าใช้จ่ายจริงและปิดโครงการเพื่อคืนเงินงบประมาณ
                    </p>
                </div>

                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'active'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        รอรายงานผล
                    </button>
                    <button
                        onClick={() => setViewMode('verify')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'verify'
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        รอตรวจสอบ ({requests.filter(r => r.status === 'waiting_verification').length})
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'history'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        ประวัติการปิดโครงการ
                    </button>
                </div>
            </div>

            {/* Grid of Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredRequests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <FileText className="w-24 h-24 text-gray-100 -rotate-12 transform translate-x-8 -translate-y-8" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                                            {req.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{req.project}</h3>
                                        <p className="text-sm text-gray-500">ผู้ขอ: {req.requester}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">
                                            ฿{req.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">งบประมาณที่ได้รับ</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        {viewMode === 'history' && req.actualAmount ? (
                                            <span className="text-green-600 font-medium flex items-center gap-1">
                                                <CheckCircle size={14} /> ใช้จริง: ฿{req.actualAmount.toLocaleString()}
                                            </span>
                                        ) : viewMode === 'verify' ? (
                                            <span className="text-orange-500 font-medium flex items-center gap-1">
                                                <AlertCircle size={14} /> รอการตรวจสอบ
                                            </span>
                                        ) : (
                                            <span className="text-orange-500 font-medium flex items-center gap-1">
                                                <AlertCircle size={14} /> รอการรายงานผล
                                            </span>
                                        )}
                                    </div>

                                    {req.rejectionReason && (
                                        <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 italic">
                                            เหตุผลที่ส่งกลับ: "{req.rejectionReason}"
                                        </div>
                                    )}

                                    {viewMode === 'active' && (
                                        <Button
                                            onClick={() => handleOpenReport(req)}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30"
                                        >
                                            รายงานผล
                                        </Button>
                                    )}
                                    {viewMode === 'verify' && (
                                        <Button
                                            onClick={() => handleOpenVerifyModal(req)}
                                            className="bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                                        >
                                            ตรวจสอบและปิดโครงการ
                                        </Button>
                                    )}
                                    {viewMode === 'history' && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={async () => {
                                                    if (confirm('ยืนยันส่งกลับไปตรวจสอบ? (ยอดเงินจะถูกคืนค่ากลับ)')) {
                                                        await revertComplete(req.id);
                                                        toast.success('ส่งกลับไปสถานะรอตรวจสอบแล้ว');
                                                        setViewMode('verify'); // Switch to verify tab to show the movied item
                                                    }
                                                }}
                                                className="bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 px-3 py-1.5 text-xs h-auto"
                                            >
                                                ส่งกลับไปตรวจสอบ
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleOpenReport(req)}
                                                disabled
                                                className="text-gray-400 cursor-not-allowed"
                                            >
                                                ปิดโครงการแล้ว
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredRequests.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p>ไม่พบรายการที่ต้องรายงานผล</p>
                    </div>
                )}
            </div>

            {/* Report Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="รายงานผลการใช้จ่ายจริง (Actual Expense Reporting)"
                maxWidth="3xl"
                footer={
                    <div className="flex justify-between w-full items-center">
                        <div className="text-left">
                            <p className="text-sm text-gray-500">
                                {returnAmount >= 0 ? 'คืนเงินงบประมาณ' : 'เกินงบประมาณ (Over Budget)'}
                            </p>
                            <p className={`text-xl font-bold ${returnAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {returnAmount >= 0 ? '' : '-'}฿{Math.abs(returnAmount).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
                            <Button onClick={handleSubmit}>
                                <Save size={18} className="mr-2" /> ยืนยันปิดโครงการ
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">โครงการ</p>
                            <p className="text-lg font-bold text-blue-900">{selectedRequest?.project}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-600 font-medium">งบประมาณอนุมัติ</p>
                            <p className="text-xl font-bold text-blue-900">฿{selectedRequest?.amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto overflow-x-auto pr-2 space-y-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="p-3 rounded-tl-lg">รายการ</th>
                                    <th className="p-3">จำนวน</th>
                                    <th className="p-3">งบประมาณ (บาท)</th>
                                    <th className="p-3 rounded-tr-lg w-48">ใช้จ่ายจริง (บาท)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">

                                {expenseData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 font-medium text-gray-700">
                                            {item.total === 0 || item.id.startsWith('temp-') ? (
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const newVal = e.target.value;
                                                        setExpenseData(prev => prev.map(i => i.id === item.id ? { ...i, description: newVal } : i));
                                                    }}
                                                    placeholder="ระบุรายการ..."
                                                    className="h-9 text-sm"
                                                />
                                            ) : (
                                                item.description
                                            )}
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {item.total === 0 || item.id.startsWith('temp-') ? (
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newVal = parseFloat(e.target.value) || 0;
                                                            setExpenseData(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newVal } : i));
                                                        }}
                                                        className="h-9 w-16 text-sm text-center"
                                                    />
                                                    <span className="text-xs">{item.unit || 'หน่วย'}</span>
                                                </div>
                                            ) : (
                                                `${item.quantity} ${item.unit}`
                                            )}
                                        </td>
                                        <td className="p-3 text-gray-900 font-semibold">฿{item.total.toLocaleString()}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={item.actualAmount || ''}
                                                    onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                                                    className="text-right font-bold text-blue-600 bg-white border-gray-200 focus:border-blue-500 min-w-[100px]"
                                                    placeholder="0.00"
                                                />
                                                {(item.total === 0 || item.id.startsWith('temp-')) && (
                                                    <button
                                                        onClick={() => setExpenseData(prev => prev.filter(i => i.id !== item.id))}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4} className="p-2 text-center border-t border-dashed border-gray-200">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpenseData(prev => [
                                                ...prev,
                                                {
                                                    id: `temp-${Date.now()}`,
                                                    description: '',
                                                    quantity: 1,
                                                    unit: 'หน่วย',
                                                    unitPrice: 0,
                                                    total: 0,
                                                    actualAmount: 0
                                                }
                                            ])}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 w-full"
                                        >
                                            + เพิ่มรายการพิเศษ (Extra Item)
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                            <p className="text-sm text-gray-500 mb-1">รวมใช้จ่ายจริง</p>
                            <p className="text-2xl font-bold text-gray-900">฿{totalActual.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
                            <p className="text-sm text-green-600 mb-1">เงินคงเหลือส่งคืน</p>
                            <p className="text-2xl font-bold text-green-700">฿{returnAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Verification Modal */}
            <Modal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
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
                            <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>ยกเลิก</Button>
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
        </div>
    );
};

export default ExpenseReport;

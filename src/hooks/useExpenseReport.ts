
import { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { BudgetRequest, ExpenseLineItem } from '../types';
import toast from 'react-hot-toast';

export const useExpenseReport = () => {
    const { requests, user, submitExpenseReport, completeRequest, revertComplete, rejectExpenseReport } = useBudget();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState<ExpenseLineItem[]>([]);
    const [viewMode, setViewMode] = useState<'active' | 'history' | 'verify'>('active');

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            // 1. Filter by Status
            if (viewMode === 'active' && req.status !== 'approved') return false;
            if (viewMode === 'history' && req.status !== 'completed') return false;
            if (viewMode === 'verify' && req.status !== 'waiting_verification') return false;

            // 2. Filter by User (implicitly handled by context for normal users, but good to check if admin)
            // The context 'requests' might already be filtered or include all depending on permission.
            // If we need strict user filtering for non-admin:
            // if (!hasPermission('verify_expense') && req.requester !== user?.name) return false;
            // But typically 'requests' from context is already what they can see.

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

    const handleOpenReport = (request: BudgetRequest) => {
        setSelectedRequest(request);
        const items = request.expenseItems?.map(item => ({
            ...item,
            actualAmount: item.actualAmount ?? 0
        })) || [];
        setExpenseData(items);
        setIsModalOpen(true);
    };

    const handleOpenVerifyModal = (request: BudgetRequest) => {
        setSelectedRequest(request);
        setIsVerifyModalOpen(true);
    };

    const handleExpenseChange = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setExpenseData(prev =>
            prev.map(item => item.id === id ? { ...item, actualAmount: numValue } : item)
        );
    };

    const calculateTotals = () => {
        const totalBudget = selectedRequest?.amount || 0;
        const totalActual = expenseData.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
        const returnAmount = totalBudget - totalActual;
        return { totalBudget, totalActual, returnAmount };
    };

    const handleSubmitReport = async () => {
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
            setViewMode('active');
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการส่งกลับ');
        }
    };

    const handleRevertComplete = async (id: string) => {
        try {
            await revertComplete(id);
            toast.success('ส่งกลับไปสถานะรอตรวจสอบแล้ว');
            setViewMode('verify');
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการส่งกลับ');
        }
    }

    return {
        searchTerm, setSearchTerm,
        viewMode, setViewMode,
        filteredRequests,
        selectedRequest,
        isModalOpen, setIsModalOpen,
        isVerifyModalOpen, setIsVerifyModalOpen,
        expenseData, setExpenseData,
        handleOpenReport,
        handleOpenVerifyModal,
        handleExpenseChange,
        calculateTotals,
        handleSubmitReport,
        handleConfirmVerification,
        handleRejectVerification,
        handleRevertComplete,
        requests // for counting in tabs
    };
};

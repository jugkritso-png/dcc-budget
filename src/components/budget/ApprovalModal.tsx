import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, AlertTriangle, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { BudgetRequest } from '../../types';
import { useBudget } from '../../context/BudgetContext';
import { Button } from '../ui/Button';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: BudgetRequest;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, request }) => {
    const { approveRequest, rejectRequest, user, categories } = useBudget();
    const [action, setAction] = useState<'view' | 'reject'>('view');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const category = categories.find(c => c.name === request.category);
    const isOverBudget = category && (category.used + request.amount > category.allocated);

    const handleApprove = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await approveRequest(request.id, user.id);
            onClose();
        } catch (error) {
            alert('Failed to approve request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!user) return;
        if (!rejectionReason.trim()) return alert('Please provide a reason');

        setIsSubmitting(true);
        try {
            await rejectRequest(request.id, user.id, rejectionReason);
            onClose();
        } catch (error) {
            alert('Failed to reject request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto border border-white/40 overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Approve Request</h2>
                                    <p className="text-sm text-gray-500">ID: {request.id.slice(0, 8)}</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Amount Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border border-gray-200">
                                    <div className="text-sm text-gray-500 font-medium mb-1">Total Amount</div>
                                    <div className="text-4xl font-extrabold text-gray-900">฿{request.amount.toLocaleString()}</div>
                                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isOverBudget ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                        {isOverBudget ? <AlertTriangle size={12} /> : <Check size={12} />}
                                        {isOverBudget ? 'Exceeds Allocation' : 'Within Budget'}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Requested By</label>
                                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                                <User size={16} />
                                            </div>
                                            {request.requester}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
                                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                                            <Calendar size={18} className="text-gray-400" />
                                            {new Date(request.date).toLocaleDateString('th-TH')}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project / Activity</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 font-medium">
                                        {request.project}
                                    </div>
                                </div>

                                {action === 'reject' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-xs font-bold text-red-500 uppercase tracking-wider">Rejection Reason</label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-red-200 bg-red-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-red-900 placeholder-red-300 min-h-[100px]"
                                            placeholder="Why is this request being rejected?"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 p-6 flex gap-3 border-t border-gray-200">
                                {action === 'view' ? (
                                    <>
                                        <Button
                                            variant="danger"
                                            className="flex-1 bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 hover:text-red-700 shadow-sm"
                                            onClick={() => setAction('reject')}
                                            disabled={isSubmitting}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="flex-[2] shadow-lg shadow-primary-500/20"
                                            onClick={handleApprove}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Approve Request'}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => setAction('view')}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-[2] bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20"
                                            onClick={handleReject}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

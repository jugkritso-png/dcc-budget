
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { BudgetRequest } from '../../types';

interface ExpenseRequestListProps {
    requests: BudgetRequest[];
    viewMode: 'active' | 'history' | 'verify';
    handleOpenReport: (request: BudgetRequest) => void;
    handleOpenVerifyModal: (request: BudgetRequest) => void;
    revertComplete: (id: string) => Promise<void>;
}

export const ExpenseRequestList: React.FC<ExpenseRequestListProps> = ({
    requests,
    viewMode,
    handleOpenReport,
    handleOpenVerifyModal,
    revertComplete
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
                {requests.map((req, index) => (
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

            {requests.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>ไม่พบรายการที่ต้องรายงานผล</p>
                </div>
            )}
        </div>
    );
};

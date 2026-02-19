
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, X } from 'lucide-react';
import { BudgetRequest, ExpenseLineItem } from '../../types';

interface ExpenseReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRequest: BudgetRequest | null;
    expenseData: ExpenseLineItem[];
    setExpenseData: React.Dispatch<React.SetStateAction<ExpenseLineItem[]>>;
    handleExpenseChange: (id: string, value: string) => void;
    handleSubmit: () => Promise<void>;
    calculateTotals: () => { totalBudget: number; totalActual: number; returnAmount: number; };
}

export const ExpenseReportModal: React.FC<ExpenseReportModalProps> = ({
    isOpen,
    onClose,
    selectedRequest,
    expenseData,
    setExpenseData,
    handleExpenseChange,
    handleSubmit,
    calculateTotals
}) => {
    const { returnAmount, totalActual } = calculateTotals();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                        <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
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
                            {expenseData.map((item) => (
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
                                                actualAmount: 0,
                                                category: selectedRequest?.category || '',
                                                categoryId: selectedRequest?.category || ''
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
    );
};

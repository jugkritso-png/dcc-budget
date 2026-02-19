
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { ExpenseLineItem, Category } from '../../types';

interface ExpenseEstimationTableProps {
    expenseItems: ExpenseLineItem[];
    categories: Category[];
    addExpenseItem: () => void;
    removeExpenseItem: (id: string) => void;
    updateExpenseItem: (id: string, field: keyof ExpenseLineItem, value: any) => void;
}

export const ExpenseEstimationTable: React.FC<ExpenseEstimationTableProps> = ({
    expenseItems,
    categories,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem
}) => {
    return (
        <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                    3. รายละเอียดประมาณการค่าใช้จ่าย
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                        รวมทั้งสิ้น: <span className="text-primary-600 font-bold ml-1">฿{expenseItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-[50px] text-center">#</th>
                            {/* <th className="px-4 py-3 min-w-[150px]">หมวดรายจ่าย</th>  Note: Simplified by removing category per row as it's usually 1 budget category per request, OR keep as Description */}
                            <th className="px-4 py-3 min-w-[200px]">หมวดรายจ่าย</th>
                            <th className="px-4 py-3 min-w-[200px]">รายการ</th>
                            <th className="px-4 py-3 w-[100px] text-center">จำนวน</th>
                            <th className="px-4 py-3 w-[100px] text-center">หน่วย</th>
                            <th className="px-4 py-3 w-[120px] text-right">ราคา/หน่วย</th>
                            <th className="px-4 py-3 w-[150px] text-right">รวม (บาท)</th>
                            <th className="px-4 py-3 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {expenseItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                    ยังไม่มีรายการค่าใช้จ่าย คลิก "เพิ่มรายการ" เพื่อเริ่มต้น
                                </td>
                            </tr>
                        ) : (
                            expenseItems.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 text-center text-gray-400 text-xs">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="relative">
                                            <select
                                                value={item.categoryId || ''}
                                                onChange={(e) => updateExpenseItem(item.id, 'categoryId', e.target.value)}
                                                className="w-full h-9 px-3 py-1 rounded-lg border border-transparent bg-transparent hover:border-gray-200 focus:bg-white focus:border-primary-500 focus:outline-none text-xs font-medium text-gray-700"
                                            >
                                                <option value="">เลือกหมวดหมู่</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                                            placeholder="ระบุรายการ"
                                            className="h-9 text-sm border-transparent hover:border-gray-200 focus:bg-white bg-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateExpenseItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                            className="h-9 text-sm text-center border-transparent hover:border-gray-200 focus:bg-white bg-transparent"
                                            min="1"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={item.unit}
                                            onChange={(e) => updateExpenseItem(item.id, 'unit', e.target.value)}
                                            placeholder="หน่วย"
                                            className="h-9 text-sm text-center border-transparent hover:border-gray-200 focus:bg-white bg-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateExpenseItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            className="h-9 text-sm text-right border-transparent hover:border-gray-200 focus:bg-white bg-transparent"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-700">
                                        {item.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeExpenseItem(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-center">
                    <Button variant="outline" size="sm" onClick={addExpenseItem} className="bg-white hover:bg-gray-50 text-gray-600 border-gray-300 shadow-sm w-full md:w-auto px-6">
                        <Plus size={16} className="mr-2" /> เพิ่มรายการ
                    </Button>
                </div>
            </div>
        </div>
    );
};


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
        <Card className="p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Calculator size={18} />
                    </div>
                    ประมาณการค่าใช้จ่าย
                </h3>
                <Button variant="outline" size="sm" onClick={addExpenseItem} className="text-primary-600 border-primary-200 hover:bg-primary-50">
                    <Plus size={16} className="mr-1" /> เพิ่มรายการ
                </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 min-w-[200px]">รายการ</th>
                            {/* Note: The original code didn't seem to force category selection per item if the main budget category is selected,
                  but typically expense items might fall under different sub-categories or just descriptions.
                  The original code in CreateRequest.tsx lines 294-301 has a select for category.
              */}
                            <th className="px-4 py-3 w-[180px]">หมวดหมู่</th>
                            <th className="px-4 py-3 w-[100px] text-center">จำนวน</th>
                            <th className="px-4 py-3 w-[100px] text-center">หน่วย</th>
                            <th className="px-4 py-3 w-[120px] text-right">ราคา/หน่วย</th>
                            <th className="px-4 py-3 w-[120px] text-right">รวม</th>
                            <th className="px-4 py-3 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {expenseItems.map((item, index) => (
                            <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                                        placeholder="รายละเอียดค่าใช้จ่าย"
                                        className="h-9 text-sm"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="relative">
                                        <select
                                            value={item.categoryId || ''} // Use categoryId if available, or fallback
                                            onChange={(e) => updateExpenseItem(item.id, 'categoryId', e.target.value)} // Update categoryId
                                            className="w-full h-9 px-3 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-xs font-medium text-gray-700 bg-white"
                                        >
                                            <option value="">เลือกหมวดหมู่</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option> // Storing name as value to match existing logic
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateExpenseItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        className="h-9 text-sm text-center"
                                        min="1"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        value={item.unit}
                                        onChange={(e) => updateExpenseItem(item.id, 'unit', e.target.value)}
                                        placeholder="หน่วย"
                                        className="h-9 text-sm text-center"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateExpenseItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        className="h-9 text-sm text-right"
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
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                            <td colSpan={5} className="px-4 py-3 text-right font-bold text-gray-600">รวมทั้งสิ้น</td>
                            <td className="px-4 py-3 text-right font-extrabold text-primary-600 text-lg">
                                {expenseItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
    );
};

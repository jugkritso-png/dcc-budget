import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, FileText, Layers, Clock, DollarSign, Folder } from 'lucide-react';
import { Category, BudgetRequest, BudgetLog, Expense, SubActivity } from '../../types';
import Swal from 'sweetalert2';
import { useBudget } from '../../context/BudgetContext'; // Added import

interface CategoryDetailModalProps {
    viewingCategory: Category | null;
    onClose: () => void;
    requests: BudgetRequest[];
    subActivities: SubActivity[];
    budgetLogs: BudgetLog[];
    expenses: Expense[];
    activeDetailTab: 'requests' | 'allocation' | 'history' | 'expenses';
    setActiveDetailTab: (tab: 'requests' | 'allocation' | 'history' | 'expenses') => void;
    onAdjustBudget: (amount: number, type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE', reason: string) => void;
    onAddSubActivity: (name: string, allocated: string) => void;
    onDeleteSubActivity: (id: string) => void;
    onAddExpense: (expense: any) => void;
    onDeleteExpense: (id: string) => void;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
    viewingCategory,
    onClose,
    requests,
    subActivities,
    budgetLogs,
    expenses,
    activeDetailTab,
    setActiveDetailTab,
    onAdjustBudget,
    onAddSubActivity,
    onDeleteSubActivity,
    onAddExpense,
    onDeleteExpense
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Local form states (could be lifted if needed, but keeping local for simplicity)
    const [adjustmentForm, setAdjustmentForm] = useState({ amount: '', type: 'ADD' as const, reason: '' });
    const [subActivityForm, setSubActivityForm] = useState({ name: '', allocated: '' });
    const [expenseForm, setExpenseForm] = useState({ amount: '', payee: '', date: new Date().toISOString().split('T')[0], description: '' });

    // Modal visibility states for sub-forms
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // For adding root sub-activity

    if (!viewingCategory) return null;

    // Derived Data
    const getCategoryRequests = () => {
        return requests.filter(req => {
            const reqYear = parseInt(req.date.split('-')[0]) + 543;
            return req.category === viewingCategory.name && reqYear === viewingCategory.year;
        });
    };

    const categoryRequests = getCategoryRequests();
    const currentSubActivities = subActivities.filter(s => s.categoryId === viewingCategory.id);
    const totalAllocatedToSub = currentSubActivities.reduce((sum, s) => sum + s.allocated, 0);
    const remainingToAllocate = viewingCategory.allocated - totalAllocatedToSub;

    // Handlers
    const handleSaveAdjustment = () => {
        if (!adjustmentForm.amount || !adjustmentForm.reason) return;
        onAdjustBudget(parseFloat(adjustmentForm.amount), adjustmentForm.type, adjustmentForm.reason);
        setIsAdjustmentModalOpen(false);
        setAdjustmentForm({ amount: '', type: 'ADD', reason: '' });
    };

    const handleAddSub = () => {
        if (!subActivityForm.name || !subActivityForm.allocated) return;
        onAddSubActivity(subActivityForm.name, subActivityForm.allocated);
        setSubActivityForm({ name: '', allocated: '' });
    };

    const handleSaveExpense = () => {
        if (!expenseForm.amount || !expenseForm.payee) return;
        onAddExpense(expenseForm);
        setIsExpenseModalOpen(false);
        setExpenseForm({ amount: '', payee: '', date: new Date().toISOString().split('T')[0], description: '' });
    };

    // ... (previous code)

    // Helper to build hierarchy
    interface ExtendedSubActivity extends SubActivity {
        childrenList: ExtendedSubActivity[];
        used: number;
    }

    const buildHierarchy = (items: SubActivity[]) => {
        const itemMap = new Map<string, ExtendedSubActivity>();
        const roots: ExtendedSubActivity[] = [];

        items.forEach(item => {
            const used = requests
                .filter(r => r.subActivityId === item.id && r.status !== 'rejected')
                .reduce((sum, r) => sum + (r.amount - (r.returnAmount || 0)), 0);
            itemMap.set(item.id, { ...item, childrenList: [], used } as ExtendedSubActivity);
        });

        items.forEach(item => {
            const node = itemMap.get(item.id)!;
            if (item.parentId && itemMap.has(item.parentId)) {
                itemMap.get(item.parentId)!.childrenList.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const { updateSubActivity } = useBudget();
    // We also use onAddSubActivity (from props) and onDeleteSubActivity (from props) coverage.
    // Ideally onAddSubActivity should also support parentId.
    // The prop onAddSubActivity currently is: (name: string, allocated: string) => void.
    // It needs to support parentId. 
    // We will cast it or wrap it. 
    // Actually, looking at props: onAddSubActivity: (name: string, allocated: string) => void;
    // We need to change the prop type too if we want to support parentId via prop.
    // OR we use the context directly for add as well? 
    // Let's use context for everything related to SubActivity to be safe and consistent with the new hierarchy.

    // BUT, I can't easily change the props interface without changing the parent.
    // Let's stick to using context for the new functionality (update, add child).
    // The 'onAddSubActivity' prop is likely wrapping 'addSubActivity' from context anyway in the parent.
    // Let's use `useBudget` here for direct access.

    const { addSubActivity: addSubActivityContext } = useBudget();

    const handleUpdateSub = async (sub: SubActivity) => {
        await updateSubActivity(sub);
    };

    const handleAddChild = async (name: string, allocated: string, parentId: string) => {
        try {
            await addSubActivityContext({
                id: crypto.randomUUID(),
                categoryId: viewingCategory.id,
                name,
                allocated: parseFloat(allocated),
                parentId
            } as any);
            Swal.fire({
                icon: 'success',
                title: 'เพิ่มกิจกรรมย่อยสำเร็จ',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Failed to add child sub-activity:", error);
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถเพิ่มกิจกรรมย่อยได้',
                text: 'กรุณาลองใหม่อีกครั้ง',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };


    const hierarchy = buildHierarchy(currentSubActivities);

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isFullScreen ? 'p-0' : 'p-4'}`}>
                <div className={`bg-white/80 backdrop-blur-2xl border border-white/60 ring-1 ring-black/5 shadow-2xl w-full overflow-hidden animate-fade-in flex flex-col transition-all duration-300 ${isFullScreen
                    ? 'h-full rounded-none'
                    : 'max-w-6xl rounded-2xl max-h-[90vh]'
                    }`}>
                    {/* Modal Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${viewingCategory.color}`}>
                                <Folder size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{viewingCategory.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{viewingCategory.code}</span>
                                    <span>•</span>
                                    <span>ปีงบประมาณ {viewingCategory.year}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                title={isFullScreen ? "ย่อหน้าต่าง" : "ขยายเต็มจอ"}
                            >
                                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="px-6 border-b border-gray-100 flex gap-6 shrink-0">
                        <button
                            onClick={() => setActiveDetailTab('requests')}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeDetailTab === 'requests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={16} /> รายการคำขอ (Requests)
                        </button>
                        <button
                            onClick={() => setActiveDetailTab('allocation')}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeDetailTab === 'allocation' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Layers size={16} /> การจัดสรรงบ (Settings)
                        </button>
                        <button
                            onClick={() => setActiveDetailTab('history')}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeDetailTab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Clock size={16} /> ประวัติการแก้ไข (History)
                        </button>
                        <button
                            onClick={() => setActiveDetailTab('expenses')}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeDetailTab === 'expenses' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <DollarSign size={16} /> รายจ่ายจริง (Expenses)
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-0 bg-gray-50/50">
                        {activeDetailTab === 'requests' ? (
                            <>
                                {/* Stats for Requests */}
                                <div className="px-6 py-4 grid grid-cols-3 gap-4 bg-white/40 border-b border-gray-100/50">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-600 mb-1 font-medium">งบที่ได้รับจัดสรร</p>
                                        <p className="text-lg font-bold text-gray-900">฿{viewingCategory.allocated.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <p className="text-xs text-red-600 mb-1 font-medium">ใช้ไปแล้ว (อนุมัติ)</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ฿{requests.filter(r => r.category === viewingCategory.name && r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-600 mb-1 font-medium">คงเหลือ</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ฿{(viewingCategory.allocated - requests.filter(r => r.category === viewingCategory.name && r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Request List */}
                                {categoryRequests.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">วันที่</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">โครงการ/รายการ</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้ขอ</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">จำนวนเงิน</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">สถานะ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {categoryRequests.map((req) => (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{req.date}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{req.project}</div>
                                                        <div className="text-xs text-gray-400">{req.activity}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.requester}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                                        ฿{req.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'}`}>
                                                            {req.status === 'approved' ? 'อนุมัติ' : req.status === 'pending' ? 'รออนุมัติ' : 'ไม่อนุมัติ'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p>ยังไม่มีรายการคำขอในหมวดหมู่นี้</p>
                                    </div>
                                )}
                            </>
                        ) : activeDetailTab === 'allocation' ? (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-gray-900">กิจกรรมย่อย (Sub-Activity)</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsAdjustmentModalOpen(true)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100">
                                            ปรับปรุงงบประมาณ
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-xl mb-6">
                                    <h5 className="text-sm font-bold text-gray-700 mb-3">เพิ่มกิจกรรมหลัก</h5>
                                    <div className="flex gap-3">
                                        <input type="text" placeholder="ชื่อกิจกรรม" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" value={subActivityForm.name} onChange={e => setSubActivityForm({ ...subActivityForm, name: e.target.value })} />
                                        <input type="number" placeholder="จำนวนเงิน" className="w-32 px-3 py-2 rounded-lg border border-gray-300 text-sm" value={subActivityForm.allocated} onChange={e => setSubActivityForm({ ...subActivityForm, allocated: e.target.value })} />
                                        <button onClick={handleAddSub} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900">เพิ่ม</button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    {hierarchy.map(root => (
                                        <SubActivityItem
                                            key={root.id}
                                            item={root}
                                            onUpdate={handleUpdateSub}
                                            onDelete={onDeleteSubActivity}
                                            onAddChild={handleAddChild}
                                        />
                                    ))}

                                    {hierarchy.length === 0 && (
                                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <Layers size={48} className="mx-auto mb-2 opacity-20" />
                                            <p>ยังไม่มีกิจกรรมย่อย</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm">
                                    <span className="text-gray-500 font-bold">รวมจัดสรรแล้ว</span>
                                    <span className="font-bold text-gray-900">฿{totalAllocatedToSub.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 text-sm">
                                    <span className="text-green-600 font-bold">คงเหลือจัดสรรได้</span>
                                    <span className="font-bold text-green-600">฿{remainingToAllocate.toLocaleString()}</span>
                                </div>
                            </div>
                        ) : activeDetailTab === 'history' ? (
                            <div className="p-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase border-b border-gray-200">
                                            <th className="py-2">วันที่</th>
                                            <th className="py-2">รายการ</th>
                                            <th className="py-2 text-right">จำนวนเงิน</th>
                                            <th className="py-2">เหตุผล</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {budgetLogs.map(log => (
                                            <tr key={log.id}>
                                                <td className="py-3 text-sm text-gray-500">{new Date(log.createdAt).toLocaleDateString()}</td>
                                                <td className="py-3 text-sm font-bold text-gray-800">{log.type}</td>
                                                <td className="py-3 text-sm text-right font-mono text-gray-600">฿{log.amount.toLocaleString()}</td>
                                                <td className="py-3 text-sm text-gray-500">{log.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-gray-900">รายการใช้จ่ายจริง (Expenses)</h4>
                                    <button onClick={() => setIsExpenseModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 shadow-sm">
                                        + บันทึกรายจ่าย
                                    </button>
                                </div>

                                {expenses.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs text-gray-500 uppercase border-b border-gray-200">
                                                <th className="py-2">วันที่</th>
                                                <th className="py-2">รายการ/ผู้รับเงิน</th>
                                                <th className="py-2 text-right">จำนวนเงิน</th>
                                                <th className="py-2 text-center">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {expenses.map(exp => (
                                                <tr key={exp.id}>
                                                    <td className="py-3 text-sm text-gray-500">{exp.date}</td>
                                                    <td className="py-3">
                                                        <div className="text-sm font-bold text-gray-800">{exp.payee}</div>
                                                        <div className="text-xs text-gray-400">{exp.description}</div>
                                                    </td>
                                                    <td className="py-3 text-sm text-right font-mono text-gray-600">฿{exp.amount.toLocaleString()}</td>
                                                    <td className="py-3 text-center">
                                                        <button onClick={() => onDeleteExpense(exp.id)} className="text-red-400 hover:text-red-600">
                                                            <X size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p>ยังไม่มีรายการรายจ่ายที่บันทึก</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sub Modals */}
            {isAdjustmentModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 ring-1 ring-black/5 rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-lg mb-4">ปรับปรุงงบประมาณ</h3>
                        <div className="space-y-3">
                            <select className="w-full border p-2 rounded" value={adjustmentForm.type} onChange={e => setAdjustmentForm({ ...adjustmentForm, type: e.target.value as any })}>
                                <option value="ADD">เพิ่มงบประมาณ (ADD)</option>
                                <option value="REDUCE">ลดงบประมาณ (REDUCE)</option>
                            </select>
                            <input type="number" placeholder="จำนวนเงิน" className="w-full border p-2 rounded" value={adjustmentForm.amount} onChange={e => setAdjustmentForm({ ...adjustmentForm, amount: e.target.value })} />
                            <input type="text" placeholder="เหตุผล" className="w-full border p-2 rounded" value={adjustmentForm.reason} onChange={e => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setIsAdjustmentModalOpen(false)} className="px-3 py-1.5 text-gray-500">ยกเลิก</button>
                                <button onClick={handleSaveAdjustment} className="px-3 py-1.5 bg-blue-600 text-white rounded">บันทึก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isExpenseModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 ring-1 ring-black/5 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="font-bold text-lg mb-4">บันทึกรายจ่ายจริง</h3>
                        <div className="space-y-3">
                            <input type="date" className="w-full border p-2 rounded" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} />
                            <input type="text" placeholder="จ่ายให้ (Payee)" className="w-full border p-2 rounded" value={expenseForm.payee} onChange={e => setExpenseForm({ ...expenseForm, payee: e.target.value })} />
                            <input type="number" placeholder="จำนวนเงิน" className="w-full border p-2 rounded" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
                            <textarea placeholder="รายละเอียดเพิ่มเติม" className="w-full border p-2 rounded" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}></textarea>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setIsExpenseModalOpen(false)} className="px-3 py-1.5 text-gray-500">ยกเลิก</button>
                                <button onClick={handleSaveExpense} className="px-3 py-1.5 bg-primary-600 text-white rounded">บันทึก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Also update the SubActivityItem props to use ExtendedSubActivity
interface ExtendedSubActivity extends SubActivity {
    childrenList: ExtendedSubActivity[];
    used: number;
}

interface SubActivityItemProps {
    item: ExtendedSubActivity;
    level?: number;
    onUpdate: (sub: SubActivity) => void;
    onDelete: (id: string) => void;
    onAddChild: (name: string, allocated: string, parentId: string) => void;
}

const SubActivityItem: React.FC<SubActivityItemProps> = ({ item, level = 0, onUpdate, onDelete, onAddChild }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: item.name, allocated: item.allocated.toString() });
    const [isAddingChild, setIsAddingChild] = useState(false);
    const [childForm, setChildForm] = useState({ name: '', allocated: '' });

    return (
        <div className="mb-2">
            <div className={`flex items-center justify-between p-3 rounded-lg border ${level === 0 ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 ml-6'}`}>
                <div className="flex items-center gap-3 flex-1">
                    {item.childrenList.length > 0 && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-gray-600">
                            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    )}
                    {item.childrenList.length === 0 && <span className="w-3.5" />}

                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                className="border rounded px-2 py-1 text-sm flex-1"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                            <input
                                type="number"
                                className="border rounded px-2 py-1 text-sm w-24"
                                value={editForm.allocated}
                                onChange={e => setEditForm({ ...editForm, allocated: e.target.value })}
                            />
                            <button onClick={() => {
                                onUpdate({ ...item, name: editForm.name, allocated: parseFloat(editForm.allocated) });
                                setIsEditing(false);
                            }} className="text-green-600 text-xs font-bold">บันทึก</button>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 text-xs">ยกเลิก</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <div className="mt-1 w-full max-w-xs">
                                    <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                                        <span>ใช้ไป ฿{item.used.toLocaleString()}</span>
                                        <span className={(item.allocated - item.used) < 0 ? 'text-red-500 font-bold' : ''}>
                                            เหลือ ฿{(item.allocated - item.used).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${(item.allocated - item.used) < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min(100, (item.used / item.allocated) * 100) || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-right mr-4">
                                <p className="text-sm font-bold text-gray-900">฿{item.allocated.toLocaleString()}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isEditing && (
                        <>
                            <button onClick={() => setIsAddingChild(true)} className="text-blue-500 hover:text-blue-700 p-1" title="เพิ่มกิจกรรมย่อย">
                                <Layers size={14} />
                            </button>
                            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600 p-1" title="แก้ไข">
                                <FileText size={14} />
                            </button>
                            <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 p-1" title="ลบ">
                                <X size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isAddingChild && (
                <div className="ml-10 mt-2 p-2 bg-blue-50 rounded border border-blue-100 flex gap-2">
                    <input
                        placeholder="ชื่อกิจกรรมย่อย"
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        value={childForm.name}
                        onChange={e => setChildForm({ ...childForm, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="บาท"
                        className="w-24 border rounded px-2 py-1 text-sm"
                        value={childForm.allocated}
                        onChange={e => setChildForm({ ...childForm, allocated: e.target.value })}
                    />
                    <button onClick={() => {
                        onAddChild(childForm.name, childForm.allocated, item.id);
                        setIsAddingChild(false);
                        setChildForm({ name: '', allocated: '' });
                    }} className="bg-blue-600 text-white text-xs px-3 py-1 rounded">เพิ่ม</button>
                    <button onClick={() => setIsAddingChild(false)} className="text-gray-500 text-xs px-2">ยกเลิก</button>
                </div>
            )}

            {isExpanded && item.childrenList.length > 0 && (
                <div className="mt-2">
                    {item.childrenList.map(child => (
                        <SubActivityItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
export default CategoryDetailModal;

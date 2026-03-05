'use client'
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useBudget } from '@/context/BudgetContext';
import { Category, BudgetLog, Expense, BudgetRequest } from '@/types';

import ManagementHeader from '@/components/features/budget/ManagementHeader';
import CategoryList from '@/components/features/budget/CategoryList';
import CategoryModal from '@/components/features/budget/CategoryModal';
import CategoryDetailModal from '@/components/features/budget/CategoryDetailModal';

const COLORS = [
  { bg: 'bg-emerald-600', label: 'เขียว' },
  { bg: 'bg-blue-600', label: 'น้ำเงิน' },
  { bg: 'bg-purple-600', label: 'ม่วง' },
  { bg: 'bg-orange-600', label: 'ส้ม' },
  { bg: 'bg-red-600', label: 'แดง' },
  { bg: 'bg-pink-600', label: 'ชมพู' },
];

const BudgetCategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, requests, subActivities, addSubActivity, deleteSubActivity, adjustBudget, getBudgetLogs, addExpense, getExpenses, deleteExpense } = useBudget();
  const [selectedYear, setSelectedYear] = useState(2569);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  // Detail Modal Tab State
  const [activeDetailTab, setActiveDetailTab] = useState<'requests' | 'allocation' | 'history' | 'expenses'>('requests');
  const [budgetLogs, setBudgetLogs] = useState<BudgetLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Calculate used amounts dynamically based on requests in context
  const categoriesWithUsage = categories.map((cat: Category) => {
    // Encumbered/Reserved from Approved Requests
    const reserved = (requests as BudgetRequest[])
      .filter((r: BudgetRequest) => r.category === cat.name && r.status === 'approved')
      .reduce((sum: number, r: BudgetRequest) => sum + r.amount, 0);

    const pending = (requests as BudgetRequest[])
      .filter((r: BudgetRequest) => r.category === cat.name && r.status === 'pending')
      .reduce((sum: number, r: BudgetRequest) => sum + r.amount, 0);

    return { ...cat, used: cat.used || 0, reserved, pending };
  });

  const currentYearCategories = categoriesWithUsage.filter((cat: any) => cat.year === selectedYear);

  const filteredCategories = currentYearCategories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.code.includes(searchQuery)
  );

  const totalAllocated = currentYearCategories.reduce((sum: number, cat: any) => sum + cat.allocated, 0);
  const totalUsed = currentYearCategories.reduce((sum: number, cat: any) => sum + (cat.used || 0), 0);
  const totalRemaining = totalAllocated - totalUsed;

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleViewCategory = (cat: Category) => {
    setViewingCategory(cat);
    setActiveDetailTab('requests'); // Reset to default tab
  };

  const handleSaveCategory = (formData: any) => {
    if (!formData.name || !formData.allocated) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : crypto.randomUUID(),
      name: formData.name,
      code: formData.code,
      segment: formData.segment,
      allocated: parseFloat(formData.allocated.toString()),
      used: 0,
      color: formData.color,
      colorLabel: formData.name.charAt(0).toUpperCase(),
      year: editingCategory ? editingCategory.year : selectedYear,
      businessPlace: formData.businessPlace,
      businessArea: formData.businessArea,
      fund: formData.fund,
      fundCenter: formData.fundCenter,
      costCenter: formData.costCenter,
      functionalArea: formData.functionalArea,
      commitmentItem: formData.commitmentItem
    };

    if (editingCategory) {
      updateCategory(categoryData);
      toast.success('แก้ไขหมวดหมู่สำเร็จ!');
    } else {
      addCategory(categoryData);
      toast.success('เพิ่มหมวดหมู่สำเร็จ!');
    }
    setIsModalOpen(false);
  };

  // Auto-generate category code logic for Modal
  const getAutoCode = () => {
    const existingCodes = categories
      .map((c: Category) => c.code)
      .filter((code: string) => code.startsWith('DCC-'))
      .map((code: string) => parseInt(code.replace('DCC-', '')))
      .filter((num: number) => !isNaN(num));
    const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    return `DCC-${String(nextNumber + 1).padStart(3, '0')}`;
  };

  // Effects for fetching details
  useEffect(() => {
    if (viewingCategory && activeDetailTab === 'history') {
      getBudgetLogs(viewingCategory.id).then(setBudgetLogs);
    }
    if (viewingCategory && activeDetailTab === 'expenses') {
      getExpenses(viewingCategory.id).then(setExpenses);
    }
  }, [viewingCategory, activeDetailTab]);

  // Sync viewingCategory with updated categories from context
  useEffect(() => {
    if (viewingCategory) {
      const updated = categories.find(c => c.id === viewingCategory.id);
      if (updated && updated !== viewingCategory) {
        setViewingCategory(updated);
      }
    }
  }, [categories]);


  return (
    <div className="space-y-6">
      <ManagementHeader
        totalAllocated={totalAllocated}
        totalRemaining={totalRemaining}
        categoriesCount={currentYearCategories.length}
        selectedYear={selectedYear}
      />

      <CategoryList
        categories={filteredCategories}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={deleteCategory}
        onViewClick={handleViewCategory}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
        selectedYear={selectedYear}
        autoCode={!editingCategory ? getAutoCode() : undefined}
        colors={COLORS}
      />

      <CategoryDetailModal
        viewingCategory={viewingCategory}
        onClose={() => setViewingCategory(null)}
        requests={requests}
        subActivities={subActivities}
        budgetLogs={budgetLogs}
        expenses={expenses}
        activeDetailTab={activeDetailTab}
        setActiveDetailTab={setActiveDetailTab}
        onAdjustBudget={async (amount: number, type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE', reason: string) => {
          if (viewingCategory) {
            await adjustBudget(viewingCategory.id, amount, type, reason);
            toast.success('ปรับปรุงงบประมาณสำเร็จ!');
            if (activeDetailTab === 'history') getBudgetLogs(viewingCategory.id).then(setBudgetLogs);
          }
        }}
        onAddSubActivity={async (name: string, allocated: string) => {
          if (viewingCategory) {
            try {
              await addSubActivity({
                id: crypto.randomUUID(),
                categoryId: viewingCategory.id,
                name,
                allocated: parseFloat(allocated)
              } as any);
              toast.success('เพิ่มกิจกรรมย่อยสำเร็จ');
            } catch (error) {
              console.error("Failed to add sub-activity:", error);
              toast.error('ไม่สามารถเพิ่มกิจกรรมย่อยได้');
            }
          }
        }}
        onDeleteSubActivity={deleteSubActivity}
        onAddExpense={async (expenseData: any) => {
          if (viewingCategory) {
            await addExpense({
              categoryId: viewingCategory.id,
              amount: parseFloat(expenseData.amount),
              payee: expenseData.payee,
              date: expenseData.date,
              description: expenseData.description,
            });
            toast.success('บันทึกรายจ่ายสำเร็จ!');
            getExpenses(viewingCategory.id).then(setExpenses);
          }
        }}
        onDeleteExpense={async (id: string) => {
          if (viewingCategory) {
            await deleteExpense(id); // Assuming this exists in context or needs implementation
            toast.success('ลบรายจ่ายสำเร็จ');
            getExpenses(viewingCategory.id).then(setExpenses);
          }
        }}
      />
    </div>
  );
};

export default BudgetCategoriesManager;

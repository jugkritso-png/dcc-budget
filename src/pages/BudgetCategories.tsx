import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useBudget } from '../context/BudgetContext';
import { Category, BudgetLog, Expense } from '../types';

import ManagementHeader from '../components/management/ManagementHeader';
import CategoryList from '../components/management/CategoryList';
import CategoryModal from '../components/management/CategoryModal';
import CategoryDetailModal from '../components/management/CategoryDetailModal';

const COLORS = [
  { bg: 'bg-emerald-600', label: 'เขียว' },
  { bg: 'bg-blue-600', label: 'น้ำเงิน' },
  { bg: 'bg-purple-600', label: 'ม่วง' },
  { bg: 'bg-orange-600', label: 'ส้ม' },
  { bg: 'bg-red-600', label: 'แดง' },
  { bg: 'bg-pink-600', label: 'ชมพู' },
];

const BudgetCategories: React.FC = () => {
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
  const categoriesWithUsage = categories.map(cat => {
    // Encumbered/Reserved from Approved Requests
    const reserved = requests
      .filter(r => r.category === cat.name && r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);

    const pending = requests
      .filter(r => r.category === cat.name && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    return { ...cat, used: cat.used, reserved, pending };
  });

  const currentYearCategories = categoriesWithUsage.filter(cat => cat.year === selectedYear);

  const filteredCategories = currentYearCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.code.includes(searchQuery)
  );

  const totalAllocated = currentYearCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalUsed = currentYearCategories.reduce((sum, cat) => sum + cat.used, 0);
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
      id: editingCategory ? editingCategory.id : Date.now().toString(),
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
      .map(c => c.code)
      .filter(code => code.startsWith('DCC-'))
      .map(code => parseInt(code.replace('DCC-', '')))
      .filter(num => !isNaN(num));
    const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `DCC-${String(nextNumber).padStart(3, '0')}`;
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
        onAdjustBudget={async (amount, type, reason) => {
          if (viewingCategory) {
            await adjustBudget(viewingCategory.id, amount, type, reason);
            toast.success('ปรับปรุงงบประมาณสำเร็จ!');
            if (activeDetailTab === 'history') getBudgetLogs(viewingCategory.id).then(setBudgetLogs);
          }
        }}
        onAddSubActivity={(name, allocated) => {
          if (viewingCategory) {
            addSubActivity({
              id: `SUB-${Date.now()}`,
              categoryId: viewingCategory.id,
              name,
              allocated: parseFloat(allocated)
            });
            toast.success('เพิ่มดกิจกรรมย่อยสำเร็จ');
          }
        }}
        onDeleteSubActivity={deleteSubActivity}
        onAddExpense={async (expenseData) => {
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
        onDeleteExpense={async (id) => {
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

export default BudgetCategories;

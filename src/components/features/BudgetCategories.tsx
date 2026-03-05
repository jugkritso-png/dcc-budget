
'use client'

import React, { useState } from 'react'
import { useBudget } from '@/context/BudgetContext'
import CategoryList from './CategoryList'
import CategoryModal from './CategoryModal'
import CategoryDetailModal from './CategoryDetailModal'
import { Category } from '@/types'
import Swal from 'sweetalert2'
import { SubActivity } from '@/types'

export function BudgetCategories() {
    const {
        categories, addCategory, updateCategory, deleteCategory, settings,
        requests, subActivities, budgetLogs, expenses,
        adjustBudget, addSubActivity, deleteSubActivity, addExpense, deleteExpense: deleteExpenseItem
    } = useBudget()
    const [selectedYear, setSelectedYear] = useState(settings.fiscalYear || new Date().getFullYear() + 543)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
    const [activeDetailTab, setActiveDetailTab] = useState<'requests' | 'allocation' | 'history' | 'expenses'>('requests')

    const filteredCategories = categories.filter(cat =>
        cat.year === selectedYear &&
        (cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.code.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleAddCategory = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    const handleEditCategory = (cat: Category) => {
        setEditingCategory(cat)
        setIsModalOpen(true)
    }

    const handleDeleteCategory = async (id: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        })

        if (result.isConfirmed) {
            try {
                await deleteCategory(id)
                Swal.fire('ลบแล้ว!', 'หมวดหมู่ถูกลบเรียบร้อย', 'success')
            } catch (err: any) {
                Swal.fire('ผิดพลาด', err.message, 'error')
            }
        }
    }

    const handleViewCategory = (cat: Category) => {
        setViewingCategory(cat)
        setIsDetailOpen(true)
    }

    return (
        <>
            <CategoryList
                categories={filteredCategories}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddClick={handleAddCategory}
                onEditClick={handleEditCategory}
                onDeleteClick={handleDeleteCategory}
                onViewClick={handleViewCategory}
            />

            {isModalOpen && (
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingCategory}
                    selectedYear={selectedYear}
                    autoCode={editingCategory ? editingCategory.code : `DCC-${(categories.length + 1).toString().padStart(3, '0')}`}
                    colors={[
                        { bg: 'bg-emerald-500', label: 'เขียว' },
                        { bg: 'bg-blue-500', label: 'ฟ้า' },
                        { bg: 'bg-indigo-500', label: 'น้ำเงิน' },
                        { bg: 'bg-purple-500', label: 'ม่วง' },
                        { bg: 'bg-rose-500', label: 'ชมพู' },
                        { bg: 'bg-amber-500', label: 'ส้ม' },
                    ]}
                    onSave={async (cat) => {
                        if (editingCategory) {
                            await updateCategory({ ...cat, id: editingCategory.id } as Category)
                        } else {
                            await addCategory({ ...cat, year: selectedYear } as Category)
                        }
                        setIsModalOpen(false)
                    }}
                />
            )}

            {isDetailOpen && viewingCategory && (
                <CategoryDetailModal
                    viewingCategory={viewingCategory}
                    onClose={() => setIsDetailOpen(false)}
                    requests={requests}
                    subActivities={subActivities}
                    budgetLogs={budgetLogs}
                    expenses={expenses}
                    activeDetailTab={activeDetailTab}
                    setActiveDetailTab={setActiveDetailTab}
                    onAdjustBudget={(amount, type, reason) => adjustBudget(viewingCategory.id, amount, type, reason)}
                    onAddSubActivity={(name, allocated) => addSubActivity({
                        id: crypto.randomUUID(),
                        categoryId: viewingCategory.id,
                        name,
                        allocated: parseFloat(allocated)
                    } as SubActivity)}
                    onDeleteSubActivity={deleteSubActivity}
                    onAddExpense={(expense) => addExpense({
                        ...expense,
                        id: crypto.randomUUID(),
                        categoryId: viewingCategory.id,
                        categoryName: viewingCategory.name
                    })}
                    onDeleteExpense={deleteExpenseItem}
                />
            )}
        </>
    )
}

import React, { useState, FormEvent, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { ExpenseLineItem } from '../types';
import toast from 'react-hot-toast';

export const useCreateRequestForm = (onSuccess?: () => void) => {
    const { addRequest, categories, departments, user } = useBudget();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        project: '',
        date: new Date().toISOString().split('T')[0],
        bookNumber: '', // Added bookNumber
        category: '',
        activity: '', // Changed from subActivity to activity to match BudgetRequest interface
        subActivityId: '',
        department: user?.department || '',
        amount: 0,
        reason: '',
        urgency: 'normal' as 'normal' | 'urgent' | 'critical',
        startDate: '',
        endDate: '',
        expenseItems: [] as ExpenseLineItem[]
    });

    const availableSubActivities = categories.find(c => c.name === formData.category)?.subActivities || [];

    const addExpenseItem = () => {
        setFormData(prev => ({
            ...prev,
            expenseItems: [
                ...prev.expenseItems,
                {
                    id: Date.now().toString(),
                    description: '',
                    quantity: 1,
                    unit: 'ชุด',
                    unitPrice: 0,
                    total: 0,
                    category: prev.category || '',
                    // No categoryId in ExpenseLineItem interface based on previous context, but sticking to basics
                }
            ]
        }));
    };

    const removeExpenseItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            expenseItems: prev.expenseItems.filter(item => item.id !== id)
        }));
    };

    const updateExpenseItem = (id: string, field: keyof ExpenseLineItem, value: any) => {
        setFormData(prev => {
            const updatedItems = prev.expenseItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'unitPrice') {
                        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
                    }
                    return updatedItem;
                }
                return item;
            });

            // Auto update total amount
            const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

            return {
                ...prev,
                expenseItems: updatedItems,
                amount: totalAmount > 0 ? totalAmount : prev.amount
            };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.category) return toast.error('กรุณาเลือกหมวดหมู่');
        if (formData.amount <= 0 && formData.expenseItems.length === 0) return toast.error('กรุณาระบุจำนวนเงิน');

        setIsSubmitting(true);
        try {
            await addRequest({
                id: `REQ-${Date.now()}`, // Generate ID here or in context
                ...formData,
                amount: Number(formData.amount),
                status: 'pending',
                requester: user?.name || 'Unknown',
                // department is already in formData
            });
            toast.success('สร้างคำขอเรียบร้อยแล้ว');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการสร้างคำขอ');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        availableSubActivities,
        categories,
        departments,
        isSubmitting,
        handleChange,
        handleSubmit,
        addExpenseItem,
        removeExpenseItem,
        updateExpenseItem
    };
};

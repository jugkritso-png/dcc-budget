import React from 'react';
import { useCreateRequestForm } from '../hooks/useCreateRequestForm';
import { ProjectInfoForm } from '../components/budget/ProjectInfoForm';
import { BudgetInfoForm } from '../components/budget/BudgetInfoForm';
import { ExpenseEstimationTable } from '../components/budget/ExpenseEstimationTable';
import { Button } from '../components/ui/Button';
import { FileText, Save } from 'lucide-react';
import { Page } from '../types';

interface CreateRequestProps {
    onNavigate?: (page: Page) => void;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ onNavigate }) => {
    const {
        formData,
        setFormData,
        availableSubActivities,
        categories,
        isSubmitting,
        handleSubmit,
        addExpenseItem,
        removeExpenseItem,
        updateExpenseItem,
        handleChange
    } = useCreateRequestForm(() => {
        if (onNavigate) {
            onNavigate(Page.BUDGET);
        }
    });

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4 px-4 md:px-0">
                <div className="min-w-0 w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="text-primary-600 flex-shrink-0" size={22} />
                        <span>ขอใช้งบประมาณ</span>
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm mt-1 ml-8">กรอกรายละเอียดเพื่อขออนุมัติงบประมาณสำหรับโครงการหรือกิจกรรม</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full md:max-w-5xl mx-auto pb-10">
                <div className="bg-white px-5 py-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-gray-100/50 space-y-8">

                    <ProjectInfoForm
                        formData={formData}
                        handleChange={handleChange}
                    />

                    <BudgetInfoForm
                        formData={formData}
                        categories={categories}
                        availableSubActivities={availableSubActivities}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />

                    <ExpenseEstimationTable
                        expenseItems={formData.expenseItems || []}
                        categories={categories}
                        addExpenseItem={addExpenseItem}
                        removeExpenseItem={removeExpenseItem}
                        updateExpenseItem={updateExpenseItem}
                    />

                    <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                if (confirm('คุณต้องการยกเลิกการทำรายการใช่หรือไม่? ข้อมูลที่กรอกจะหายไป')) {
                                    if (onNavigate) onNavigate(Page.BUDGET);
                                }
                            }}
                            className="w-full md:w-auto px-6 py-3 h-auto text-gray-600 hover:bg-gray-100 order-2 md:order-1"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-8 py-3 h-auto text-sm font-bold flex items-center justify-center gap-2 order-1 md:order-2"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกคำขอ'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateRequest;


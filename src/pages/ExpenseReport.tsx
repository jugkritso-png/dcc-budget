import React from 'react';
import { useExpenseReport } from '../hooks/useExpenseReport';
import { ExpenseRequestList } from '../components/budget/ExpenseRequestList';
import { ExpenseReportModal } from '../components/budget/ExpenseReportModal';
import { VerificationModal } from '../components/budget/VerificationModal';
import { Search } from 'lucide-react';

const ExpenseReport: React.FC = () => {
    const {
        searchTerm, setSearchTerm,
        viewMode, setViewMode,
        filteredRequests,
        selectedRequest,
        isModalOpen, setIsModalOpen,
        isVerifyModalOpen, setIsVerifyModalOpen,
        expenseData, setExpenseData,
        handleOpenReport,
        handleOpenVerifyModal,
        handleExpenseChange,
        calculateTotals,
        handleSubmitReport,
        handleConfirmVerification,
        handleRejectVerification,
        handleRevertComplete,
        requests
    } = useExpenseReport();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        รายงานผลการใช้จ่าย (Expense Report)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        บันทึกค่าใช้จ่ายจริงและปิดโครงการเพื่อคืนเงินงบประมาณ
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Search Bar - Optional addition to make it consistent with other pages */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาโครงการ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
                        />
                    </div>

                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'active'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            รอรายงานผล
                        </button>
                        <button
                            onClick={() => setViewMode('verify')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'verify'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            รอตรวจสอบ ({requests.filter(r => r.status === 'waiting_verification').length})
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'history'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            ประวัติการปิดโครงการ
                        </button>
                    </div>
                </div>
            </div>

            <ExpenseRequestList
                requests={filteredRequests}
                viewMode={viewMode}
                handleOpenReport={handleOpenReport}
                handleOpenVerifyModal={handleOpenVerifyModal}
                revertComplete={handleRevertComplete}
            />

            <ExpenseReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRequest={selectedRequest}
                expenseData={expenseData}
                setExpenseData={setExpenseData}
                handleExpenseChange={handleExpenseChange}
                handleSubmit={handleSubmitReport}
                calculateTotals={calculateTotals}
            />

            <VerificationModal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                selectedRequest={selectedRequest}
                handleConfirmVerification={handleConfirmVerification}
                handleRejectVerification={handleRejectVerification}
            />
        </div>
    );
};

export default ExpenseReport;


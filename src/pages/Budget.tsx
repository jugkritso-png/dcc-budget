import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { generateBudgetPDF } from '../utils/pdfGenerator';
import { OfficialMemo } from '../components/documents/OfficialMemo';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ApprovalModal } from '../components/budget/ApprovalModal';
import { BudgetStats } from '../components/budget/BudgetStats';
import { BudgetTable } from '../components/budget/BudgetTable';
import { BudgetMobileList } from '../components/budget/BudgetMobileList';
import { RequestDetailsModal } from '../components/budget/RequestDetailsModal';
import { useBudgetFilters } from '../hooks/useBudgetFilters';
import { FileText, Download, Plus, Search, AlertTriangle } from 'lucide-react';
import { BudgetRequest } from '../types';

const Budget: React.FC = () => {
  const { requests, categories, hasPermission, approveRequest, rejectRequest, updateRequestStatus, deleteRequest } = useBudget();
  const {
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    filteredRequests,
    clearFilters
  } = useBudgetFilters(requests);

  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [showOfficialMemo, setShowOfficialMemo] = useState(false);
  const [memoRequest, setMemoRequest] = useState<BudgetRequest | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'reject'; requestId: string | null }>({
    isOpen: false,
    type: 'delete',
    requestId: null
  });
  const [approvalRequest, setApprovalRequest] = useState<BudgetRequest | null>(null);

  const handleExportPDF = async () => {
    await generateBudgetPDF(requests, categories);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'delete', requestId: id });
  };

  const openApprovalModal = (request: BudgetRequest) => {
    setApprovalRequest(request);
  };

  const handleConfirmAction = () => {
    if (confirmDialog.requestId) {
      if (confirmDialog.type === 'delete') {
        deleteRequest(confirmDialog.requestId);
        toast.success('ลบรายการสำเร็จ');
        if (selectedRequest?.id === confirmDialog.requestId) {
          setSelectedRequest(null);
        }
      }
    }
    setConfirmDialog({ ...confirmDialog, isOpen: false, requestId: null });
  };

  const handleCreateMemo = (request: BudgetRequest) => {
    setMemoRequest(request);
    setShowOfficialMemo(true);
    setSelectedRequest(null); // Close details modal if open
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-200 flex items-center gap-2">
          <FileText size={18} />
          รายการคำของบประมาณ
        </div>
      </div>

      {/* Summary Stats */}
      <BudgetStats requests={requests} />

      {/* Main Content Area */}
      <Card className="p-4 md:p-8 min-h-[400px] md:min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              <FileText className="text-primary-600" />
              รายการคำของบประมาณ
            </h2>
            <p className="text-gray-500 text-sm mt-1 ml-8">จัดการคำขอและสถานะการอนุมัติ ทั้งหมด {requests.length} รายการ</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleExportPDF}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Download size={18} className="text-gray-500" /> Export PDF
            </button>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.hash = '#'; window.history.pushState({}, '', '/'); }}
              className="pointer-events-none opacity-50 grayscale"
              title="กรุณาใช้เมนู 'ขอใช้งบประมาณ' ด้านซ้ายเพื่อสร้างรายการใหม่"
            >
              <Button variant="primary" disabled className="shadow-lg shadow-blue-200">
                <Plus size={20} className="mr-2" /> ใช้เมนู "ขอใช้งบประมาณ"
              </Button>
            </a>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 mb-8 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="ค้นหาชื่อโครงการ หรือ รหัสคำขอ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 h-11"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              className="h-11 font-bold"
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              options={[
                { value: 'all', label: '📁 หมวดหมู่ทั้งหมด' },
                ...categories.map(c => ({ value: c.name, label: c.name }))
              ]}
            />
          </div>
          <div className="w-full md:w-56">
            <Select
              className="h-11 font-bold"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: 'all', label: '⚡ สถานะทั้งหมด' },
                { value: 'pending', label: 'รออนุมัติ' },
                { value: 'approved', label: 'อนุมัติ' },
                { value: 'rejected', label: 'ไม่อนุมัติ' },
                { value: 'waiting_verification', label: 'อยู่ระหว่างรายงานผล' },
                { value: 'completed', label: 'รายงานผลเรียบร้อยแล้ว' }
              ]}
            />
          </div>
        </div>

        {/* Mobile View */}
        <BudgetMobileList
          requests={filteredRequests}
          categories={categories}
          onSelectRequest={setSelectedRequest}
        />

        {/* Desktop Table View */}
        <BudgetTable
          requests={filteredRequests}
          categories={categories}
          hasPermission={hasPermission}
          onSelectRequest={setSelectedRequest}
          onDeleteRequest={handleDeleteClick}
          updateRequestStatus={updateRequestStatus}
          openApprovalModal={openApprovalModal}
        />
      </Card>

      {/* Details Modal */}
      <RequestDetailsModal
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        categories={categories}
        updateRequestStatus={updateRequestStatus}
        openApprovalModal={openApprovalModal}
        onCreateMemo={handleCreateMemo}
      />

      {/* Confirmation Dialog */}
      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title="ยืนยันการทำรายการ"
        width="max-w-sm"
      >
        <div className="p-2 text-center">
          <AlertTriangle size={48} className={`mx-auto mb-4 ${confirmDialog.type === 'delete' ? 'text-red-500' : 'text-orange-500'}`} />
          <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการทำรายการ?</h3>
          <p className="text-gray-500 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>ยกเลิก</Button>
            <Button variant={confirmDialog.type === 'delete' ? 'danger' : 'warning'} onClick={handleConfirmAction}>ยืนยัน</Button>
          </div>
        </div>
      </Modal>

      {/* Official Memo Modal */}
      {showOfficialMemo && memoRequest && (
        <OfficialMemo
          request={memoRequest}
          category={categories.find(c => c.name === memoRequest.category) || null}
          onClose={() => {
            setShowOfficialMemo(false);
            setMemoRequest(null);
          }}
        />
      )}

      {/* Approval Modal */}
      {approvalRequest && (
        <ApprovalModal
          isOpen={true}
          onClose={() => setApprovalRequest(null)}
          request={approvalRequest}
        />
      )}
    </div>
  );
};

export default Budget;

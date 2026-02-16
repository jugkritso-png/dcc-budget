
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Plus, Search, Download, Clock, CheckCircle2, XCircle, BarChart, X, Trash2, AlertTriangle, FileText, User, Minimize2, Maximize2, FileCheck2, PieChart, Calculator } from 'lucide-react';
import { BudgetRequest, ExpenseLineItem } from '../types';
import { useBudget } from '../context/BudgetContext';
import { generateBudgetPDF } from '../utils/pdfGenerator';
import { OfficialMemo } from '../components/OfficialMemo';

import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ApprovalModal } from '../components/budget/ApprovalModal';

const Budget: React.FC = () => {
  const { requests, categories, user, departments, hasPermission, approveRequest, rejectRequest, completeRequest, revertComplete, addRequest, updateRequestStatus, deleteRequest } = useBudget();
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [showOfficialMemo, setShowOfficialMemo] = useState(false);
  const [memoRequest, setMemoRequest] = useState<BudgetRequest | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'reject'; requestId: string | null }>({
    isOpen: false,
    type: 'delete',
    requestId: null
  });
  const [approvalRequest, setApprovalRequest] = useState<BudgetRequest | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const handleExportPDF = async () => {
    await generateBudgetPDF(requests, categories);
  };

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Summary Stats
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const pendingAmount = requests.filter(r => r.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const approvedAmount = requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);

  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const rejectedAmount = requests.filter(r => r.status === 'rejected').reduce((acc, curr) => acc + curr.amount, 0);

  const waitingCount = requests.filter(r => r.status === 'waiting_verification').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  // Show all requests in Total
  const totalCount = requests.length;
  const totalAmount = requests.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Tabs - Removed as Report is moved to Analytics */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-200 flex items-center gap-2">
          <FileText size={18} />
          รายการคำของบประมาณ
        </div>
      </div>


      {/* Summary Cards Row - Clean Metro Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Pending */}
        <Card interactive className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition-colors">
              <Clock size={24} />
            </div>
            <Badge variant="warning">รออนุมัติ</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{pendingCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-amber-600">฿{pendingAmount.toLocaleString()}</span></p>
        </Card>

        {/* Approved */}
        <Card interactive className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 size={24} />
            </div>
            <Badge variant="success">อนุมัติแล้ว</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{approvedCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-emerald-600">฿{approvedAmount.toLocaleString()}</span></p>
        </Card>

        {/* Waiting Verification (Reporting) */}
        <Card interactive className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors">
              <FileCheck2 size={24} />
            </div>
            <Badge variant="info">รายงานผล</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{waitingCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">รายงานผลแล้ว: {completedCount}</p>
        </Card>

        {/* Total */}
        <Card interactive className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 border border-primary-100 group-hover:bg-primary-100 transition-colors">
              <BarChart size={24} />
            </div>
            <Badge variant="default">ทั้งหมด</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{totalCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-primary-600">฿{totalAmount.toLocaleString()}</span></p>
        </Card>
      </div>

      {/* Main Content Area - System Design Table */}
      <Card className="p-8 min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
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

        {/* System Design Table - Floating Rows */}
        <div className="overflow-x-auto min-h-[400px]">
          <Table className="w-full text-left border-separate border-spacing-y-3 px-1">
            <TableHeader>
              <tr>
                <TableHead className="py-2 px-6 pl-8 font-semibold text-gray-400 uppercase tracking-wider">วันที่ / รหัส</TableHead>
                <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">โครงการ</TableHead>
                <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">หมวดหมู่</TableHead>
                <TableHead className="py-2 px-4 font-semibold text-gray-400 uppercase tracking-wider">ผู้ขอ</TableHead>
                <TableHead className="py-2 px-4 text-right font-semibold text-gray-400 uppercase tracking-wider">งบประมาณ</TableHead>
                <TableHead className="py-2 px-4 text-center font-semibold text-gray-400 uppercase tracking-wider">สถานะ</TableHead>
                <TableHead className="py-2 px-6 text-right pr-8 font-semibold text-gray-400 uppercase tracking-wider">จัดการ</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="text-gray-600">
              {filteredRequests.map((req) => {
                const category = categories.find(c => c.name === req.category);
                const accentColor = category ? category.color.replace('bg-', '') : 'primary-500';

                // Status Logic
                let statusLabel = '';
                let statusColorClass = '';
                let statusDotClass = '';

                switch (req.status) {
                  case 'pending':
                    statusLabel = 'รออนุมัติ';
                    statusColorClass = 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100';
                    statusDotClass = 'bg-yellow-500 animate-pulse';
                    break;
                  case 'approved':
                    statusLabel = 'อนุมัติ';
                    statusColorClass = 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100';
                    statusDotClass = 'bg-green-500 animate-pulse';
                    break;
                  case 'rejected':
                    statusLabel = 'ไม่อนุมัติ';
                    statusColorClass = 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100';
                    statusDotClass = 'bg-red-500';
                    break;
                  case 'waiting_verification':
                    statusLabel = 'อยู่ระหว่างรายงานผล';
                    statusColorClass = 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
                    statusDotClass = 'bg-blue-500 animate-pulse';
                    break;
                  case 'completed':
                    statusLabel = 'รายงานผลเรียบร้อยแล้ว';
                    statusColorClass = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
                    statusDotClass = 'bg-gray-500';
                    break;
                  default:
                    statusLabel = req.status;
                    statusColorClass = 'bg-gray-50 text-gray-600 border-gray-100';
                    statusDotClass = 'bg-gray-400';
                }

                return (
                  <TableRow
                    key={req.id}
                    className="group bg-white transition-all duration-300 shadow-sm hover:shadow-card-hover rounded-2xl relative overflow-hidden transform hover:-translate-y-1 hover:z-10"
                  >
                    {/* Left Accent Strip */}
                    <TableCell className="py-4 px-6 pl-8 rounded-l-2xl align-middle relative">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 md:w-2 ${category ? category.color : 'bg-gray-300'} group-hover:scale-y-100 transition-transform origin-bottom`}></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{req.date}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 w-fit mt-1 font-mono">{req.id}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 align-middle">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1 text-base">{req.project}</p>
                      {req.urgency === 'urgent' && <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 mt-1 inline-block">ด่วน</span>}
                      {req.urgency === 'critical' && <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 mt-1 inline-block">ด่วนที่สุด</span>}
                    </TableCell>

                    <TableCell className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${category ? category.color : 'bg-gray-400'}`}>
                          <FileText size={14} />
                        </div>
                        <span className="text-sm text-gray-700 font-bold">{req.category}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm text-gray-600 font-medium align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <User size={12} />
                        </div>
                        {req.requester}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-right align-middle">
                      <span className="text-base font-extrabold text-gray-900 tracking-tight">฿{req.amount.toLocaleString()}</span>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-center align-middle">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') {
                              setStatusDropdownOpen(statusDropdownOpen === req.id ? null : req.id);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm border cursor-pointer hover:shadow-md transition-all active:scale-95 ${statusColorClass}`}
                        >
                          <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
                          {statusLabel}
                          {(hasPermission('approve_budget')) && (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') && (
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Dropdown Menu - Only for Approver Actions */}
                        {statusDropdownOpen === req.id && (hasPermission('approve_budget')) && (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setStatusDropdownOpen(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openApprovalModal(req);
                                  setStatusDropdownOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                              >
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                ตรวจสอบ / อนุมัติ
                                {req.status === 'approved' && <span className="ml-auto text-emerald-600">✓</span>}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateRequestStatus(req.id, 'pending');
                                  toast.success('เปลี่ยนเป็นรออนุมัติ');
                                  setStatusDropdownOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                              >
                                <Clock size={16} className="text-amber-600" />
                                รออนุมัติ
                                {req.status === 'pending' && <span className="ml-auto text-amber-600">✓</span>}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openApprovalModal(req);
                                  setStatusDropdownOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                              >
                                <XCircle size={16} className="text-rose-600" />
                                ไม่อนุมัติ
                                {req.status === 'rejected' && <span className="ml-auto text-rose-600">✓</span>}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-6 text-right rounded-r-2xl align-middle pr-8">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">

                        {/* Action Buttons with Tooltips */}
                        {req.status === 'pending' && (hasPermission('approve_budget')) && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateRequestStatus(req.id, 'approved'); toast.success('อนุมัติคำขอสำเร็จ'); }}
                              className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-green-200"
                              title="อนุมัติ"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openApprovalModal(req); }}
                              className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-orange-200"
                              title="ไม่อนุมัติ"
                            >
                              <XCircle size={16} />
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-1"></div>

                          </>
                        )}

                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-primary-200"
                          title="ดูรายละเอียด"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(req.id); }}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-red-200"
                          title="ลบรายการ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100 m-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="text-gray-300" size={40} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">ไม่พบคำขอที่ค้นหา</h3>
              <p className="text-gray-500 text-sm">ลองปรับตัวกรองหรือใช้คำค้นหาอื่น</p>
              <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setCategoryFilter('all'); }} className="mt-4 text-primary-600 font-bold text-sm hover:underline">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      </Card>




      {/* Details Modal */}
      {/* Details Modal */}
      <Modal
        isOpen={!!selectedRequest && !showOfficialMemo}
        onClose={() => setSelectedRequest(null)}
        title="รายละเอียดคำขอ"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-full flex-shrink-0",
                selectedRequest.status === 'approved' ? 'bg-green-100 text-green-600' :
                  selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      selectedRequest.status === 'waiting_verification' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
              )}>
                {selectedRequest.status === 'approved' ? <CheckCircle2 size={32} /> :
                  selectedRequest.status === 'pending' ? <Clock size={32} /> :
                    selectedRequest.status === 'rejected' ? <XCircle size={32} /> :
                      selectedRequest.status === 'waiting_verification' ? <FileCheck2 size={32} /> :
                        <CheckCircle2 size={32} />}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedRequest.project}</h4>
                <p className="text-sm text-gray-500">รหัส: {selectedRequest.id} | วันที่: {selectedRequest.date}</p>
                {selectedRequest.approvalRef && <p className="text-xs text-primary-500 mt-1">Ref: {selectedRequest.approvalRef}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 block">จำนวนเงิน</span>
                <span className="text-lg font-bold text-primary-600">฿{selectedRequest.amount.toLocaleString()}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 block">หมวดหมู่</span>
                <span className="text-lg font-bold text-gray-800">{selectedRequest.category}</span>
              </div>
              {selectedRequest.department && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 block">หน่วยงาน</span>
                  <span className="text-sm font-bold text-gray-800">{selectedRequest.department}</span>
                </div>
              )}
              {selectedRequest.urgency && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 block">ความเร่งด่วน</span>
                  <Badge variant={selectedRequest.urgency === 'critical' ? 'error' : selectedRequest.urgency === 'urgent' ? 'warning' : 'default'}>
                    {selectedRequest.urgency === 'critical' ? 'ด่วนที่สุด' : selectedRequest.urgency === 'urgent' ? 'ด่วน' : 'ปกติ'}
                  </Badge>
                </div>
              )}
            </div>

            {selectedRequest.reason && (
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-1">เหตุผลและความจำเป็น</h5>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedRequest.reason}</p>
              </div>
            )}

            <div>
              <h5 className="text-sm font-bold text-gray-700 mb-1">หมายเหตุ</h5>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedRequest.notes || '-'}</p>
            </div>

            {/* Expense Items Table */}
            {selectedRequest.expenseItems && selectedRequest.expenseItems.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-2">รายละเอียดค่าใช้จ่าย</h5>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-500 font-semibold text-xs border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2">รายการ</th>
                        <th className="px-3 py-2 text-center">จำนวน</th>
                        <th className="px-3 py-2 text-center">หน่วย</th>
                        <th className="px-3 py-2 text-right">ราคา/หน่วย</th>
                        <th className="px-3 py-2 text-right">รวม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRequest.expenseItems.map((item, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-3 py-2">
                            <span className="font-bold text-gray-700 block text-xs">{item.description}</span>
                            <span className="text-[10px] text-gray-400">{item.categoryId || item.category}</span>
                          </td>
                          <td className="px-3 py-2 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-3 py-2 text-center text-gray-600">{item.unit}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{item.unitPrice.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right font-bold text-gray-800">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-right font-bold text-gray-600 text-xs">รวมทั้งสิ้น</td>
                        <td className="px-3 py-2 text-right font-extrabold text-primary-600">{selectedRequest.expenseItems.reduce((sum, i) => sum + i.total, 0).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Status Change Controls */}
            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-sm font-bold text-gray-700 mb-3">เปลี่ยนสถานะการอนุมัติ</h5>
              <div className="flex gap-3">
                <Button
                  variant={selectedRequest.status === 'approved' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedRequest) {
                      updateRequestStatus(selectedRequest.id, 'approved');
                      setSelectedRequest({ ...selectedRequest, status: 'approved' });
                      toast.success('อนุมัติคำขอสำเร็จ');
                    }
                  }}
                  className={cn("flex-1", selectedRequest.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50')}
                >
                  <CheckCircle2 size={18} className="mr-2" /> อนุมัติ
                </Button>
                <Button
                  variant={selectedRequest.status === 'pending' ? 'warning' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedRequest) {
                      updateRequestStatus(selectedRequest.id, 'pending');
                      setSelectedRequest({ ...selectedRequest, status: 'pending' });
                      toast.success('เปลี่ยนสถานะเป็นรออนุมัติ');
                    }
                  }}
                  className={cn("flex-1", selectedRequest.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white' : 'text-amber-600 border-amber-200 hover:bg-amber-50')}
                >
                  <Clock size={18} className="mr-2" /> รออนุมัติ
                </Button>
                <Button
                  variant={selectedRequest.status === 'rejected' ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedRequest) {
                      openApprovalModal(selectedRequest);
                    }
                  }}
                  className={cn("flex-1", selectedRequest.status === 'rejected' ? '' : 'text-rose-600 border-rose-200 hover:bg-rose-50')}
                >
                  <XCircle size={18} className="mr-2" /> ไม่อนุมัติ
                </Button>
              </div>
            </div>

            {/* Official Memo Button */}
            <div className="pt-2">
              <Button
                variant="gradient"
                className="w-full"
                onClick={() => {
                  setMemoRequest(selectedRequest);
                  setShowOfficialMemo(true);
                }}
              >
                <FileText className="w-5 h-5 mr-2" /> สร้างบันทึกข้อความ
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
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
      {
        showOfficialMemo && memoRequest && (
          <OfficialMemo
            request={memoRequest}
            category={categories.find(c => c.name === memoRequest.category) || null}
            onClose={() => {
              setShowOfficialMemo(false);
              setMemoRequest(null);
            }}
          />
        )
      }
      {approvalRequest && (
        <ApprovalModal
          isOpen={true}
          onClose={() => setApprovalRequest(null)}
          request={approvalRequest}
        />
      )}
    </div >
  );
};

export default Budget;


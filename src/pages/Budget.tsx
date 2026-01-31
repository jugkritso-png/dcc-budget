
import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, Clock, CheckCircle2, XCircle, BarChart, X, Trash2, AlertTriangle, FileText, User, Minimize2, Maximize2, FileCheck2, PieChart, Calculator } from 'lucide-react';
import { BudgetRequest, ExpenseLineItem } from '../types';
import { useBudget } from '../context/BudgetContext';
import { generateBudgetPDF } from '../utils/pdfGenerator';
import { OfficialMemo } from '../components/OfficialMemo';

import toast from 'react-hot-toast';

const Budget: React.FC = () => {
  const { requests, deleteRequest, updateRequestStatus, categories } = useBudget();
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [showOfficialMemo, setShowOfficialMemo] = useState(false);
  const [memoRequest, setMemoRequest] = useState<BudgetRequest | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'reject'; requestId: string | null }>({
    isOpen: false,
    type: 'delete',
    requestId: null
  });
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

  const handleRejectClick = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'reject', requestId: id });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.requestId) {
      if (confirmDialog.type === 'delete') {
        deleteRequest(confirmDialog.requestId);
        toast.success('ลบรายการสำเร็จ');
        if (selectedRequest?.id === confirmDialog.requestId) {
          setSelectedRequest(null);
        }
      } else if (confirmDialog.type === 'reject') {
        updateRequestStatus(confirmDialog.requestId, 'rejected');
        toast.success('ไม่อนุมัติคำขอสำเร็จ');
        if (selectedRequest?.id === confirmDialog.requestId) {
          setSelectedRequest(prev => prev ? { ...prev, status: 'rejected' as const } : null);
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

  const totalCount = requests.length;
  const totalAmount = requests.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Tabs - Removed as Report is moved to Analytics */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-200 flex items-center gap-2">
          <FileText size={18} />
          รายการคำของบประมาณ
        </div>
      </div>


      {/* Summary Cards Row - Clean Metro Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Pending */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition-colors">
              <Clock size={24} />
            </div>
            <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-xs font-bold text-amber-600">รออนุมัติ</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{pendingCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-amber-600">฿{pendingAmount.toLocaleString()}</span></p>
        </div>

        {/* Approved */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 size={24} />
            </div>
            <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-xs font-bold text-emerald-600">อนุมัติแล้ว</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{approvedCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-emerald-600">฿{approvedAmount.toLocaleString()}</span></p>
        </div>

        {/* Rejected */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100 group-hover:bg-rose-100 transition-colors">
              <XCircle size={24} />
            </div>
            <div className="px-3 py-1 bg-rose-50 rounded-lg border border-rose-100">
              <span className="text-xs font-bold text-rose-600">ไม่อนุมัติ</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{rejectedCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-rose-600">฿{rejectedAmount.toLocaleString()}</span></p>
        </div>

        {/* Total */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 border border-primary-100 group-hover:bg-primary-100 transition-colors">
              <BarChart size={24} />
            </div>
            <div className="px-3 py-1 bg-primary-50 rounded-lg border border-primary-100">
              <span className="text-xs font-bold text-primary-600">ทั้งหมด</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">{totalCount} <span className="text-sm text-gray-400 font-medium">รายการ</span></h3>
          <p className="text-sm font-bold text-gray-500">มูลค่ารวม <span className="text-primary-600">฿{totalAmount.toLocaleString()}</span></p>
        </div>
      </div>

      {/* Main Content Area - System Design Table */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
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
              onClick={(e) => { e.preventDefault(); window.location.hash = '#'; window.history.pushState({}, '', '/'); /* In a real app with router, use navigate. Here rely on Layout/App state wrapper if possible, or simple page reload if needed, but since we are in App.tsx state management: */ }}
              // Actually, since we don't have access to setPage from here easily without prop drilling, 
              // and looking at App.tsx, it renders pages conditionally based on state.
              // We need to pass a navigation handler to Budget.tsx.
              // For now, I'll assume I can just use a simple workaround or better yet, 
              // I will update Budget.tsx signature to accept onNavigate.
              // BUT for this specific step, I will just change the button text to specific instruction or 
              // render a proper Link if I can.
              // Wait, the user wants me to EXTRACT it.
              // Let's modify App.tsx to pass onNavigate to Budget first? 
              // Or I can just make the button say "Go to Create Request Menu" or similar.
              // NO, I should do it properly.
              // Let's look at how I can trigger the change.
              // The sidebar change works because it calls `onNavigate`.
              // `Budget` component is rendered inside `App`.
              // I should update `Budget` component to accept `onNavigate`.
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all text-shadow-sm pointer-events-none opacity-50 grayscale"
              title="กรุณาใช้เมนู 'ขอใช้งบประมาณ' ด้านซ้ายเพื่อสร้างรายการใหม่"
            >
              <Plus size={20} /> ใช้เมนู "ขอใช้งบประมาณ"
            </a>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 mb-8 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ หรือ รหัสคำขอ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-none shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary-100 placeholder-gray-400 text-gray-700 transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-3 bg-white rounded-xl border-none shadow-sm text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-100 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">📁 หมวดหมู่ทั้งหมด</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-3 bg-white rounded-xl border-none shadow-sm text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-100 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">⚡ สถานะทั้งหมด</option>
              <option value="pending">รออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ไม่อนุมัติ</option>
            </select>
          </div>
        </div>

        {/* System Design Table - Floating Rows */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-separate border-spacing-y-3 px-1">
            <thead>
              <tr className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-2 px-6 pl-8">วันที่ / รหัส</th>
                <th className="py-2 px-4">โครงการ</th>
                <th className="py-2 px-4">หมวดหมู่</th>
                <th className="py-2 px-4">ผู้ขอ</th>
                <th className="py-2 px-4 text-right">งบประมาณ</th>
                <th className="py-2 px-4 text-center">สถานะ</th>
                <th className="py-2 px-6 text-right pr-8">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredRequests.map((req) => {
                const category = categories.find(c => c.name === req.category);
                // Use category color or default
                const accentColor = category ? category.color.replace('bg-', '') : 'blue-500';
                // Need to handle Tailwind arbitrary values if needed, but for now assuming standard colors

                return (
                  <tr
                    key={req.id}
                    className="group bg-white transition-all duration-300 shadow-sm hover:shadow-card-hover rounded-2xl relative overflow-hidden transform hover:-translate-y-1 hover:z-10"
                  >
                    {/* Left Accent Strip */}
                    <td className="py-4 px-6 pl-8 rounded-l-2xl align-middle relative">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 md:w-2 ${category ? category.color : 'bg-gray-300'} group-hover:scale-y-100 transition-transform origin-bottom`}></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{req.date}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 w-fit mt-1 font-mono">{req.id}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1 text-base">{req.project}</p>
                      {req.urgency === 'urgent' && <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 mt-1 inline-block">ด่วน</span>}
                      {req.urgency === 'critical' && <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 mt-1 inline-block">ด่วนที่สุด</span>}
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${category ? category.color : 'bg-gray-400'}`}>
                          <FileText size={14} />
                        </div>
                        <span className="text-sm text-gray-700 font-bold">{req.category}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-sm text-gray-600 font-medium align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <User size={12} />
                        </div>
                        {req.requester}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right align-middle">
                      <span className="text-base font-extrabold text-gray-900 tracking-tight">฿{req.amount.toLocaleString()}</span>
                    </td>

                    <td className="py-4 px-4 text-center align-middle">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusDropdownOpen(statusDropdownOpen === req.id ? null : req.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm border cursor-pointer hover:shadow-md transition-all active:scale-95 ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' :
                            req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100' :
                              'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                            }`}
                        >
                          {req.status === 'approved' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                          {req.status === 'pending' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                          {req.status === 'rejected' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                          {req.status === 'approved' ? 'อนุมัติ' : req.status === 'pending' ? 'รออนุมัติ' : 'ไม่อนุมัติ'}
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {statusDropdownOpen === req.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setStatusDropdownOpen(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateRequestStatus(req.id, 'approved');
                                  toast.success('อนุมัติคำขอสำเร็จ');
                                  setStatusDropdownOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                              >
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                อนุมัติ
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
                                  handleRejectClick(req.id);
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
                    </td>

                    <td className="py-4 px-6 text-right rounded-r-2xl align-middle pr-8">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">

                        {/* Action Buttons with Tooltips */}
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateRequestStatus(req.id, 'approved'); toast.success('อนุมัติคำขอสำเร็จ'); }}
                              className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-green-200"
                              title="อนุมัติ"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRejectClick(req.id); }}
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
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-blue-200"
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
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
      </div>




      {/* Details Modal */}
      {
        selectedRequest && (
          <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in relative border border-white/20">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 className="text-lg font-bold text-gray-900">รายละเอียดคำขอ</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-full flex-shrink-0 ${selectedRequest.status === 'approved' ? 'bg-green-100 text-green-600' :
                    selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                    {selectedRequest.status === 'approved' ? <CheckCircle2 size={32} /> :
                      selectedRequest.status === 'pending' ? <Clock size={32} /> : <XCircle size={32} />}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedRequest.project}</h4>
                    <p className="text-sm text-gray-500">รหัส: {selectedRequest.id} | วันที่: {selectedRequest.date}</p>
                    {selectedRequest.approvalRef && <p className="text-xs text-blue-500 mt-1">Ref: {selectedRequest.approvalRef}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 block">จำนวนเงิน</span>
                    <span className="text-lg font-bold text-blue-600">฿{selectedRequest.amount.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 block">หมวดหมู่</span>
                    <span className="text-lg font-bold text-gray-800">{selectedRequest.category}</span>
                  </div>
                  {selectedRequest.department && (
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-xs text-gray-500 block">หน่วยงาน</span>
                      <span className="text-sm font-bold text-gray-800">{selectedRequest.department}</span>
                    </div>
                  )}
                  {selectedRequest.urgency && (
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-xs text-gray-500 block">ความเร่งด่วน</span>
                      <span className={`text-sm font-bold ${selectedRequest.urgency === 'critical' ? 'text-red-600' : selectedRequest.urgency === 'urgent' ? 'text-orange-500' : 'text-gray-800'}`}>
                        {selectedRequest.urgency === 'critical' ? 'ด่วนที่สุด' : selectedRequest.urgency === 'urgent' ? 'ด่วน' : 'ปกติ'}
                      </span>
                    </div>
                  )}
                </div>

                {selectedRequest.reason && (
                  <div className="mb-4">
                    <h5 className="text-sm font-bold text-gray-700 mb-1">เหตุผลและความจำเป็น</h5>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h5 className="text-sm font-bold text-gray-700 mb-1">หมายเหตุ</h5>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{selectedRequest.notes || '-'}</p>
                </div>

                {/* Expense Items Table */}
                {selectedRequest.expenseItems && selectedRequest.expenseItems.length > 0 && (
                  <div className="mb-4">
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
                            <td className="px-3 py-2 text-right font-extrabold text-blue-600">{selectedRequest.expenseItems.reduce((sum, i) => sum + i.total, 0).toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Status Change Controls */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-bold text-gray-700 mb-3">เปลี่ยนสถานะการอนุมัติ</h5>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, 'approved');
                        setSelectedRequest({ ...selectedRequest, status: 'approved' as const });
                        toast.success('อนุมัติคำขอสำเร็จ');
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 ${selectedRequest.status === 'approved'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                    >
                      <CheckCircle2 size={18} />
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, 'pending');
                        setSelectedRequest({ ...selectedRequest, status: 'pending' as const });
                        toast.success('เปลี่ยนสถานะเป็นรออนุมัติ');
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 ${selectedRequest.status === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                        }`}
                    >
                      <Clock size={18} />
                      รออนุมัติ
                    </button>
                    <button
                      onClick={() => {
                        handleRejectClick(selectedRequest.id);
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 ${selectedRequest.status === 'rejected'
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                    >
                      <XCircle size={18} />
                      ไม่อนุมัติ
                    </button>
                  </div>
                </div>

                {/* Official Memo Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setMemoRequest(selectedRequest);
                      setShowOfficialMemo(true);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
                  >
                    <FileText className="w-5 h-5" />
                    สร้างบันทึกข้อความ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Confirmation Dialog */}
      {
        confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-gray-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in border border-white/20">
              <div className="p-6 text-center">
                <AlertTriangle size={48} className={`mx-auto mb-4 ${confirmDialog.type === 'delete' ? 'text-red-500' : 'text-orange-500'}`} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการทำรายการ</h3>
                <p className="text-gray-500 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="px-4 py-2 border rounded-lg text-gray-600">ยกเลิก</button>
                  <button onClick={handleConfirmAction} className={`px-4 py-2 rounded-lg text-white ${confirmDialog.type === 'delete' ? 'bg-red-600' : 'bg-orange-600'}`}>ยืนยัน</button>
                </div>
              </div>
            </div>
          </div>
        )
      }

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
    </div >
  );
};

export default Budget;


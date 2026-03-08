"use client";

import React, { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Eye,
  FileText,
  Calendar,
  Settings2,
  Trash2,
  Edit3,
  CheckSquare,
  Square,
  MoreVertical,
} from "lucide-react";
import { BudgetRequest } from "@/types";
import { ApprovalModal } from "@/components/features/requests/ApprovalModal";
import { EditRequestModal } from "@/components/features/requests/EditRequestModal";

const BudgetRequestList: React.FC = () => {
  const { requests, categories } = useBudget();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(
    null,
  );
  const [editingRequest, setEditingRequest] = useState<BudgetRequest | null>(
    null,
  );
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { user, deleteRequest } = useBudget();

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การลบจะทำอย่างถาวร")) {
      await deleteRequest(id);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedIds.size} รายการที่เลือก?`)) {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        await deleteRequest(id);
      }
      setSelectedIds(new Set());
    }
  };

  // Filter Logic
  const filteredRequests = requests
    .filter((req) => {
      const matchesSearch =
        req.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || req.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusLabel = (status: string, currentStep?: string) => {
    if (status === "approved") return "อนุมัติแล้ว";
    if (status === "rejected") return "ปฏิเสธ";
    if (status === "pending") {
      switch (currentStep) {
        case "manager":
          return "รอหัวหน้าอนุมัติ";
        case "finance":
          return "รอการเงินตรวจสอบ";
        case "director":
          return "รอผู้อำนวยการอนุมัติ";
        default:
          return "รอการพิจารณา";
      }
    }
    return status;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10";
      case "pending":
        return "bg-primary-50 text-primary-600 border-primary-100 shadow-sm shadow-primary-500/10";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-500/10";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card className="p-4 rounded-[32px] shadow-sm border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, กิจกรรม หรือเลขที่หนังสือ..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select
              className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-primary-500 outline-none min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">ทุกสถานะ</option>
              <option value="pending">รออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>

            <select
              className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-primary-500 outline-none min-w-[160px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

          <div className="flex items-center gap-2 border-l border-gray-100 pl-4 ml-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Management</span>
            <button
              onClick={() => setIsManagementMode(!isManagementMode)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none ${isManagementMode ? "bg-primary-500" : "bg-gray-200"}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isManagementMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        {isManagementMode && filteredRequests.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
              >
                {selectedIds.size === filteredRequests.length ? (
                  <CheckSquare size={16} className="text-primary-500" />
                ) : (
                  <Square size={16} />
                )}
                เลือกทั้งหมด ({selectedIds.size})
              </button>
            </div>
            
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={14} className="mr-1.5" />
                  ลบที่เลือก
                </Button>
                <Button variant="secondary" className="h-8 text-[11px] font-bold">
                  <CheckCircle2 size={14} className="mr-1.5" />
                  อนุมัติ ({selectedIds.size})
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Request List */}
      <div className="space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`group bg-white hover:bg-white border-transparent hover:border-primary-200/50 rounded-[32px] p-6 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${selectedIds.has(req.id) ? "ring-2 ring-primary-500/50 bg-primary-50/10" : ""}`}
              onClick={() => setSelectedRequest(req)}
            >
              {isManagementMode && (
                <div 
                  className="absolute top-4 right-14 z-10 p-2 rounded-xl bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => toggleSelect(req.id, e)}
                >
                  {selectedIds.has(req.id) ? (
                    <CheckSquare size={18} className="text-primary-500" />
                  ) : (
                    <Square size={18} className="text-gray-300" />
                  )}
                </div>
              )}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* 1. Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadgeClass(req.status)}`}
                    >
                      {getStatusLabel(req.status, req.currentStep)}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                      {req.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                    {req.project}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText size={12} className="text-gray-400" />
                      {req.documentNumber || "ไม่มีเลขที่"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {new Date(req.date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>

                <div className="hidden xl:flex items-center gap-4 flex-1 justify-center border-l border-r border-gray-50 px-8">
                  <div className="flex items-center gap-2 w-full max-w-[200px]">
                    {[
                      { id: "manager", label: "หน่วยงาน" },
                      { id: "finance", label: "การเงิน" },
                      { id: "director", label: "ผอ." },
                    ].map((step, idx) => {
                      const steps = ["manager", "finance", "director"];
                      const currentIdx = steps.indexOf(req.currentStep || "manager");
                      const isDone = idx < currentIdx || req.status === "approved";
                      const isCurrent = idx === currentIdx && req.status === "pending";
                      const isRejected = req.status === "rejected" && idx === currentIdx;

                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className={`h-2 w-full rounded-full transition-all duration-500
                              ${isDone ? "bg-emerald-400" : isRejected ? "bg-red-400" : isCurrent ? "bg-primary-500 shadow-[0_0_12px_rgba(0,163,228,0.5)]" : "bg-gray-100"}`}
                          />
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${isCurrent ? "text-primary-600" : "text-gray-400"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Financial Info */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 min-w-[140px]">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">งบประมาณ</p>
                    <p className="text-lg font-black text-gray-900 leading-none">
                      ฿{req.amount.toLocaleString()}
                    </p>
                  </div>
                  
                  {isManagementMode ? (
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRequest(req);
                        }}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                        onClick={(e) => handleDelete(req.id, e)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-300">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Card className="p-12 text-center rounded-[32px] border-dashed border-2 border-gray-100 bg-gray-50/30">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              ไม่พบคำขอที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-sm text-gray-400">
              ลองเปลี่ยนเงื่อนไขการค้นหาหรือกลุ่มข้อมูล
            </p>
          </Card>
        )}
      </div>

      {/* Edit Request Modal */}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          isOpen={!!editingRequest}
          onClose={() => setEditingRequest(null)}
        />
      )}

      {/* Approval Modal */}
      {selectedRequest && (
        <ApprovalModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default BudgetRequestList;

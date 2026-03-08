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
} from "lucide-react";
import { BudgetRequest } from "@/types";
import { ApprovalModal } from "@/components/features/requests/ApprovalModal";

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
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card className="p-4 rounded-[20px] shadow-sm border-gray-100">
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
        </div>
      </Card>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <Card
              key={req.id}
              interactive
              className="p-5 rounded-[24px] border-gray-100/60 hover:border-primary-200 group transition-all"
              onClick={() => setSelectedRequest(req)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary-50 transition-colors shrink-0">
                    <FileText
                      className="text-gray-400 group-hover:text-primary-600"
                      size={24}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(req.status)}`}
                      >
                        {getStatusLabel(req.status, req.currentStep)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
                        {req.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {req.project}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {req.activity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 pl-14 md:pl-0">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-gray-900">
                      ฿{req.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5 justify-end text-[10px] text-gray-400 font-medium">
                      <Calendar size={12} />
                      {new Date(req.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-gray-50 group-hover:bg-primary-500 group-hover:text-white transition-all hidden md:flex">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>

              {/* Approval Path Indicator */}
              {req.status === "pending" && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center gap-4">
                  <div className="flex -space-x-1.5">
                    {["manager", "finance", "director"].map((step, idx) => {
                      const steps = ["manager", "finance", "director"];
                      const currentIdx = steps.indexOf(
                        req.currentStep || "manager",
                      );
                      const isDone = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          title={step.charAt(0).toUpperCase() + step.slice(1)}
                          className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold
                                                        ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-gray-200 text-gray-400"}`}
                        >
                          {isDone ? <CheckCircle2 size={10} /> : idx + 1}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    ความก้าวหน้าการตรวจสอบ
                  </p>
                </div>
              )}
            </Card>
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

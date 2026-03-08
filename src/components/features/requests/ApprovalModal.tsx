import React, { useState } from "react";
import {
  Check,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";
import { BudgetRequest, ApprovalLog, Category } from "@/types";
import { useBudget } from "@/context/BudgetContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BudgetRequest;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const { approveRequest, rejectRequest, user, categories, getApprovalLogs } =
    useBudget();
  const [action, setAction] = useState<"view" | "reject">("view");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = React.useState<ApprovalLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
          const data = await getApprovalLogs(request.id);
          setLogs(data);
        } catch (error) {
          console.error("Error fetching logs:", error);
        } finally {
          setIsLoadingLogs(false);
        }
      };
      fetchLogs();
    } else {
      setAction("view");
      setRejectionReason("");
    }
  }, [isOpen, request.id]);

  const currentStep = request.currentStep || "manager";

  // Role-based logic
  const canApprove = React.useMemo(() => {
    if (!user) return false;
    if (user.role === "admin") return true;

    switch (currentStep) {
      case "manager":
        return user.role === "approver" || user.role === "manager";
      case "finance":
        return user.role === "finance";
      case "director":
        return false; // Only admin can do final director step for now
      default:
        return false;
    }
  }, [user, currentStep]);

  const category = categories.find(
    (c: Category) => c.name === request.category,
  );
  const isOverBudget =
    category && (category.used || 0) + request.amount > category.allocated;

  const handleApprove = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await approveRequest(request.id, user.id);
      onClose();
    } catch (error) {
      alert("Failed to approve request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!user) return;
    if (!rejectionReason.trim()) return alert("Please provide a reason");

    setIsSubmitting(true);
    try {
      await rejectRequest(request.id, user.id, rejectionReason);
      onClose();
    } catch (error) {
      alert("Failed to reject request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when closing/opening usually happens by unmounting, but good to be safe if reused
  // effectively this component is conditionally rendered in parent so it remounts.

  const footerContent = (
    <div className="flex flex-col w-full gap-3">
      {!canApprove && action === "view" && (
        <div className="w-full p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-medium mb-1 flex items-center gap-2">
          <Shield size={14} />
          ขณะนี้อยู่ในขั้นตอน "
          {currentStep === "manager"
            ? "หัวหน้าหน่วยงาน"
            : currentStep === "finance"
              ? "ฝ่ายการเงิน"
              : "ผู้อำนวยการ"}
          " (คุณไม่มีสิทธิ์อนุมัติในขั้นตอนนี้)
        </div>
      )}
      <div className="flex gap-3 w-full">
        {action === "view" ? (
          <>
            <Button
              variant="danger"
              className="flex-1 bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 hover:text-red-700 shadow-sm"
              onClick={() => setAction("reject")}
              disabled={isSubmitting || !canApprove}
            >
              ไม่อนุมัติ
            </Button>
            <Button
              variant="primary"
              className="flex-[2] shadow-lg shadow-primary-500/20"
              onClick={handleApprove}
              disabled={isSubmitting || !canApprove}
            >
              {isSubmitting ? "กำลังประมวลผล..." : "อนุมัติคำขอ"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setAction("view")}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="danger"
              className="flex-[2] bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการไม่อนุมัติ"}
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`อนุมัติคำขอ: ${request.id.slice(0, 8)}`}
      width="max-w-lg"
      footer={footerContent}
    >
      <div className="space-y-6">
        {/* Amount Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border border-gray-200">
          <div className="text-sm text-gray-500 font-medium mb-1">
            จำนวนเงินรวม
          </div>
          <div className="text-4xl font-extrabold text-gray-900">
            ฿{request.amount.toLocaleString()}
          </div>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isOverBudget ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}
          >
            {isOverBudget ? <AlertTriangle size={12} /> : <Check size={12} />}
            {isOverBudget ? "เกินงบที่จัดสรร" : "ภายในงบที่จัดสรร"}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              ผู้ขอ
            </label>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <User size={16} />
              </div>
              {request.requester}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              วันที่
            </label>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Calendar size={18} className="text-gray-400" />
              {new Date(request.date).toLocaleDateString("th-TH")}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            โครงการ / กิจกรรม
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 font-medium">
            {request.project}
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            เอกสารแนบ (Attachments)
          </label>
          {request.attachments && request.attachments.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {request.attachments.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-400 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-gray-700 truncate">
                      เอกสารแนบที่ {idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">
                      คลิกเพื่อเปิดดูเป็นหน้าต่างใหม่
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-100 rounded-xl text-center text-gray-400 text-xs">
              คำขอนี้ไม่มีเอกสารแนบ
            </div>
          )}
        </div>

        {/* Approval Progress */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} /> สถานะการอนุมัติ (Approval Status)
          </label>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center p-3 bg-gray-50/50 border-b border-gray-100">
              {[
                { id: "manager", label: "หัวหน้าหน่วย" },
                { id: "finance", label: "การเงิน" },
                { id: "director", label: "ผู้อำนวยการ" },
              ].map((step, idx, arr) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1
                                            ${
                                              logs.some(
                                                (l: ApprovalLog) =>
                                                  l.stage === step.id &&
                                                  l.action === "approve",
                                              ) || request.status === "approved"
                                                ? "bg-green-500 text-white"
                                                : currentStep === step.id &&
                                                    request.status !==
                                                      "rejected"
                                                  ? "bg-primary-500 text-white animate-pulse"
                                                  : "bg-gray-200 text-gray-400"
                                            }`}
                    >
                      {logs.some(
                        (l: ApprovalLog) =>
                          l.stage === step.id && l.action === "approve",
                      ) || request.status === "approved"
                        ? idx + 1
                        : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${currentStep === step.id ? "text-primary-600" : "text-gray-400"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <ArrowRight size={12} className="text-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Logs List */}
            <div className="p-4 space-y-4 max-h-[200px] overflow-y-auto">
              {isLoadingLogs ? (
                <div className="text-center py-4 text-gray-400 text-xs italic">
                  กำลังโหลดประวัติ...
                </div>
              ) : logs.length > 0 ? (
                logs.map((log: ApprovalLog) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${log.action === "approve" ? "bg-green-500" : "bg-red-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-gray-900">
                          {log.action === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}{" "}
                          โดย {log.user?.name || "ผู้ใช้"}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {new Date(log.createdAt).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ขั้นตอน:{" "}
                        {log.stage === "manager"
                          ? "หัวหน้าหน่วยงาน"
                          : log.stage === "finance"
                            ? "การเงิน"
                            : "ผู้อำนวยการ"}
                      </p>
                      {log.comment && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded-lg border border-red-100">
                          {log.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-xs italic">
                  ยังไม่มีประวัติการพิจารณา
                </div>
              )}
            </div>
          </div>
        </div>

        {action === "reject" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-red-500 uppercase tracking-wider">
              เหตุผลที่ไม่อนุมัติ
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-red-200 bg-red-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-red-900 placeholder-red-300 min-h-[100px]"
              placeholder="โปรดระบุเหตุผลที่ไม่อนุมัติ..."
              autoFocus
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { useBudget } from "@/context/BudgetContext";
import { BudgetRequest } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditRequestModalProps {
  request: BudgetRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRequestModal({ request, isOpen, onClose }: EditRequestModalProps) {
  const { updateRequest, categories } = useBudget();
  const [formData, setFormData] = useState<Partial<BudgetRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setFormData({
        project: request.project,
        amount: request.amount,
        category: request.category,
        notes: request.notes,
        documentNumber: request.documentNumber,
      });
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRequest(request.id, formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                แก้ไขประกาศคำขอ
              </h2>
              <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-wider">
                Request Management
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">ชื่อโครงการ</label>
              <Input
                value={formData.project || ""}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="กรอกชื่อโครงการ..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">งบประมาณ (บาท)</label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">หมวดหมู่</label>
                <select
                  className="w-full h-14 px-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">หมายเหตุ</label>
              <textarea
                className="w-full min-h-[100px] p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="รายละเอียดเพิ่มเติม..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-14 rounded-2xl font-bold"
                onClick={onClose}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-14 rounded-2xl font-bold shadow-lg shadow-primary-500/25"
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึก..." : (
                  <>
                    <Save size={18} className="mr-2" />
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

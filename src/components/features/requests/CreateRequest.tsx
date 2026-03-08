"use client";
import React, { useState, useEffect } from "react";
import { useBudget } from "@/context/BudgetContext";
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Wallet,
  Paperclip,
  Check,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  SubActivity,
  BudgetRequest,
  ExpenseLineItem,
  Category,
} from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";

const STEPS = [
  { id: 1, title: "ข้อมูลพื้นฐาน", icon: FileText },
  { id: 2, title: "แหล่งงบประมาณ", icon: Wallet },
  { id: 3, title: "รายการค่าใช้จ่าย", icon: Calculator },
  { id: 4, title: "ไฟล์แนบ & ส่งตรวจ", icon: CheckCircle2 },
];

const CreateRequest: React.FC = () => {
  const router = useRouter();
  const { addRequest, categories, subActivities, user, uploadAttachment } =
    useBudget();

  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<
    Partial<BudgetRequest> & {
      expenseItems: ExpenseLineItem[];
    }
  >({
    project: "",
    documentNumber: "",
    category: "",
    activity: "",
    subActivityId: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    reason: "",
    urgency: "normal",
    startDate: "",
    endDate: "",
    expenseItems: [],
  });

  const [availableSubActivities, setAvailableSubActivities] = useState<SubActivity[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null);

  // Derived calculations
  const totalAmount = formData.expenseItems.reduce((sum, item) => sum + item.total, 0);
  const remainingBudget = selectedCategoryData 
    ? selectedCategoryData.allocated - (selectedCategoryData.used || 0)
    : 0;
  const isOverBudget = totalAmount > remainingBudget;

  useEffect(() => {
    if (formData.category) {
      const cat = categories.find(c => c.name === formData.category);
      setSelectedCategoryData(cat || null);
      if (cat) {
        setAvailableSubActivities(subActivities.filter(s => s.categoryId === cat.id));
      }
    }
  }, [formData.category, categories, subActivities]);

  const addExpenseItem = () => {
    const newItem: ExpenseLineItem = {
      id: `temp-${Date.now()}`,
      category: formData.category || "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "รายการ",
      total: 0,
    };
    setFormData(prev => ({
      ...prev,
      expenseItems: [...prev.expenseItems, newItem]
    }));
  };

  const updateExpenseItem = (id: string, field: keyof ExpenseLineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      expenseItems: prev.expenseItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0);
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const handleSubmit = async () => {
    if (isOverBudget) {
      toast.error("งบประมาณไม่เพียงพอ กรุณาปรับลดรายการค่าใช้จ่าย");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadAttachment(file);
        uploadedUrls.push(url);
      }

      await addRequest({
        ...formData,
        amount: totalAmount,
        status: "pending",
        requester: user?.name || "Unknown",
        requesterId: user?.id,
        department: user?.department || "-",
        attachments: uploadedUrls,
      } as BudgetRequest);

      toast.success("ส่งคำขอสำเร็จ");
      router.push("/requests");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งคำขอ");
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.project) return toast.error("กรุณาระบุชื่อโครงการ");
    if (currentStep === 2 && !formData.category) return toast.error("กรุณาเลือกหมวดงบประมาณ");
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">ชื่อโครงการ/กิจกรรม <span className="text-red-500">*</span></label>
                <Input 
                  placeholder="เช่น โครงการพัฒนาทักษะดิจิทัล..."
                  value={formData.project || ""}
                  onChange={e => setFormData({ ...formData, project: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">เลขที่หนังสืออ้างอิง</label>
                <Input 
                  placeholder="เช่น มวล 123/2567"
                  value={formData.documentNumber || ""}
                  onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">วันที่เริ่ม</label>
                  <Input type="date" value={formData.startDate || ""} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">วันที่สิ้นสุด</label>
                  <Input type="date" value={formData.endDate || ""} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">วัตถุประสงค์โดยย่อ</label>
                <textarea 
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all text-sm min-h-[120px]"
                  placeholder="ระบุเหตุผลความจำเป็น..."
                  value={formData.reason || ""}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 font-mono tracking-tighter uppercase opacity-50">หมวดงบประมาณ</label>
                <Select 
                  options={categories.map(c => ({ value: c.name, label: c.name }))}
                  value={formData.category || ""}
                  onChange={val => setFormData({ ...formData, category: val || "", activity: "" })}
                  placeholder="เลือกหมวดสอดคล้อง"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 font-mono tracking-tighter uppercase opacity-50">กิจกรรมภายใต้หมวด (ถ้ามี)</label>
                <Select 
                  options={availableSubActivities.map(s => ({ value: s.name, label: s.name }))}
                  value={formData.activity || ""}
                  onChange={val => {
                    const sub = availableSubActivities.find(s => s.name === val);
                    setFormData({ ...formData, activity: val || "", subActivityId: sub?.id || "" });
                  }}
                  placeholder="เลือกกิจกรรมย่อย"
                />
              </div>

              {selectedCategoryData && (
                <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-xl overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">สถานะงบประมาณหมวด</span>
                      <Wallet size={16} className="text-primary-400" />
                    </div>
                    <div className="text-3xl font-black mb-1">฿{remainingBudget.toLocaleString()}</div>
                    <div className="text-[10px] opacity-50 font-bold uppercase">คงเหลือปัจจุบัน</div>
                    
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span>สัดส่วนที่ขอใช้คราวนี้</span>
                        <span>{((totalAmount / remainingBudget) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isOverBudget ? "bg-red-500" : "bg-gradient-to-r from-sky-400 to-primary-400"}`}
                          style={{ width: `${Math.min((totalAmount / remainingBudget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all" />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-700">รายการประมาณการค่าใช้จ่าย</h4>
              <Button variant="outline" size="sm" onClick={addExpenseItem} className="gap-1.5 rounded-full border-gray-200">
                <Plus size={14} /> เพิ่มรายการ
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.expenseItems.map((item, idx) => (
                <div key={item.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group hover:bg-white hover:border-primary-100 transition-all">
                  <div className="flex gap-4">
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                        {idx + 1}
                      </div>
                      <button onClick={() => setFormData(p => ({ ...p, expenseItems: p.expenseItems.filter(i => i.id !== item.id)}))} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-3">
                      <div className="col-span-12 md:col-span-6">
                        <Input 
                          placeholder="รายละเอียดสินค้า/บริการ"
                          value={item.description}
                          onChange={e => updateExpenseItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input 
                          type="number"
                          placeholder="จำนวน"
                          value={item.quantity}
                          onChange={e => updateExpenseItem(item.id, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input 
                          placeholder="หน่วย"
                          value={item.unit}
                          onChange={e => updateExpenseItem(item.id, "unit", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input 
                          type="number"
                          placeholder="ราคา/หน่วย"
                          value={item.unitPrice}
                          onChange={e => updateExpenseItem(item.id, "unitPrice", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ราคาประเมินรวม</span>
                    <span className="text-sm font-black text-gray-900">฿{item.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {formData.expenseItems.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-sm">
                  ใช้ปุ่มเพิ่มรายการเพื่อระบุค่าใช้จ่าย
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <Card className="p-8 border-dashed border-2 border-gray-100 bg-gray-50/20 text-center flex flex-col items-center gap-4 rounded-[32px]">
              <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-primary-500">
                <Paperclip size={32} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">เอกสารประกอบการขออนุมัติ</h4>
                <p className="text-xs text-gray-400 mt-1">อัปโหลดไฟล์บันทึกข้อความ หรือรายละเอียดโครงการ (PDF/Image)</p>
              </div>
              <input 
                type="file" 
                id="files" 
                multiple 
                className="hidden" 
                onChange={e => setSelectedFiles(Array.from(e.target.files || []))}
              />
              <label htmlFor="files" className="cursor-pointer px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-all">
                เลือกไฟล์
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedFiles.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-lg border border-primary-100 flex items-center gap-1.5">
                    {f.name.slice(0, 15)}...
                    <Trash2 size={10} className="cursor-pointer hover:text-red-500" onClick={() => setSelectedFiles(p => p.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>
            </Card>

            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">ตรวจสอบความถูกต้องเรียบร้อย</h4>
                  <p className="text-xs text-emerald-700/70 mt-1 leading-relaxed">
                    ข้อมูลทั้งหมดได้รับการตรวจสอบยอดงบประมาณคงเหลือแล้ว 
                    เมื่อบันทึกข้อมูลแล้วรายการจะถูกส่งไปที่ฝ่ายการเงินเพื่อตรวจสอบลำดับถัดไป
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Steps & Form */}
        <div className="flex-1 min-w-0">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">ขอใช้งบประมาณ</h1>
            <p className="text-gray-500 mt-2 text-sm">กรอกข้อมูลรายละเอียดเพื่อนำส่งพิจารณาอนุมัติตามขั้นตอน</p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 min-w-[100px]">
                    <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500
                      ${isActive ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl shadow-primary-500/30 ring-4 ring-primary-500/10" : isDone ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {isDone ? <Check size={24} /> : <Icon size={24} />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-primary-600" : "text-gray-400"}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] min-w-[20px] bg-gray-100 mx-4 -mt-6" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm relative min-h-[400px]">
            {renderStepContent()}

            {/* Form Footer Buttons */}
            <div className="mt-12 pt-10 border-t border-gray-50 flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={() => currentStep === 1 ? router.back() : setCurrentStep(p => p - 1)}
                className="gap-2 text-gray-400 hover:text-gray-900"
              >
                <ChevronLeft size={18} />
                {currentStep === 1 ? "ยกเลิก" : "ย้อนกลับ"}
              </Button>

              {currentStep < 4 ? (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  className="gap-2 px-8 shadow-xl shadow-primary-500/10 rounded-2xl h-12"
                >
                  ถัดไป
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleSubmit} 
                  disabled={isUploading}
                  className="gap-2 px-10 shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-indigo-600 border-none rounded-2xl h-12"
                >
                  {isUploading ? "กำลังส่งคำขอ..." : "ส่งขออนุมัติ"}
                  <Save size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Summary Sticky Panel */}
        <div className="lg:w-[380px] shrink-0">
          <div className="sticky top-6 space-y-6">
            <Card className="p-8 border-none rounded-[40px] bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 shadow-2xl text-white overflow-hidden relative">
              <TrendingUp className="absolute -top-4 -right-4 w-48 h-48 text-primary-400/10 rotate-12 blur-sm" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8 opacity-60">
                  <Calculator size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">สรุปรายการนำเสนอ</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-40 mb-1">หมวดที่ใช้</div>
                    <div className="text-sm font-bold line-clamp-1">{formData.category || "รอกำหนด"}</div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-40 mb-1">ยอดรวมประมาณการ</div>
                    <div className="text-4xl font-black">฿{totalAmount.toLocaleString()}</div>
                    {isOverBudget && (
                      <div className="mt-2 text-[10px] font-bold text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> งบประมาณเกินกำหนด
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase opacity-40 mb-4">
                      <span>ความเร่งด่วน</span>
                      <span>{(["ปกติ", "ด่วน", "ด่วนที่สุด"])[(["normal", "urgent", "critical"]).indexOf(formData.urgency as any)]}</span>
                    </div>
                    <div className="flex gap-2">
                       {(["normal", "urgent", "critical"] as const).map((level) => (
                          <div 
                            key={level}
                            onClick={() => setFormData(p => ({ ...p, urgency: level }))}
                            className={`flex-1 h-1 rounded-full cursor-pointer transition-all 
                              ${formData.urgency === level 
                                ? level === "critical" ? "bg-red-500" : level === "urgent" ? "bg-amber-500" : "bg-primary-500" 
                                : "bg-white/10"}`}
                          />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">รายการย่อ</h4>
              <div className="space-y-4">
                {formData.expenseItems.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span className="text-xs text-gray-600 line-clamp-1 flex-1 pr-4">{item.description || "ยังไม่มีรายละเอียด"}</span>
                    <span className="text-xs font-bold text-gray-900 shrink-0">฿{item.total.toLocaleString()}</span>
                  </div>
                ))}
                {formData.expenseItems.length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-[10px] font-bold text-primary-500">และอีก {formData.expenseItems.length - 3} รายการ...</span>
                  </div>
                )}
                {formData.expenseItems.length === 0 && (
                  <div className="text-center py-4 text-[10px] text-gray-300 italic font-medium">ยังไม่มีรายการค่าใช้จ่าย</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;

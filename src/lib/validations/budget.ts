import { z } from "zod";

export const ExpenseLineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  quantity: z.number().positive("ต้องมากกว่า 0"),
  unit: z.string().min(1, "ระบุหน่วย"),
  unitPrice: z.number().positive("ต้องมากกว่า 0"),
  total: z.number(),
  category: z.string().optional(),
});

export const BudgetRequestSchema = z.object({
  project: z.string().min(3, "ชื่อโครงการต้องมีความยาวอย่างน้อย 3 ตัวอักษร"),
  documentNumber: z.string().optional(),
  category: z.string().min(1, "กรุณาเลือกหมวดงบประมาณ"),
  activity: z.string().optional(),
  subActivityId: z.string().min(1, "กรุณาเลือกแหล่งงบประมาณ"),
  startDate: z.string().min(1, "กรุณาระบุวันที่เริ่ม"),
  endDate: z.string().min(1, "กรุณาระบุวันที่สิ้นสุด"),
  amount: z.number().positive("ยอดรวมต้องมากกว่า 0"),
  reason: z.string().optional(),
  departmentId: z.string().optional(),
  expenseItems: z.array(ExpenseLineItemSchema).min(1, "ต้องมีรายการค่าใช้จ่ายอย่างน้อย 1 รายการ"),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม",
  path: ["endDate"],
});

export type BudgetRequestInput = z.infer<typeof BudgetRequestSchema>;

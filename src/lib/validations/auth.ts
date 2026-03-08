import { z } from "zod";

export const PasswordSchema = z.string()
  .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
  .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว")
  .regex(/[a-z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว")
  .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลข (0-9) อย่างน้อย 1 ตัว")
  .regex(/[^A-Za-z0-9]/, "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
  newPassword: PasswordSchema,
  confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านใหม่ไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

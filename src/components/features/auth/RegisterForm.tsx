"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({ email, password, fullName });
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(`เกิดข้อผิดพลาด: ${err.message || "กรุณาลองใหม่อีกครั้ง"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8" style={{ background: "var(--surface-page)" }}>
        <div className="w-full max-w-[420px] text-center p-10 rounded-3xl bg-white shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>สมัครสมาชิกสำเร็จ!</h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            ลงทะเบียนบัญชีของคุณเรียบร้อยแล้ว ระบบกำลังนำคุณไปที่หน้าเข้าสู่ระบบ...
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* ── LEFT: Deep Blue Branding Panel (Same as Login) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0A3A5C 0%, #0A4A80 30%, #0060A8 65%, #1A7AC8 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-[60%] h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(100,180,255,0.10), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[70%] h-[50%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(0,60,120,0.35), transparent)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-14 py-12 justify-center">
          <div className="mb-10 self-start">
            <span
              className="inline-flex items-center px-5 py-2 rounded-full text-[12px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(4px)",
                letterSpacing: "0.02em",
              }}
            >
              ระบบบริหารจัดการงบประมาณองค์กร
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="font-extrabold text-white tracking-tight"
              style={{ fontSize: "60px", lineHeight: 1.08 }}
            >
              Start Your
            </h1>
            <div style={{ marginTop: "-2px" }}>
              <span
                className="font-extrabold tracking-tight block"
                style={{
                  fontSize: "60px",
                  lineHeight: 1.08,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.50) 45%, rgba(255,255,255,0.14) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Journey
              </span>
            </div>
          </div>

          <p
            className="mb-10 text-[15px] leading-relaxed max-w-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            เข้าร่วมเป็นส่วนหนึ่งของระบบบริหารงบประมาณอัจฉริยะ เพื่อความรวดเร็วและแม่นยำในการทำงาน
          </p>

          <div className="flex gap-4">
            {[
              { label: "Join", sub: "Global Network" },
              { label: "Access", sub: "Pro Features" },
            ].map((f) => (
              <div
                key={f.label}
                className="px-5 py-4 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  minWidth: "130px",
                }}
              >
                <p className="text-[22px] font-extrabold text-white leading-none">
                  {f.label}
                </p>
                <p
                  className="text-[12px] mt-1.5 font-medium"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  {f.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-14 pb-8">
          <p
            className="text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Secured by DCC Platform • v2.0.0
          </p>
        </div>
      </div>

      {/* ── RIGHT: Register Form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-10"
        style={{ background: "var(--surface-page)" }}
      >
        <div className="w-full max-w-[420px]">
          <div className="mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary-50)" }}
            >
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: "var(--color-primary-600)" }}
              />
            </div>
          </div>

          <div className="mb-7">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              สร้างบัญชีใหม่
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ
            </p>
          </div>

          {error && (
            <div
              className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "var(--accent-red-light)",
                border: "1px solid #FECACA",
              }}
            >
              <AlertCircle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--accent-red)" }}
              />
              <span className="font-medium" style={{ color: "#B91C1C" }}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className="w-[18px] h-[18px]"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px" }}
                  placeholder="สถาพร ใจดี"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                อีเมล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className="w-[18px] h-[18px]"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px" }}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className="w-[18px] h-[18px]"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px" }}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className="w-[18px] h-[18px]"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px" }}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  สมัครสมาชิก <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
              <Link
                href="/login"
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: "var(--color-primary-600)" }}
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>

          <p
            className="mt-10 text-center text-[11px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            © 2026 DCC Motor Ltd. System v2.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

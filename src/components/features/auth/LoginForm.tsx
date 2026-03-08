"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const success = await login(username, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err: any) {
      setError(`เกิดข้อผิดพลาด: ${err.message || "กรุณาลองใหม่อีกครั้ง"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* ── LEFT: Deep Blue Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0A3A5C 0%, #0A4A80 30%, #0060A8 65%, #1A7AC8 100%)",
        }}
      >
        {/* Subtle radial glow top-right */}
        <div
          className="absolute top-0 right-0 w-[60%] h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(100,180,255,0.10), transparent)",
          }}
        />
        {/* Subtle radial glow bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-[70%] h-[50%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(0,60,120,0.35), transparent)",
          }}
        />

        {/* Content — vertically centered */}
        <div className="relative z-10 flex flex-col h-full px-14 py-12 justify-center">
          {/* Top badge */}
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

          {/* Main title */}
          <div className="mb-8">
            <h1
              className="font-extrabold text-white tracking-tight"
              style={{ fontSize: "60px", lineHeight: 1.08 }}
            >
              Smart Budget
            </h1>
            {/* "Management" — large watermark / semi-transparent text */}
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
                Management
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className="mb-10 text-[15px] leading-relaxed max-w-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            ยกระดับการบริหารงบประมาณด้วยความโปร่งใส รวดเร็ว และ แม่นยำ ด้วยระบบ
            Digital Trust Platform ที่ทันสมัยที่สุด
          </p>

          {/* Feature pills */}
          <div className="flex gap-4">
            {[
              { label: "100%", sub: "Data Security" },
              { label: "Real-time", sub: "Budget Tracking" },
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

        {/* Bottom copyright */}
        <div className="relative z-10 px-14 pb-8">
          <p
            className="text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Secured by DCC Platform • v2.0.0
          </p>
        </div>
      </div>

      {/* ── RIGHT: Login Form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-10"
        style={{ background: "var(--surface-page)" }}
      >
        <div className="w-full max-w-[420px]">
          {/* Shield icon */}
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

          {/* Header */}
          <div className="mb-7">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              ยินดีต้อนรับกลับมา!
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              เข้าสู่ระบบเพื่อดำเนินการบริหารงบประมาณ
            </p>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                ชื่อผู้ใช้งาน
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px" }}
                  placeholder="ระบุชื่อผู้ใช้งาน"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
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
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dcc-input"
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {showPass ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border-default)" }}
              />
              <span
                className="text-[11px] font-medium tracking-widest uppercase"
                style={{ color: "var(--text-tertiary)" }}
              >
                OR CONTINUE WITH
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border-default)" }}
              />
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    setIsLoading(true);
                    try {
                      const success = await loginWithGoogle(
                        credentialResponse.credential,
                      );
                      if (success) router.push("/dashboard");
                    } catch {
                      setError("Google Sign-In Error");
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                onError={() => setError("Google Sign-In Failed")}
                shape="pill"
                theme="outline"
                size="large"
                text="signin_with"
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              ไม่มีบัญชีผู้ใช้งาน?{" "}
              <span
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: "var(--color-primary-600)" }}
              >
                ติดต่อผู้ดูแลระบบ
              </span>
            </p>
            <p
              className="text-sm font-medium cursor-pointer hover:underline"
              style={{ color: "var(--color-primary-600)" }}
            >
              ลืมรหัสผ่าน?
            </p>
          </div>

          {/* Copyright */}
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

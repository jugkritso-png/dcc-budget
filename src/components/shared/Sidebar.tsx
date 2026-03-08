import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  CheckCircle,
  Settings,
  BarChart3,
  LayoutGrid,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";

export function Sidebar() {
  const { settings, hasPermission } = useBudget();
  const { logout } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  const pathname = usePathname();

  const navItems = [
    { id: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    ...(hasPermission("view_budget")
      ? [{ id: "/budget", label: "จัดการงบประมาณ", icon: Wallet }]
      : []),
    { id: "/requests", label: "รายการคำขอ", icon: CheckCircle },
    { id: "/request", label: "บันทึกขอใช้งบ", icon: FileText },
    { id: "/report", label: "รายงานผล", icon: BarChart3 },
    ...(hasPermission("view_analytics")
      ? [{ id: "/analytics", label: "วิเคราะห์ & สถิติ", icon: BarChart3 }]
      : []),
    { id: "/settings", label: "ตั้งค่าระบบ", icon: Settings },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen fixed top-0 left-0 z-40 overflow-hidden"
      style={{
        background: "var(--surface-card)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* ── Header / Logo ── */}
      <div className="relative h-20 flex items-center px-5 border-b border-transparent">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-[18px] flex-shrink-0 flex items-center justify-center shadow-xl shadow-primary-500/30"
            style={{ background: "linear-gradient(135deg, #00A3E4, #0077C8)" }}
          >
            <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p
                  className="text-[15px] font-black leading-tight tracking-tight"
                  style={{ color: "#003D70" }}
                >
                  {settings?.orgName || "DCC Budget"}
                </p>
                <p
                  className="text-[10px] font-black tracking-[0.1em] uppercase opacity-50"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Budget Manager
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Toggle Button ── */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-0 top-24 transform translate-x-1/2 z-[100] w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 group group-hover:bg-primary-50"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--surface-card)",
        }}
      >
        <div
          className="transition-transform duration-300"
          style={{
            transform: isSidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
        </div>
      </button>

      {/* Section label */}
      <div
        className={`px-6 mb-2 mt-6 h-4 transition-opacity duration-200 ${isSidebarCollapsed ? "opacity-0" : "opacity-100"}`}
      >
        <p
          className="text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap"
          style={{ color: "var(--text-tertiary)" }}
        >
          {isSidebarCollapsed ? "" : "Main Navigation"}
        </p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar pt-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.id ||
            (item.id !== "/" && pathname?.startsWith(item.id));
          return (
            <Link
              key={item.id}
              href={item.id}
              title={isSidebarCollapsed ? item.label : ""}
              className={`flex items-center h-14 rounded-2xl transition-all duration-300 group relative ${
                isActive
                  ? "bg-gradient-to-br from-[#00A3E4] to-[#0077C8] text-white shadow-lg shadow-primary-600/30"
                  : "text-gray-500 hover:bg-primary-50/50 hover:text-primary-700 font-medium"
              }`}
              style={{ padding: isSidebarCollapsed ? "0 14px" : "0 14px" }}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isSidebarCollapsed ? "" : "mr-3.5"} group-hover:scale-110 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-primary-600"
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <AnimatePresence mode="wait">
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="text-[14px] font-bold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && isSidebarCollapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="px-3 pb-6 pt-4 mt-auto">
        <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
        <button
          onClick={logout}
          title={isSidebarCollapsed ? "ออกจากระบบ" : ""}
          className="w-full h-11 flex items-center rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 group"
          style={{ padding: isSidebarCollapsed ? "0 14px" : "0 14px" }}
        >
          <LogOut
            className={`w-5 h-5 flex-shrink-0 ${isSidebarCollapsed ? "" : "mr-3.5"}`}
            strokeWidth={1.8}
          />
          {!isSidebarCollapsed && (
            <span className="text-[13px] font-medium whitespace-nowrap">
              ออกจากระบบ
            </span>
          )}
        </button>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 px-3"
          >
            <p
              className="text-[10px] opacity-40 font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              v2.1.0 • DCC Platform
            </p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}

"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import { usePathname } from "next/navigation";
import { NotificationDropdown } from "./NotificationDropdown";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "ภาพรวม",
  "/budget": "งบประมาณ",
  "/request": "ขอใช้งบประมาณ",
  "/report": "รายงานผล",
  "/management": "การจัดการ",
  "/analytics": "วิเคราะห์",
  "/settings": "ตั้งค่า",
};

export function Header() {
  const { user, toggleSidebar } = useBudget();
  const pathname = usePathname();

  const pageTitle =
    Object.entries(PAGE_TITLES).find(
      ([key]) => key !== "/" && pathname?.startsWith(key),
    )?.[1] ?? "หน้าหลัก";

  const avatarContent = () => {
    const cleanAvatar = user?.avatar ? String(user.avatar).trim() : "";
    const isImage =
      cleanAvatar.startsWith("http") || cleanAvatar.startsWith("data:");
    if (isImage)
      return (
        <img
          src={cleanAvatar}
          alt={user?.name}
          className="w-full h-full object-cover rounded-full"
        />
      );
    return cleanAvatar?.length <= 3
      ? cleanAvatar
      : user?.name?.substring(0, 2).toUpperCase() || "US";
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-30">
      {/* Left: Sidebar Toggle & Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 lg:hidden flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block ml-4">
          <h2 className="text-[28px] font-black tracking-tighter text-[#003D70] leading-none">
            {pageTitle}
          </h2>
          <p className="text-[11px] text-gray-400 font-black mt-2 uppercase tracking-[0.15em]">
            Welcome back, <span className="text-primary-500">{user?.name}</span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* User */}
        <button className="flex items-center gap-3 hover:bg-white p-2 pr-5 rounded-[20px] transition-all border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 group">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-primary-400 to-primary-600 text-white text-base font-black flex items-center justify-center shadow-lg shadow-primary-500/20 border-2 border-white overflow-hidden transition-transform group-hover:scale-105">
            {avatarContent()}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[14px] font-bold text-gray-900 leading-none">
              {user?.name}
            </p>
            <p className="text-[12px] text-primary-600 font-semibold mt-1">
              {user?.role === "admin" ? "Administrator" : "Staff"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

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
        <div className="hidden lg:block">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {pageTitle}
          </h2>
          <p className="text-[13px] text-gray-500 font-medium mt-0.5">
            ยินดีต้อนรับกลับมา,{" "}
            <span className="text-primary-600 font-semibold">{user?.name}</span>
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
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white overflow-hidden">
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

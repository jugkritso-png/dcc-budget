"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  Trash2,
  ExternalLink,
  Calendar,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";

export function NotificationDropdown() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useBudget();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "warning":
        return <AlertTriangle className="text-orange-500" size={18} />;
      case "error":
        return <AlertCircle className="text-red-500" size={18} />;
      case "primary":
        return <Info className="text-primary-600" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await markNotificationAsRead(id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isOpen
            ? "bg-primary-50 text-primary-600"
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        }`}
      >
        <Bell className="w-[22px] h-[22px]" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center animate-in zoom-in duration-300">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
              การแจ้งเตือน
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[11px] rounded-full">
                  {unreadCount} ใหม่
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsAsRead()}
                className="text-[12px] font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
              >
                <Check size={14} />
                อ่านทั้งหมด
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markNotificationAsRead(n.id);
                      setIsOpen(false);
                    }}
                    className={`group px-5 py-4 hover:bg-gray-50 transition-all cursor-pointer relative ${!n.isRead ? "bg-primary-50/30" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${!n.isRead ? "bg-white shadow-sm" : "bg-gray-100"}`}
                      >
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p
                            className={`text-[14px] leading-tight mb-1 ${!n.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                          >
                            {n.title}
                          </p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, n.id)}
                                className="p-1 text-gray-400 hover:text-primary-600 rounded-md hover:bg-white border border-transparent hover:border-gray-100"
                                title="อ่านเสร็จแล้ว"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, n.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-white border border-transparent hover:border-gray-100"
                              title="ลบ"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-[13px] text-gray-500 line-clamp-2 mb-2 font-medium">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                              locale: th,
                            })}
                          </span>
                          {n.link && (
                            <Link
                              href={n.link}
                              className="text-[11px] font-bold text-primary-600 hover:underline flex items-center gap-1"
                            >
                              ดูรายละเอียด
                              <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {!n.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-10 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="text-gray-300" size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">
                  ไม่มีการแจ้งเตือน
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  เราจะแจ้งให้คุณทราบเมื่อมีความเคลื่อนไหวเกี่ยวกับงบประมาณของคุณ
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 text-center bg-gray-50/30">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[12px] font-extrabold text-gray-500 hover:text-primary-600 transition-colors uppercase tracking-wider"
              >
                ดูทั้งหมด
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  type?: "primary" | "success" | "warning" | "info" | "danger";
  prefix?: string;
  suffix?: string;
}

const TYPE_STYLES: Record<string, { iconBg: string; iconColor: string }> = {
  primary: {
    iconBg: "var(--color-primary-50)",
    iconColor: "var(--color-primary-600)",
  },
  success: { iconBg: "var(--accent-green-light)", iconColor: "#059669" },
  warning: { iconBg: "var(--accent-amber-light)", iconColor: "#B45309" },
  info: { iconBg: "#EFF6FF", iconColor: "#2563EB" },
  danger: { iconBg: "var(--accent-red-light)", iconColor: "var(--accent-red)" },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  type = "primary",
  prefix = "",
  suffix = "",
}) => {
  const styles = TYPE_STYLES[type];
  const isPositive = (trend ?? 0) >= 0;
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-100 rounded-[20px] shadow-sm hover:shadow-md hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-[14px] font-bold text-gray-500">{title}</p>
        <div
          className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
          style={{ background: styles.iconBg }}
        >
          <Icon
            className="w-6 h-6"
            strokeWidth={2}
            style={{ color: styles.iconColor }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5 mt-2">
        {prefix && (
          <span className="text-sm font-semibold text-gray-400 mb-1">
            {prefix}
          </span>
        )}
        <span
          className="text-[32px] font-extrabold tracking-tight text-gray-900 leading-none"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {displayValue}
        </span>
        {suffix && (
          <span className="text-sm font-semibold text-gray-500 mb-1">
            {suffix}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
          <div
            className={`flex items-center gap-1 text-[13px] font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
          <span className="text-[12px] font-medium text-gray-400">
            เทียบกับเดือนที่แล้ว
          </span>
        </div>
      )}
    </div>
  );
};

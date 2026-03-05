import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  type?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  prefix?: string;
  suffix?: string;
}

const TYPE_STYLES: Record<string, { iconBg: string; iconColor: string }> = {
  primary: { iconBg: 'var(--color-primary-50)', iconColor: 'var(--color-primary-600)' },
  success: { iconBg: 'var(--accent-green-light)', iconColor: '#059669' },
  warning: { iconBg: 'var(--accent-amber-light)', iconColor: '#B45309' },
  info: { iconBg: '#EFF6FF', iconColor: '#2563EB' },
  danger: { iconBg: 'var(--accent-red-light)', iconColor: 'var(--accent-red)' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title, value, icon: Icon, trend, type = 'primary', prefix = '', suffix = '',
}) => {
  const styles = TYPE_STYLES[type];
  const isPositive = (trend ?? 0) >= 0;
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div
      className="p-5 transition-all duration-200"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary-200)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-tertiary)' }}>
          {title}
        </p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: styles.iconBg }}>
          <Icon className="w-4 h-4" strokeWidth={2} style={{ color: styles.iconColor }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{prefix}</span>
        )}
        <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
          {displayValue}
        </span>
        {suffix && (
          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{suffix}</span>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          <div className="flex items-center gap-0.5 text-[11px] font-semibold"
            style={{ color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>จากเดือนก่อน</span>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  subtitle: string;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, subtitle, icon: Icon, colorClass, iconBgClass }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${colorClass} flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{amount}</div>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;
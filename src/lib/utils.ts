import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getHexColor = (colorClass: string): string => {
    const colorMap: Record<string, string> = {
        'bg-red-500': '#EF4444',
        'bg-red-600': '#DC2626',
        'bg-blue-500': '#3B82F6',
        'bg-blue-600': '#2563EB',
        'bg-green-500': '#10B981',
        'bg-green-600': '#059669',
        'bg-yellow-500': '#F59E0B',
        'bg-yellow-600': '#D97706',
        'bg-purple-500': '#8B5CF6',
        'bg-purple-600': '#7C3AED',
        'bg-pink-500': '#EC4899',
        'bg-pink-600': '#DB2777',
        'bg-indigo-500': '#6366F1',
        'bg-indigo-600': '#4F46E5',
        'bg-teal-500': '#14B8A6',
        'bg-teal-600': '#0D9488',
        'bg-orange-500': '#F97316',
        'bg-orange-600': '#EA580C',
        'bg-cyan-500': '#06B6D4',
        'bg-cyan-600': '#0891B2',
        'bg-emerald-500': '#10B981',
        'bg-emerald-600': '#059669',
        'bg-rose-500': '#F43F5E',
        'bg-rose-600': '#E11D48',
        'bg-violet-500': '#8B5CF6',
        'bg-violet-600': '#7C3AED',
        'bg-fuchsia-500': '#D946EF',
        'bg-fuchsia-600': '#C026D3',
        'bg-lime-500': '#84CC16',
        'bg-lime-600': '#65A30D',
        'bg-primary-500': '#3B82F6',
        'bg-primary-600': '#2563EB',
    };
    return colorMap[colorClass] || '#3B82F6'; // Default to blue if not found
};

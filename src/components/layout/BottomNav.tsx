import React from 'react';
import { Page } from '../../types';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavItem {
    id: Page;
    label: string;
    icon: LucideIcon;
}

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    navItems: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate, navItems }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-1px_3px_rgba(0,0,0,0.06)] w-screen overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <nav className="flex items-stretch justify-around px-1 pt-1.5 pb-1 overflow-x-auto scrollbar-hide scrolling-touch">
                {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center py-1 min-w-0 flex-1 transition-colors duration-200",
                                isActive ? "text-primary-600" : "text-gray-400 active:text-gray-500"
                            )}
                        >
                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.2 : 1.8}
                                className="flex-shrink-0"
                            />
                            <span className={cn(
                                "text-[10px] mt-0.5 leading-tight truncate max-w-full px-0.5",
                                isActive ? "font-bold" : "font-medium"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

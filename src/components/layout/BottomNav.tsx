import React from 'react';
import { Page } from '../../types';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

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
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-gray-200/50 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <nav className="flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl w-full transition-all duration-300",
                                isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute inset-0 bg-primary-50 rounded-2xl -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={cn("relative p-1.5 rounded-xl transition-all", isActive ? "bg-primary-100" : "bg-transparent")}>
                                <item.icon
                                    size={24}
                                    className={cn("transition-transform duration-300", isActive ? "scale-105" : "")}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={cn("text-[10px] font-bold mt-1 transition-all", isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 hidden")}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

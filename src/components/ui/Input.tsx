import React from "react";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, icon: Icon, ...props }, ref) => {
        return (
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        !Icon && "pl-4", // Only apply default padding if no icon
                        error && "border-red-500 focus:ring-red-500 bg-red-50",
                        className
                    )}
                    style={{ paddingLeft: Icon ? '3rem' : undefined }} // 3rem = 48px, Safe distance for icon at left-3
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

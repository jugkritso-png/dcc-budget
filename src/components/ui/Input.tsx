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
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          className={cn(
            "flex h-14 w-full rounded-2xl border border-gray-100 bg-gray-50/50 pr-4 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
            !Icon && "pl-4", // Only apply default padding if no icon
            error && "border-red-500 focus:ring-red-500 bg-red-50",
            className,
          )}
          style={{ paddingLeft: Icon ? "3rem" : undefined }} // 3rem = 48px, Safe distance for icon at left-3
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

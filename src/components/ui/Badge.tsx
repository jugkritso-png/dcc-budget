import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            error: "bg-red-100 text-red-800",
            info: "bg-primary-50 text-primary-700 border-primary-100 border",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";

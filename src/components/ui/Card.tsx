import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, interactive, children, ...props }, ref) => {
        const Component = interactive ? motion.div : "div";
        const motionProps = interactive ? { whileHover: { y: -2, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.12)" } } : {};

        return (
            <Component
                ref={ref}
                className={cn(
                    "bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 ring-1 ring-black/5 shadow-lg shadow-gray-200/10 overflow-hidden",
                    interactive && "cursor-pointer transition-shadow",
                    className
                )}
                {...(motionProps as any)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
    )
)
CardTitle.displayName = "CardTitle"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
)
CardContent.displayName = "CardContent"

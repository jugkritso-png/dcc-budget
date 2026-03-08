import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

// Note: I didn't install CVA in the command above (missed it in the list),
// but I'll write this without CVA for now to keep it simple as per plan,
// or I'll implement a simple variant logic.
// Actually, using CVA is standard practice, but I recall I didn't install it.
// I will implement it manually for now to save a tool call, or use a simple switch.
// Wait, the plan mentioned "Optional: cva". I'll skip CVA and use simple object mapping or conditional logic for now to be efficient.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

// Framer Motion Wrapper for button
const MotionButton = motion.create("button");

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-200/50 border-transparent",
      secondary:
        "bg-primary-50 text-primary-600 hover:bg-primary-100 border-transparent",
      outline: "bg-white text-gray-700 border-gray-200 hover:border-primary-500 hover:text-primary-600",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-sm border-transparent",
      gradient:
        "bg-gradient-to-br from-[#00A3E4] to-[#0077C8] text-white shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 border-none",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <MotionButton
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 disabled:opacity-50 disabled:pointer-events-none border",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={isLoading || disabled}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </MotionButton>
    );
  },
);
Button.displayName = "Button";

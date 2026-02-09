import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, width = "max-w-2xl" }) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 25,
                                duration: 0.3
                            }}
                            className={cn(
                                "bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-h-[90vh] flex flex-col pointer-events-auto border border-white/60 ring-4 ring-primary-50/50",
                                width
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0 hover:bg-gray-100">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {children}
                            </div>

                            {/* Footer */}
                            {footer && (
                                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3 shrink-0">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

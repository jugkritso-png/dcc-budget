import React from "react";
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
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = "max-w-2xl" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={cn(
                                "bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto",
                                width
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

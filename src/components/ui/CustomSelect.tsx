import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Option {
    value: string;
    label: string;
    color?: string; // Optional color for the dot
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: boolean;
    className?: string;
    required?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    error,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-xl border bg-white px-3 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-transparent",
                    isOpen && "ring-2 ring-blue-500 border-transparent"
                )}
            >
                <div className="flex items-center gap-2 truncate">
                    {selectedOption ? (
                        <>
                            {selectedOption.color && (
                                <div className={cn("h-3 w-3 rounded-full flex-shrink-0", selectedOption.color)} />
                            )}
                            <span className="text-gray-900 font-medium">{selectedOption.label}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={16} className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50",
                                    value === option.value && "bg-blue-50 text-blue-700 font-medium"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {option.color && (
                                        <div className={cn("h-3 w-3 rounded-full flex-shrink-0", option.color)} />
                                    )}
                                    <span>{option.label}</span>
                                </div>
                                {value === option.value && <Check size={16} className="text-blue-600" />}
                            </button>
                        ))}
                        {options.length === 0 && (
                            <div className="px-3 py-2 text-center text-sm text-gray-400">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = true }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-3 transition-colors">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left font-semibold text-sm text-slate-600 dark:text-slate-300"
            >
                {title}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                    {children}
                </div>
            )}
        </div>
    );
}

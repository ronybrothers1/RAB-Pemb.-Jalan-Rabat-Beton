import React from 'react';

interface CardProps {
    icon: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export function Card({ icon, title, subtitle, children }: CardProps) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden mb-5 transition-all focus-within:shadow-md">
            <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-lg shrink-0">
                    {icon}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</div>
                </div>
            </div>
            <div className="p-4 sm:p-5">
                {children}
            </div>
        </div>
    );
}

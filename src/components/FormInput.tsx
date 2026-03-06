import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    prefixText?: string;
    suffixText?: string;
    sniTag?: string;
}

export function FormInput({ label, prefixText, suffixText, sniTag, className, ...props }: FormInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {label}
                {sniTag && (
                    <span className="text-[0.65rem] bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded px-1.5 py-0.5 ml-1.5 font-bold tracking-wider">
                        {sniTag}
                    </span>
                )}
            </label>
            <div className="relative">
                {prefixText && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none font-mono">
                        {prefixText}
                    </span>
                )}
                <input
                    className={`w-full border-1.5 border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 hover:not(:focus):border-slate-300 dark:hover:not(:focus):border-slate-600 py-2.5 ${prefixText ? 'pl-8' : 'pl-3'} ${suffixText ? 'pr-8' : 'pr-3'} font-mono ${className || ''}`}
                    {...props}
                />
                {suffixText && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none font-mono">
                        {suffixText}
                    </span>
                )}
            </div>
        </div>
    );
}

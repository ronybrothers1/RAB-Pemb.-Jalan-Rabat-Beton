import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    sniTag?: string;
    options: { value: string; label: string }[];
}

export function FormSelect({ label, sniTag, options, className, ...props }: FormSelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {label}
                {sniTag && (
                    <span className="text-[0.65rem] bg-teal-100/80 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded px-1.5 py-0.5 ml-1.5 font-bold tracking-wider">
                        {sniTag}
                    </span>
                )}
            </label>
            <select
                className={`w-full border-1.5 border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 cursor-pointer transition-all focus:outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 appearance-none py-2.5 pl-3 pr-8 ${className || ''}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center'
                }}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

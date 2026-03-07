import React from 'react';
import { MUTU_KOEF, BJ_PASIR, BJ_BATU } from '../constants';
import { fmtNum } from '../utils/format';

interface SniInfoBoxProps {
    selectedMutu: string;
}

export function SniInfoBox({ selectedMutu }: SniInfoBoxProps) {
    const rows = [
        { key: 'K175', label: 'K-175' },
        { key: 'K200', label: 'K-200' },
        { key: 'K225', label: 'K-225' },
        { key: 'K250', label: 'K-250' },
        { key: 'K275', label: 'K-275' },
        { key: 'K300', label: 'K-300' },
        { key: 'K325', label: 'K-325' },
        { key: 'K350', label: 'K-350' },
    ];

    return (
        <div className="bg-teal-50/50 dark:bg-teal-900/10 border border-teal-500/20 rounded-xl p-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-teal-700 dark:text-teal-400 font-bold block mb-3 text-sm">
                📋 Koefisien Bahan per m³ Beton — SNI 7394:2008
            </strong>
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full border-collapse mt-2 text-[0.7rem] min-w-[700px]">
                    <thead>
                        <tr>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">Pasal SNI</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">Mutu</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">PC (kg/m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">Semen (zak/m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">PB (kg/m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">→ Pasir (m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">KR (kg/m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">→ Batu (m³)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">Air (ltr)</th>
                            <th className="text-left py-1 px-1.5 text-slate-500 dark:text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap">w/c</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ key, label }) => {
                            const koef = MUTU_KOEF[key];
                            const isActive = key === selectedMutu;
                            return (
                                <tr key={key} className={`${isActive ? 'bg-teal-500/10 font-bold text-teal-800 dark:text-teal-300' : ''} border-t border-teal-500/10`}>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.ref}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{label} {isActive && '✓'}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.pcKg}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.semen, 3)}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.pasir * BJ_PASIR)}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.pasir, 5)}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.batu * BJ_BATU)}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.batu, 5)}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.air}</td>
                                    <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.wc}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

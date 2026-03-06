import React from 'react';
import { MUTU_KOEF } from '../constants';
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
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 mt-4 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold block mb-2">
                📋 Koefisien Bahan per m³ Beton — SNI 7394:2008 (Sumber: Dokumen BSN Asli)
            </strong>
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
                            <tr key={key} className={`${isActive ? 'bg-emerald-500/10 font-bold' : ''} border-t border-emerald-500/10`}>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{koef.ref}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{label} {isActive && '✓'}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{koef.pcKg}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.semen, 3)}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.pasir * 1400)}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.pasir, 5)}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.batu * 1500)}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.batu, 5)}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{koef.air}</td>
                                <td className="py-1 px-1.5 font-mono whitespace-nowrap">{koef.wc}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-2 text-[0.72rem] text-slate-500 dark:text-slate-400">
                ⚙️ <strong>Koefisien upah beton K-175 s/d K-300</strong> (§6.5–§6.10): Pekerja <strong>1,650</strong> · Tukang batu <strong>0,275</strong> · KT <strong>0,028</strong> · Mandor <strong>0,083</strong> OH/m³
                &nbsp;|&nbsp; <strong>K-325 &amp; K-350</strong> (§6.11–§6.12): Pekerja <strong>2,100</strong> · Tukang batu <strong>0,350</strong> · KT <strong>0,035</strong> · Mandor <strong>0,105</strong> OH/m³
                &nbsp;|&nbsp; Konversi (catatan SNI hal.3): BJ Pasir = <strong>1.400 kg/m³</strong> · BJ Kerikil = <strong>1.500 kg/m³</strong>
                &nbsp;|&nbsp; Bekisting (§6.20): Pekerja <strong>0,520</strong> · Tk.kayu <strong>0,260</strong> · KT <strong>0,026</strong> · Mdr <strong>0,026</strong> OH/m² · Kayu <strong>0,040</strong> m³ · Paku <strong>0,300</strong> kg · Minyak <strong>0,100</strong> ltr
            </div>
        </div>
    );
}

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
        <div className="bg-teal-50/50 dark:bg-teal-900/10 border border-teal-500/20 rounded-xl p-4 mt-4 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
            <strong className="text-teal-700 dark:text-teal-400 font-bold block mb-3 text-sm">
                📋 Koefisien Bahan per m³ Beton — SNI 7394:2008
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
                            <tr key={key} className={`${isActive ? 'bg-teal-500/10 font-bold text-teal-800 dark:text-teal-300' : ''} border-t border-teal-500/10`}>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.ref}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{label} {isActive && '✓'}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.pcKg}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.semen, 3)}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.pasir * 1400)}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.pasir, 5)}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{Math.round(koef.batu * 1500)}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{fmtNum(koef.batu, 5)}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.air}</td>
                                <td className="py-1.5 px-1.5 font-mono whitespace-nowrap">{koef.wc}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.72rem] text-slate-600 dark:text-slate-400">
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <strong className="text-teal-700 dark:text-teal-400 block mb-1.5">👷 Upah Beton Normal (K-175 s/d K-300)</strong>
                    <ul className="space-y-1">
                        <li>Pekerja: <span className="font-mono font-medium">1,650</span> OH/m³</li>
                        <li>Tukang Batu: <span className="font-mono font-medium">0,275</span> OH/m³</li>
                        <li>Kepala Tukang: <span className="font-mono font-medium">0,028</span> OH/m³</li>
                        <li>Mandor: <span className="font-mono font-medium">0,083</span> OH/m³</li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <strong className="text-teal-700 dark:text-teal-400 block mb-1.5">👷 Upah Beton Tinggi (K-325 & K-350)</strong>
                    <ul className="space-y-1">
                        <li>Pekerja: <span className="font-mono font-medium">2,100</span> OH/m³</li>
                        <li>Tukang Batu: <span className="font-mono font-medium">0,350</span> OH/m³</li>
                        <li>Kepala Tukang: <span className="font-mono font-medium">0,035</span> OH/m³</li>
                        <li>Mandor: <span className="font-mono font-medium">0,105</span> OH/m³</li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <strong className="text-teal-700 dark:text-teal-400 block mb-1.5">🪵 Bekisting (§6.20)</strong>
                    <div className="grid grid-cols-2 gap-2">
                        <ul className="space-y-1">
                            <li>Pekerja: <span className="font-mono font-medium">0,520</span> OH</li>
                            <li>Tk. Kayu: <span className="font-mono font-medium">0,260</span> OH</li>
                            <li>K. Tukang: <span className="font-mono font-medium">0,026</span> OH</li>
                            <li>Mandor: <span className="font-mono font-medium">0,026</span> OH</li>
                        </ul>
                        <ul className="space-y-1">
                            <li>Kayu: <span className="font-mono font-medium">0,040</span> m³</li>
                            <li>Paku: <span className="font-mono font-medium">0,300</span> kg</li>
                            <li>Minyak: <span className="font-mono font-medium">0,100</span> L</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <strong className="text-teal-700 dark:text-teal-400 block mb-1.5">⚖️ Konversi Berat (SNI Hal. 3)</strong>
                    <ul className="space-y-1">
                        <li>Berat Jenis Pasir: <span className="font-mono font-medium">1.400</span> kg/m³</li>
                        <li>Berat Jenis Kerikil: <span className="font-mono font-medium">1.500</span> kg/m³</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

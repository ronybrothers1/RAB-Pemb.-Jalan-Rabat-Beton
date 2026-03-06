import React, { useEffect, useState } from 'react';
import { CalculationResult } from '../types';
import { fmt, fmtNum } from '../utils/format';
import { Card } from './Card';

interface ResultsProps {
    result: CalculationResult | null;
    onPrint: () => void;
    onExport: () => void;
}

export function Results({ result, onPrint, onExport }: ResultsProps) {
    const [animatedTotal, setAnimatedTotal] = useState(0);

    useEffect(() => {
        if (result) {
            const duration = 1400;
            const start = performance.now();
            const target = result.grandTotal;

            const step = (now: number) => {
                const t = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - t, 4);
                setAnimatedTotal(Math.round(ease * target));
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
    }, [result]);

    if (!result) return null;

    const { rows, subtotal, ohVal, prfVal, ppnVal, grandTotal, pctOH, pctPrf, pctPPN,
            panjang, lebar, tebal, hargaPerM2, mutuLabel, volBeton } = result;

    const parts = [];
    if (pctOH > 0) parts.push(`OH ${fmtNum(pctOH * 100, 0)}%`);
    if (pctPrf > 0) parts.push(`Profit ${fmtNum(pctPrf * 100, 0)}%`);
    if (pctPPN > 0) parts.push(`PPN ${fmtNum(pctPPN * 100, 0)}%`);
    const sublabel = parts.length ? `Termasuk ${parts.join(', ')}` : 'Biaya konstruksi dasar';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
            <div className="h-2"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {[
                    { label: 'Panjang', value: fmtNum(panjang, 2), unit: 'meter' },
                    { label: 'Lebar', value: fmtNum(lebar, 2), unit: 'meter' },
                    { label: 'Tebal', value: fmtNum(tebal * 100, 1), unit: 'cm' },
                    { label: 'Volume Beton', value: fmtNum(volBeton, 3), unit: 'm³' },
                    { label: 'Harga/m²', value: 'Rp ' + fmt(hargaPerM2), unit: 'per m² jalan', hl: true },
                    { label: 'Mutu Beton', value: mutuLabel, unit: 'SNI 7394:2008' },
                ].map((s, i) => (
                    <div key={i} className={`bg-white dark:bg-slate-800 border ${s.hl ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3.5 shadow-sm transition-colors`}>
                        <div className="text-[0.72rem] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{s.label}</div>
                        <div className={`text-lg font-extrabold font-mono tracking-tight ${s.hl ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>{s.value}</div>
                        <div className="text-[0.72rem] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.unit}</div>
                    </div>
                ))}
            </div>

            <Card icon="📊" title="Rincian Anggaran Biaya" subtitle={`${result.namaProyek} — ${mutuLabel} — TA ${result.tahunAng}`}>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm -mx-4 sm:mx-0">
                    <table className="w-full border-collapse text-sm min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-left whitespace-nowrap w-[5%]">No</th>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-left whitespace-nowrap w-[37%] border-l border-slate-800">Uraian Pekerjaan</th>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-right whitespace-nowrap w-[11%] border-l border-slate-800">Volume</th>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-left whitespace-nowrap w-[8%] border-l border-slate-800">Sat.</th>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-right whitespace-nowrap w-[18%] border-l border-slate-800">Harga Satuan (Rp)</th>
                                <th className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-[0.7rem] font-bold tracking-wider uppercase py-3 px-3.5 text-right whitespace-nowrap w-[21%] border-l border-slate-800">Jumlah (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => {
                                if (r.type === 'header') {
                                    return (
                                        <tr key={i} className="bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
                                            <td className="py-2.5 px-3.5 font-bold text-blue-600 dark:text-blue-400 text-[0.83rem]">{r.no}</td>
                                            <td className="py-2.5 px-3.5 font-bold text-blue-600 dark:text-blue-400 text-[0.83rem]">{r.uraian}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-blue-600 dark:text-blue-400 text-[0.83rem]">{r.vol}</td>
                                            <td className="py-2.5 px-3.5 font-bold text-blue-600 dark:text-blue-400 text-[0.83rem]">{r.sat}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-blue-600 dark:text-blue-400 text-[0.83rem]">{fmt(r.hs)}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-blue-600 dark:text-blue-400 text-[0.83rem]">{fmt(r.jml)}</td>
                                        </tr>
                                    );
                                } else if (r.type === 'sub') {
                                    return (
                                        <tr key={i} className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                            <td colSpan={6} className="py-1.5 px-3.5 italic text-slate-500 dark:text-slate-400 text-[0.76rem]">{r.uraian}</td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-2.5 px-3.5"></td>
                                            <td className="py-2.5 px-3.5 pl-5 text-slate-600 dark:text-slate-300">{r.uraian}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-600 dark:text-slate-300">{r.vol}</td>
                                            <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">{r.sat}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-600 dark:text-slate-300">{fmt(r.hs)}</td>
                                            <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-600 dark:text-slate-300">{fmt(r.jml)}</td>
                                        </tr>
                                    );
                                }
                            })}
                            <tr className="bg-slate-900 dark:bg-slate-950 text-slate-100">
                                <td colSpan={5} className="py-3 px-3.5 text-right font-bold text-[0.85rem]">SUBTOTAL (sebelum OH / Profit / PPN)</td>
                                <td className="py-3 px-3.5 text-right font-mono font-bold text-[0.85rem]">Rp {fmt(subtotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mt-4 shadow-sm">
                <div className="flex justify-between items-center py-3 px-4 border-b border-slate-100 dark:border-slate-700 text-[0.85rem]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal Biaya Konstruksi</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">Rp {fmt(subtotal)}</span>
                </div>
                {pctOH > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 border-b border-slate-100 dark:border-slate-700 text-[0.85rem]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Overhead ({fmtNum(pctOH * 100, 1)}% × Subtotal)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">Rp {fmt(ohVal)}</span>
                    </div>
                )}
                {pctPrf > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 border-b border-slate-100 dark:border-slate-700 text-[0.85rem]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Profit ({fmtNum(pctPrf * 100, 1)}% × Subtotal)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">Rp {fmt(prfVal)}</span>
                    </div>
                )}
                {pctOH > 0 && pctPrf > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 border-b-2 border-slate-200 dark:border-slate-600 bg-blue-50 dark:bg-blue-900/20 text-[0.85rem]">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-[0.82rem]">Total OH + Profit ({fmtNum((pctOH + pctPrf) * 100, 1)}% × Subtotal)</span>
                        <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">Rp {fmt(ohVal + prfVal)}</span>
                    </div>
                )}
                {pctPPN > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 border-b border-slate-100 dark:border-slate-700 text-[0.85rem]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">PPN ({fmtNum(pctPPN * 100, 1)}% × (Subtotal + OH + Profit))</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">Rp {fmt(ppnVal)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-br from-slate-900 to-blue-700 dark:from-slate-950 dark:to-blue-900 text-white rounded-b-xl">
                    <span className="font-bold text-[0.9rem]">TOTAL AKHIR RAB</span>
                    <span className="font-mono font-extrabold text-[1.05rem]">Rp {fmt(grandTotal)}</span>
                </div>
            </div>

            <div className="sticky bottom-0 z-10 flex items-center justify-between flex-wrap gap-2.5 bg-gradient-to-br from-slate-900 to-blue-700 dark:from-slate-950 dark:to-blue-900 rounded-xl p-4 sm:p-5 mt-5 shadow-[0_-4px_20px_rgba(27,79,216,0.25)]">
                <div>
                    <div className="text-[0.8rem] font-bold text-white/55 tracking-wider uppercase">Total Akhir RAB</div>
                    <div className="text-[0.72rem] text-white/35 mt-0.5">{sublabel}</div>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Rp {fmt(animatedTotal)}
                </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
                <button onClick={onPrint} className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:-translate-y-px transition-all">
                    🖨️ Cetak / PDF
                </button>
                <button onClick={onExport} className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-green-800 hover:bg-green-900 text-white shadow-[0_2px_8px_rgba(22,101,52,0.25)] hover:-translate-y-px transition-all">
                    📊 Export Excel (.xlsx)
                </button>
            </div>
        </div>
    );
}

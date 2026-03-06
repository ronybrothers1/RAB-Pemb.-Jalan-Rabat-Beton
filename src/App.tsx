import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calculator, ClipboardList, RotateCcw } from 'lucide-react';
import { FormData, CalculationResult } from './types';
import { MUTU_KOEF, UPAH_BETON_NORMAL, UPAH_BETON_TINGGI, UPAH_BEKISTING, BAHAN_BEKISTING, UPAH_SIRTU } from './constants';
import { fmt, fmtNum, safe } from './utils/format';
import { exportXLSX } from './utils/exportExcel';
import { printPDF } from './utils/printPdf';
import { Card } from './components/Card';
import { FormInput } from './components/FormInput';
import { FormSelect } from './components/FormSelect';
import { Accordion } from './components/Accordion';
import { SniInfoBox } from './components/SniInfoBox';
import { Results } from './components/Results';

const SAVE_KEY = 'rab-form-v4';

const defaultFormData: FormData = {
    namaProyek: '', lokasiProyek: '', tahunAnggaran: '', penyusun: '',
    panjang: '', lebar: '', tebal: 0.15, opsiBekisting: '2', mutuBeton: 'K250',
    upahPekerja: '', upahTukang: '', upahKepalaTukang: '', upahMandor: '',
    hargaSirtu: '', hargaKayu: '', hargaPaku: '', hargaMinyakBekisting: '',
    hargaPlastikCor: '', hargaSemen: '', hargaPasirBeton: '', hargaBatuPecah: '', hargaAir: '',
    pctOverhead: 10, pctProfit: 10, pctPpn: 11
};

export default function App() {
    const [isDark, setIsDark] = useState(false);
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const savedDark = localStorage.getItem('rab-dark');
        if (savedDark === '1') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
        
        const savedForm = localStorage.getItem(SAVE_KEY);
        if (savedForm) {
            try {
                setFormData(JSON.parse(savedForm));
            } catch (e) {}
        }
    }, []);

    const toggleDark = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('rab-dark', '1');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('rab-dark', '0');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: string | number = value;
        
        if (type === 'number') {
            val = value === '' ? '' : parseFloat(value);
        }
        
        const newData = { ...formData, [name]: val };
        setFormData(newData);
        localStorage.setItem(SAVE_KEY, JSON.stringify(newData));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e);
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e);

    const fillExampleData = () => {
        const d: FormData = {
            namaProyek: 'Pembangunan Jalan Rabat Beton Dusun Cimahi',
            lokasiProyek: 'Desa Sukamaju, Kec. Ciamis, Kab. Ciamis',
            tahunAnggaran: '2025',
            penyusun: 'Imam Sahroni Darmawan, ST',
            panjang: 100, lebar: 3, tebal: 0.15,
            opsiBekisting: '2', mutuBeton: 'K250',
            upahPekerja: 120000, upahTukang: 150000,
            upahKepalaTukang: 180000, upahMandor: 220000,
            hargaSirtu: 200000, hargaKayu: 3000000,
            hargaPaku: 22000, hargaMinyakBekisting: 25000,
            hargaPlastikCor: 10000, hargaSemen: 58000,
            hargaPasirBeton: 300000, hargaBatuPecah: 350000,
            hargaAir: 75, pctOverhead: 10, pctProfit: 10, pctPpn: 11
        };
        setFormData(d);
        localStorage.setItem(SAVE_KEY, JSON.stringify(d));
        setErrorMsg('');
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setResult(null);
        setErrorMsg('');
        localStorage.removeItem(SAVE_KEY);
    };

    const calculateRAB = () => {
        setErrorMsg('');
        
        const {
            panjang, lebar, tebal, upahPekerja, upahTukang, upahKepalaTukang, upahMandor,
            hargaSirtu, hargaKayu, hargaPaku, hargaMinyakBekisting, hargaPlastikCor,
            hargaSemen, hargaPasirBeton, hargaBatuPecah, hargaAir,
            opsiBekisting, mutuBeton, pctOverhead, pctProfit, pctPpn,
            namaProyek, lokasiProyek, tahunAnggaran, penyusun
        } = formData;

        const p = Number(panjang) || 0;
        const l = Number(lebar) || 0;
        const t = Number(tebal) || 0;

        if (p <= 0 || l <= 0 || t <= 0) {
            setErrorMsg('Mohon masukkan dimensi jalan yang valid (nilai harus > 0).');
            return;
        }

        const uPk = Number(upahPekerja) || 0;
        const uTk = Number(upahTukang) || 0;
        const uKt = Number(upahKepalaTukang) || 0;
        const uMd = Number(upahMandor) || 0;

        const hSrt = Number(hargaSirtu) || 0;
        const hKy = Number(hargaKayu) || 0;
        const hPk = Number(hargaPaku) || 0;
        const hMy = Number(hargaMinyakBekisting) || 0;
        const hPl = Number(hargaPlastikCor) || 0;
        const hSm = Number(hargaSemen) || 0;
        const hPs = Number(hargaPasirBeton) || 0;
        const hBt = Number(hargaBatuPecah) || 0;
        const hAr = Number(hargaAir) || 0;

        const coreRequired = [uPk, uTk, uKt, uMd, hSrt, hPl, hSm, hPs, hBt, hAr];
        if (coreRequired.some(val => val <= 0)) {
            setErrorMsg('Mohon isi semua harga satuan upah dan material bahan utama.');
            return;
        }

        const bekistingSisi = opsiBekisting ? parseInt(opsiBekisting) : 0;
        if (bekistingSisi > 0) {
            const bekistingRequired = [hKy, hPk, hMy];
            if (bekistingRequired.some(val => val <= 0)) {
                setErrorMsg('Mohon isi harga material bekisting (Kayu, Paku, Minyak).');
                return;
            }
        }
        const koef = MUTU_KOEF[mutuBeton] || MUTU_KOEF.K250;
        const upahKoef = (mutuBeton === 'K325' || mutuBeton === 'K350') ? UPAH_BETON_TINGGI : UPAH_BETON_NORMAL;
        
        const pOH = (Number(pctOverhead) || 0) / 100;
        const pPrf = (Number(pctProfit) || 0) / 100;
        const pPPN = (Number(pctPpn) || 0) / 100;

        // Volumes
        const volSirtu = p * l * 0.05;
        const volBekisting = p * t * bekistingSisi;
        const volPlastik = p * l;
        const volBeton = p * l * t;
        const areaJalan = p * l;

        // 1. Sirtu
        const s_pk = volSirtu * UPAH_SIRTU.pekerja;
        const s_mn = volSirtu * UPAH_SIRTU.mandor;
        const s_mt = volSirtu * 1.200;
        const s_pkH = s_pk * uPk;
        const s_mnH = s_mn * uMd;
        const s_mtH = s_mt * hSrt;
        const totalSirtu = s_pkH + s_mnH + s_mtH;

        // 2. Bekisting
        let totalBekisting = 0, bekRows: any[] = [];
        if (bekistingSisi > 0) {
            const b_pk = volBekisting * UPAH_BEKISTING.pekerja;
            const b_tk = volBekisting * UPAH_BEKISTING.tukang;
            const b_kt = volBekisting * UPAH_BEKISTING.kepalaTukang;
            const b_mn = volBekisting * UPAH_BEKISTING.mandor;
            const b_ky = volBekisting * BAHAN_BEKISTING.kayu;
            const b_pa = volBekisting * BAHAN_BEKISTING.paku;
            const b_my = volBekisting * BAHAN_BEKISTING.minyak;
            
            const b_pkH = b_pk * uPk;
            const b_tkH = b_tk * uTk;
            const b_ktH = b_kt * uKt;
            const b_mnH = b_mn * uMd;
            const b_kyH = b_ky * hKy;
            const b_paH = b_pa * hPk;
            const b_myH = b_my * hMy;
            
            totalBekisting = b_pkH + b_tkH + b_ktH + b_mnH + b_kyH + b_paH + b_myH;
            
            bekRows = [
                { type:'sub', uraian:'Tenaga Kerja (SNI 7394:2008 §6.20 — bekisting pondasi)' },
                { uraian:'Pekerja', vol:fmtNum(b_pk, 3), sat:'OH', hs:uPk, jml:b_pkH },
                { uraian:'Tukang Kayu', vol:fmtNum(b_tk, 3), sat:'OH', hs:uTk, jml:b_tkH },
                { uraian:'Kepala Tukang', vol:fmtNum(b_kt, 3), sat:'OH', hs:uKt, jml:b_ktH },
                { uraian:'Mandor', vol:fmtNum(b_mn, 3), sat:'OH', hs:uMd, jml:b_mnH },
                { type:'sub', uraian:'Bahan' },
                { uraian:'Kayu Kelas III', vol:fmtNum(b_ky, 3), sat:'m³', hs:hKy, jml:b_kyH },
                { uraian:'Paku 5–10 cm', vol:fmtNum(b_pa, 3), sat:'kg', hs:hPk, jml:b_paH },
                { uraian:'Minyak Bekisting', vol:fmtNum(b_my, 3), sat:'ltr', hs:hMy, jml:b_myH },
            ];
        }

        // 3. Plastik
        const p_pk = volPlastik * 0.004;
        const p_mt = volPlastik * 1.050;
        const p_pkH = p_pk * uPk;
        const p_mtH = p_mt * hPl;
        const totalPlastik = p_pkH + p_mtH;

        // 4. Beton
        const bt_pk = volBeton * upahKoef.pekerja;
        const bt_tk = volBeton * upahKoef.tukang;
        const bt_kt = volBeton * upahKoef.kepalaTukang;
        const bt_mn = volBeton * upahKoef.mandor;
        const bt_sm = volBeton * koef.semen;
        const bt_ps = volBeton * koef.pasir;
        const bt_bt = volBeton * koef.batu;
        const bt_ar = volBeton * koef.air;
        
        const bt_pkH = bt_pk * uPk;
        const bt_tkH = bt_tk * uTk;
        const bt_ktH = bt_kt * uKt;
        const bt_mnH = bt_mn * uMd;
        const bt_smH = bt_sm * hSm;
        const bt_psH = bt_ps * hPs;
        const bt_btH = bt_bt * hBt;
        const bt_arH = bt_ar * hAr;
        
        const totalBeton = bt_pkH + bt_tkH + bt_ktH + bt_mnH + bt_smH + bt_psH + bt_btH + bt_arH;

        const subtotal = totalSirtu + totalBekisting + totalPlastik + totalBeton;
        const ohVal = subtotal * pOH;
        const prfVal = subtotal * pPrf;
        const ppnBase = subtotal + ohVal + prfVal;
        const ppnVal = ppnBase * pPPN;
        const grandTotal = ppnBase + ppnVal;
        const hargaPerM2 = safe(grandTotal, areaJalan);

        const mutuLabel = mutuBeton.replace('K', 'K-');
        
        const rows = [
            { type:'header', no:'1', uraian:'Pengurugan dengan Sirtu (t=5 cm)', vol:fmtNum(volSirtu, 3), sat:'m³', hs:safe(totalSirtu,volSirtu), jml:totalSirtu },
            { type:'sub', uraian:'Tenaga Kerja' },
            { uraian:'Pekerja', vol:fmtNum(s_pk, 3), sat:'OH', hs:uPk, jml:s_pkH },
            { uraian:'Mandor', vol:fmtNum(s_mn, 3), sat:'OH', hs:uMd, jml:s_mnH },
            { type:'sub', uraian:'Bahan' },
            { uraian:'Sirtu', vol:fmtNum(s_mt, 3), sat:'m³', hs:hSrt, jml:s_mtH },
        ];

        if (bekistingSisi > 0) {
            rows.push(
                { type:'header', no:'2', uraian:`Pemasangan Bekisting (${bekistingSisi} sisi) — SNI 7394:2008 §6.20`, vol:fmtNum(volBekisting, 3), sat:'m²', hs:safe(totalBekisting,volBekisting), jml:totalBekisting },
                ...bekRows
            );
        }

        const noPlastik = bekistingSisi > 0 ? '3' : '2';
        rows.push(
            { type:'header', no:noPlastik, uraian:'Pemasangan Plastik Cor (alas)', vol:fmtNum(volPlastik, 3), sat:'m²', hs:safe(totalPlastik,volPlastik), jml:totalPlastik },
            { type:'sub', uraian:'Tenaga Kerja' },
            { uraian:'Pekerja', vol:fmtNum(p_pk, 3), sat:'OH', hs:uPk, jml:p_pkH },
            { type:'sub', uraian:'Bahan' },
            { uraian:'Plastik Cor', vol:fmtNum(p_mt, 3), sat:'m²', hs:hPl, jml:p_mtH },
        );

        const noBeton = bekistingSisi > 0 ? '4' : '3';
        rows.push(
            { type:'header', no:noBeton, uraian:`Pembuatan Beton ${mutuLabel} — SNI 7394:2008`, vol:fmtNum(volBeton, 3), sat:'m³', hs:safe(totalBeton,volBeton), jml:totalBeton },
            { type:'sub', uraian:`Tenaga Kerja (SNI 7394:2008 ${koef.ref} — Pekerja ${fmtNum(upahKoef.pekerja, 3)} · Tk.batu ${fmtNum(upahKoef.tukang, 3)} · KT ${fmtNum(upahKoef.kepalaTukang, 3)} · Mdr ${fmtNum(upahKoef.mandor, 3)} OH/m³)` },
            { uraian:'Pekerja', vol:fmtNum(bt_pk, 3), sat:'OH', hs:uPk, jml:bt_pkH },
            { uraian:'Tukang Batu', vol:fmtNum(bt_tk, 3), sat:'OH', hs:uTk, jml:bt_tkH },
            { uraian:'Kepala Tukang', vol:fmtNum(bt_kt, 3), sat:'OH', hs:uKt, jml:bt_ktH },
            { uraian:'Mandor', vol:fmtNum(bt_mn, 3), sat:'OH', hs:uMd, jml:bt_mnH },
            { type:'sub', uraian:`Bahan (SNI 7394:2008 ${koef.ref} — PC=${koef.pcKg} kg/m³ → ${fmtNum(koef.semen, 3)} zak | PB=${Math.round(koef.pasir*1400)} kg/m³ → ${fmtNum(koef.pasir, 5)} m³ | KR=${Math.round(koef.batu*1500)} kg/m³ → ${fmtNum(koef.batu, 5)} m³ | Air=${koef.air} ltr | fc'=${koef.fc} | w/c=${koef.wc})` },
            { uraian:`Semen Portland (${mutuLabel})`, vol:fmtNum(bt_sm, 3), sat:'zak', hs:hSm, jml:bt_smH },
            { uraian:'Pasir Beton', vol:fmtNum(bt_ps, 3), sat:'m³', hs:hPs, jml:bt_psH },
            { uraian:'Batu Pecah 2–3 cm', vol:fmtNum(bt_bt, 3), sat:'m³', hs:hBt, jml:bt_btH },
            { uraian:'Air', vol:fmtNum(bt_ar, 3), sat:'ltr', hs:hAr, jml:bt_arH },
        );

        setResult({
            rows, subtotal, ohVal, prfVal, ppnVal, grandTotal, pctOH: pOH, pctPrf: pPrf, pctPPN: pPPN,
            namaProyek: namaProyek || '—', lokasiProyek: lokasiProyek || '—', tahunAng: tahunAnggaran || '—', 
            mutu: mutuBeton, mutuLabel, penyusun: penyusun || '—',
            panjang: p, lebar: l, tebal: t, hargaPerM2, koef, upahKoef, volBeton, area: areaJalan
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            
            {/* HERO */}
            <header className="relative bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 dark:from-slate-900 dark:via-teal-900 dark:to-cyan-900 pt-10 pb-12 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
                
                <div className="absolute top-4 right-5">
                    <button onClick={toggleDark} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white/90 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors">
                        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        {isDark ? 'Light' : 'Dark'}
                    </button>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-[0.72rem] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3.5">
                    <span className="w-1.5 h-1.5 bg-teal-300 rounded-full"></span> Kalkulator RAB Pro
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">RAB Jalan Rabat Beton K-175 s/d K-350</h1>
                <p className="text-white/90 dark:text-white/70 text-sm max-w-lg mx-auto mb-3">Estimasi biaya profesional untuk kontraktor — lengkap dengan overhead, profit, dan PPN</p>
                <div className="inline-flex items-center gap-1.5 bg-white/10 dark:bg-teal-400/15 border border-white/20 dark:border-teal-400/35 text-white dark:text-teal-300 text-[0.68rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    ✅ Koefisien SNI 7394:2008 · K-175 s/d K-350
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
                
                {errorMsg && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                        <span className="text-lg shrink-0">⚠️</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <Card icon="🏗️" title="Informasi Proyek" subtitle="Ditampilkan pada dokumen cetak resmi">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <FormInput label="Nama Proyek" name="namaProyek" value={formData.namaProyek} onChange={handleInputChange} placeholder="Pembangunan Jalan Desa ..." />
                        <FormInput label="Lokasi" name="lokasiProyek" value={formData.lokasiProyek} onChange={handleInputChange} placeholder="Desa / Kecamatan / Kab." />
                        <FormInput label="Tahun Anggaran" name="tahunAnggaran" value={formData.tahunAnggaran} onChange={handleInputChange} placeholder="2025" />
                        <FormInput label="Penyusun RAB" name="penyusun" value={formData.penyusun} onChange={handleInputChange} placeholder="Nama penyusun / konsultan" />
                    </div>
                </Card>

                <Card icon="📐" title="Dimensi Jalan" subtitle="Panjang, lebar, tebal beton, dan opsi bekisting">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        <FormInput type="number" min="0" step="0.01" label="Panjang Jalan" name="panjang" value={formData.panjang} onChange={handleInputChange} suffixText="m" placeholder="0.00" />
                        <FormInput type="number" min="0" step="0.01" label="Lebar Jalan" name="lebar" value={formData.lebar} onChange={handleInputChange} suffixText="m" placeholder="0.00" />
                        <FormInput type="number" min="0" step="0.01" label="Tebal Rabat Beton" name="tebal" value={formData.tebal} onChange={handleInputChange} suffixText="m" placeholder="0.15" />
                        <FormSelect label="Opsi Bekisting" name="opsiBekisting" value={formData.opsiBekisting} onChange={handleSelectChange} options={[
                            { value: '2', label: 'Bekisting 2 Sisi (standar)' },
                            { value: '1', label: 'Bekisting 1 Sisi' },
                            { value: '0', label: 'Tanpa Bekisting' }
                        ]} />
                        <FormSelect label="Mutu Beton" name="mutuBeton" value={formData.mutuBeton} onChange={handleSelectChange} sniTag="SNI" options={[
                            { value: 'K175', label: "K-175 (fc' 14,5 MPa)" },
                            { value: 'K200', label: "K-200 (fc' 16,9 MPa)" },
                            { value: 'K225', label: "K-225 (fc' 19,3 MPa)" },
                            { value: 'K250', label: "K-250 (fc' 21,7 MPa)" },
                            { value: 'K275', label: "K-275 (fc' 24,0 MPa)" },
                            { value: 'K300', label: "K-300 (fc' 26,4 MPa)" },
                            { value: 'K325', label: "K-325 (fc' 28,8 MPa)" },
                            { value: 'K350', label: "K-350 (fc' 31,2 MPa)" }
                        ]} />
                    </div>
                    <SniInfoBox selectedMutu={formData.mutuBeton} />
                </Card>

                <Card icon="👷" title="Harga Satuan Upah Tenaga Kerja" subtitle="Satuan: Rp per Orang Hari (OH) — SNI 7394:2008">
                    <Accordion title="Upah Tenaga Kerja">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <FormInput type="number" min="0" label="Pekerja" sniTag="1,650 OH/m³" name="upahPekerja" value={formData.upahPekerja} onChange={handleInputChange} prefixText="Rp" placeholder="120000" />
                            <FormInput type="number" min="0" label="Tukang Batu" sniTag="0,275 OH/m³" name="upahTukang" value={formData.upahTukang} onChange={handleInputChange} prefixText="Rp" placeholder="150000" />
                            <FormInput type="number" min="0" label="Kepala Tukang" sniTag="0,028 OH/m³" name="upahKepalaTukang" value={formData.upahKepalaTukang} onChange={handleInputChange} prefixText="Rp" placeholder="180000" />
                            <FormInput type="number" min="0" label="Mandor" sniTag="0,083 OH/m³" name="upahMandor" value={formData.upahMandor} onChange={handleInputChange} prefixText="Rp" placeholder="220000" />
                        </div>
                    </Accordion>
                </Card>

                <Card icon="🪨" title="Harga Satuan Material / Bahan" subtitle="Sesuaikan dengan harga pasar setempat">
                    <Accordion title="Harga Bahan Material">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            <FormInput type="number" min="0" label="Sirtu (per m³)" name="hargaSirtu" value={formData.hargaSirtu} onChange={handleInputChange} prefixText="Rp" placeholder="200000" />
                            <FormInput type="number" min="0" label="Kayu Kelas III (per m³)" name="hargaKayu" value={formData.hargaKayu} onChange={handleInputChange} prefixText="Rp" placeholder="3000000" />
                            <FormInput type="number" min="0" label="Paku 5–10 cm (per kg)" name="hargaPaku" value={formData.hargaPaku} onChange={handleInputChange} prefixText="Rp" placeholder="22000" />
                            <FormInput type="number" min="0" label="Minyak Bekisting (per liter)" name="hargaMinyakBekisting" value={formData.hargaMinyakBekisting} onChange={handleInputChange} prefixText="Rp" placeholder="25000" />
                            <FormInput type="number" min="0" label="Plastik Cor (per m²)" name="hargaPlastikCor" value={formData.hargaPlastikCor} onChange={handleInputChange} prefixText="Rp" placeholder="10000" />
                            <FormInput type="number" min="0" label="Semen Portland (per zak @40 kg)" sniTag="SNI" name="hargaSemen" value={formData.hargaSemen} onChange={handleInputChange} prefixText="Rp" placeholder="58000" />
                            <FormInput type="number" min="0" label="Pasir Beton (per m³)" sniTag="SNI" name="hargaPasirBeton" value={formData.hargaPasirBeton} onChange={handleInputChange} prefixText="Rp" placeholder="300000" />
                            <FormInput type="number" min="0" label="Batu Pecah 2–3 cm (per m³)" sniTag="SNI" name="hargaBatuPecah" value={formData.hargaBatuPecah} onChange={handleInputChange} prefixText="Rp" placeholder="350000" />
                            <FormInput type="number" min="0" label="Air (per liter)" name="hargaAir" value={formData.hargaAir} onChange={handleInputChange} prefixText="Rp" placeholder="75" />
                        </div>
                    </Accordion>
                </Card>

                <Card icon="📈" title="Overhead, Profit & PPN" subtitle="Kosongkan jika tidak diterapkan (nilai 0)">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <FormInput type="number" min="0" max="100" step="0.1" label="Overhead (%)" name="pctOverhead" value={formData.pctOverhead} onChange={handleInputChange} suffixText="%" placeholder="10" />
                        <FormInput type="number" min="0" max="100" step="0.1" label="Profit (%)" name="pctProfit" value={formData.pctProfit} onChange={handleInputChange} suffixText="%" placeholder="10" />
                        <FormInput type="number" min="0" max="100" step="0.1" label="PPN (%)" name="pctPpn" value={formData.pctPpn} onChange={handleInputChange} suffixText="%" placeholder="11" />
                    </div>
                </Card>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mt-6">
                    <button onClick={calculateRAB} className="col-span-2 sm:flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 hover:-translate-y-0.5 transition-all">
                        <Calculator className="w-4 h-4" /> Hitung RAB
                    </button>
                    <button onClick={fillExampleData} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                        <ClipboardList className="w-4 h-4" /> Data Contoh
                    </button>
                    <button onClick={resetForm} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>

                <Results 
                    result={result} 
                    onPrint={() => printPDF(result)} 
                    onExport={() => exportXLSX(result)} 
                />

            </main>

            <footer className="text-center py-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">© 2025 RAB Jalan Rabat Beton | Koefisien SNI 7394:2008</div>
            </footer>
        </div>
    );
}

export interface FormData {
    namaProyek: string;
    lokasiProyek: string;
    tahunAnggaran: string;
    penyusun: string;
    panjang: number | '';
    lebar: number | '';
    tebal: number | '';
    opsiBekisting: string;
    mutuBeton: string;
    upahPekerja: number | '';
    upahTukang: number | '';
    upahKepalaTukang: number | '';
    upahMandor: number | '';
    hargaSirtu: number | '';
    hargaKayu: number | '';
    hargaPaku: number | '';
    hargaMinyakBekisting: number | '';
    hargaPlastikCor: number | '';
    hargaSemen: number | '';
    hargaPasirBeton: number | '';
    hargaBatuPecah: number | '';
    hargaAir: number | '';
    pctOverhead: number | '';
    pctProfit: number | '';
    pctPpn: number | '';
}

export interface CalculationResult {
    rows: any[];
    subtotal: number;
    ohVal: number;
    prfVal: number;
    ppnVal: number;
    grandTotal: number;
    pctOH: number;
    pctPrf: number;
    pctPPN: number;
    namaProyek: string;
    lokasiProyek: string;
    tahunAng: string;
    mutu: string;
    mutuLabel: string;
    penyusun: string;
    panjang: number;
    lebar: number;
    tebal: number;
    hargaPerM2: number;
    koef: any;
    upahKoef: any;
    volBeton: number;
    area: number;
}

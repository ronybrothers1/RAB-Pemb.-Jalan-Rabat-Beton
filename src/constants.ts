export const ZAK_KG = 40;
export const BJ_PASIR = 1400;
export const BJ_BATU = 1350;

export const MUTU_KOEF: Record<string, any> = {
    K175: { semen: 326/ZAK_KG, pasir: 760/BJ_PASIR,  batu: 1029/BJ_BATU, air: 215, pcKg: 326, ref: '§6.5',  wc: '0,66', fc: "14,5 MPa" },
    K200: { semen: 352/ZAK_KG, pasir: 731/BJ_PASIR,  batu: 1031/BJ_BATU, air: 215, pcKg: 352, ref: '§6.6',  wc: '0,61', fc: "16,9 MPa" },
    K225: { semen: 371/ZAK_KG, pasir: 698/BJ_PASIR,  batu: 1047/BJ_BATU, air: 215, pcKg: 371, ref: '§6.7',  wc: '0,58', fc: "19,3 MPa" },
    K250: { semen: 384/ZAK_KG, pasir: 692/BJ_PASIR,  batu: 1039/BJ_BATU, air: 215, pcKg: 384, ref: '§6.8',  wc: '0,56', fc: "21,7 MPa" },
    K275: { semen: 406/ZAK_KG, pasir: 684/BJ_PASIR,  batu: 1026/BJ_BATU, air: 215, pcKg: 406, ref: '§6.9',  wc: '0,53', fc: "24,0 MPa" },
    K300: { semen: 413/ZAK_KG, pasir: 681/BJ_PASIR,  batu: 1021/BJ_BATU, air: 215, pcKg: 413, ref: '§6.10', wc: '0,52', fc: "26,4 MPa" },
    K325: { semen: 439/ZAK_KG, pasir: 670/BJ_PASIR,  batu: 1006/BJ_BATU, air: 215, pcKg: 439, ref: '§6.11', wc: '0,49', fc: "28,8 MPa" },
    K350: { semen: 448/ZAK_KG, pasir: 667/BJ_PASIR,  batu: 1000/BJ_BATU, air: 215, pcKg: 448, ref: '§6.12', wc: '0,48', fc: "31,2 MPa" },
};

export const UPAH_BETON_NORMAL = { pekerja: 1.650, tukang: 0.275, kepalaTukang: 0.028, mandor: 0.083 };
export const UPAH_BETON_TINGGI = { pekerja: 2.100, tukang: 0.350, kepalaTukang: 0.035, mandor: 0.105 };

export const UPAH_BEKISTING  = { pekerja: 0.520, tukang: 0.260, kepalaTukang: 0.026, mandor: 0.026 };
export const BAHAN_BEKISTING = { kayu: 0.040, paku: 0.300, minyak: 0.100 };

export const UPAH_SIRTU = { pekerja: 0.300, mandor: 0.010 };

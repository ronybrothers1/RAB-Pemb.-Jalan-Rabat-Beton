import * as XLSX from 'xlsx-js-style';
import { CalculationResult } from '../types';
import { fmtNum } from './format';

function unFmt(s: any) {
    if (s === '' || s === undefined || s === null) return 0;
    const n = parseFloat(String(s).replace(/\./g, '').replace(/,/g, '.'));
    return isNaN(n) ? 0 : n;
}

export function exportXLSX(result: CalculationResult | null) {
    if (!result) { alert('Hitung RAB terlebih dahulu sebelum export.'); return; }

    const { rows, subtotal, ohVal, prfVal, ppnVal, grandTotal,
            pctOH, pctPrf, pctPPN, namaProyek, lokasiProyek,
            tahunAng, mutuLabel, penyusun, panjang, lebar, tebal,
            hargaPerM2, koef, upahKoef, volBeton, area } = result;

    const tgl      = new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

    // ── Style helpers ────────────────────────────────────────
    const S = (rgb: string, bold=false, sz=10, italic=false) => ({
        font: { name:'Arial', sz, bold, italic, color:{rgb} }
    });
    const FL = (rgb: string) => ({ patternType:'solid', fgColor:{rgb}, bgColor:{rgb} });
    const AL = (h='left',v='center',wrapText=true) => ({ horizontal:h, vertical:v, wrapText });
    const BD = (all='thin') => {
        const s = { style:all, color:{rgb:'CBD5E1'} };
        return { top:s, bottom:s, left:s, right:s };
    };
    const BDM = () => {
        const m = { style:'medium', color:{rgb:'334155'} };
        const t = { style:'thin',   color:{rgb:'CBD5E1'} };
        return { top:m, bottom:m, left:m, right:m };
    };
    const bdThickTeal = { top:{style:'medium',color:{rgb:'0D9488'}},
                          bottom:{style:'medium',color:{rgb:'0D9488'}},
                          left:{style:'medium',color:{rgb:'0D9488'}},
                          right:{style:'medium',color:{rgb:'0D9488'}} };
    const FMT_IDR  = '#,##0';
    const FMT_D3   = '#,##0.000';

    // Warna
    const NAVY='0F172A', TEAL='0D9488', TEAL_LT='CCFBF1', TEAL_D='0F766E';
    const SLATE='334155', SL_LT='F1F5F9', SL_MED='CBD5E1';
    const WHITE='FFFFFF', YEL_LT='FEFCE8';
    const ORG_LT='FFF7ED', AMBER='B45309';
    const RED_LT='FEF2F2', RED_D='991B1B';

    // Cell builder
    const C = (v: any, rgb_fg: string | null, rgb_bg: string | null, bold=false, sz=10, halign='left',
               fmt: string | null=null, italic=false, wrap=true) => {
        const cell: any = { v, t: (typeof v==='number'?'n':'s') };
        cell.s = {
            font: { name:'Arial', sz, bold, italic,
                    color:{ rgb: rgb_fg||'0F172A' } },
            fill: rgb_bg ? FL(rgb_bg) : { patternType:'none' },
            alignment: AL(halign,'center',wrap),
            border: BD('thin'),
        };
        if (fmt) cell.z = fmt;
        return cell;
    };
    const CE = () => ({ v:'', t:'s', s:{ fill:{patternType:'none'}, border:BD('thin') } });

    // ── Bangun data sheet 1 ──────────────────────────────────
    const aoa: any[][] = [];   
    const merges: any[] = [];
    let r = 0; 

    const push = (...cells: any[]) => { aoa.push(cells); r++; };
    const pushEmpty = (n=1) => { for(let i=0;i<n;i++){ aoa.push([CE(),CE(),CE(),CE(),CE(),CE()]); r++; } };
    const merge = (rs: number,cs: number,re: number,ce: number) => merges.push({s:{r:rs,c:cs},e:{r:re,c:ce}});

    // ── Baris 1: Judul utama ─────────────────────────────────
    aoa.push([
        { v:'RENCANA ANGGARAN BIAYA (RAB) — PEMBANGUNAN JALAN RABAT BETON',
          t:'s', s:{ font:{name:'Arial',sz:14,bold:true,color:{rgb:WHITE}},
                     fill:FL(NAVY), alignment:AL('center','center',true),
                     border:bdThickTeal } },
        CE(),CE(),CE(),CE(),CE()
    ]); merge(r,0,r,5); r++;

    // Baris 2: Sub-judul
    aoa.push([
        { v:`Mutu Beton ${mutuLabel} (Tidak Bertulang)  ·  fc' ${koef.fc} MPa  ·  Koefisien SNI 7394:2008 ${koef.ref}`,
          t:'s', s:{ font:{name:'Arial',sz:9,color:{rgb:WHITE}},
                     fill:FL(TEAL), alignment:AL('center','center',true),
                     border:BD('thin') } },
        CE(),CE(),CE(),CE(),CE()
    ]); merge(r,0,r,5); r++;

    pushEmpty(1);

    // ── Info Proyek ──────────────────────────────────────────
    const infoRows = [
        ['Nama Proyek',   namaProyek,              'Tahun Anggaran', tahunAng],
        ['Lokasi Proyek', lokasiProyek,             'Tanggal',        tgl],
        ['Penyusun RAB',  penyusun||'—',            'Mutu Beton',
         `${mutuLabel}  ·  fc' ${koef.fc} MPa  ·  w/c = ${koef.wc}`],
    ];
    infoRows.forEach(([l1,v1,l2,v2]) => {
        const brd = BD('thin');
        aoa.push([
            { v:l1, t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:'475569'}},
              fill:FL(SL_LT), alignment:AL('left'), border:brd } },
            { v:v1, t:'s', s:{font:{name:'Arial',sz:9}, fill:FL(WHITE),
              alignment:AL('left','center',true), border:brd } },
            CE(),
            { v:l2, t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:'475569'}},
              fill:FL(SL_LT), alignment:AL('left'), border:brd } },
            { v:v2, t:'s', s:{font:{name:'Arial',sz:9}, fill:FL(WHITE),
              alignment:AL('left','center',true), border:brd } },
            CE(),
        ]);
        merge(r,1,r,2); merge(r,4,r,5); r++;
    });

    pushEmpty(1);

    // ── Dimensi ──────────────────────────────────────────────
    const dimRows = [
        ['Panjang Jalan', `${fmtNum(panjang)} m`,
         'Volume Beton',  `${fmtNum(volBeton, 3)} m³`],
        ['Lebar Jalan',   `${fmtNum(lebar)} m`,
         'Luas Area',     `${fmtNum(area, 2)} m²`],
        ['Tebal Beton',   `${fmtNum(tebal*100, 0)} cm`,
         'Harga per m²',  `Rp ${fmtNum(Math.round(hargaPerM2))}`],
    ];
    dimRows.forEach(([l1,v1,l2,v2]) => {
        const brd = { top:{style:'thin',color:{rgb:'5EEAD4'}},
                      bottom:{style:'thin',color:{rgb:'5EEAD4'}},
                      left:{style:'thin',color:{rgb:'5EEAD4'}},
                      right:{style:'thin',color:{rgb:'5EEAD4'}} };
        aoa.push([
            { v:l1, t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
              fill:FL(TEAL_LT), alignment:AL('left'), border:brd } },
            { v:v1, t:'s', s:{font:{name:'Arial',sz:9,bold:true},
              fill:FL(WHITE), alignment:AL('right'), border:brd } },
            CE(),
            { v:l2, t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
              fill:FL(TEAL_LT), alignment:AL('left'), border:brd } },
            { v:v2, t:'s', s:{font:{name:'Arial',sz:9,bold:true},
              fill:FL(WHITE), alignment:AL('right'), border:brd } },
            CE(),
        ]);
        merge(r,1,r,2); merge(r,4,r,5); r++;
    });

    pushEmpty(1);

    // ── Header kolom tabel ───────────────────────────────────
    const HDR_ROW = r;
    const hdrCols = [
        ['No','center'], ['Uraian Pekerjaan','left'],
        ['Volume','center'], ['Sat.','center'],
        ['Harga Satuan\n(Rp)','center'], ['Jumlah\n(Rp)','center']
    ];
    aoa.push(hdrCols.map(([v,ha]) => ({
        v, t:'s',
        s:{ font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
            fill:FL(NAVY), alignment:AL(ha,'center',true),
            border:{ top:{style:'medium',color:{rgb:'0F172A'}},
                     bottom:{style:'medium',color:{rgb:'0F172A'}},
                     left:{style:'thin',color:{rgb:'475569'}},
                     right:{style:'thin',color:{rgb:'475569'}} } }
    }))); r++;

    // ── Baris data RAB ────────────────────────────────────────
    let alt = false;
    rows.forEach(row => {
        const rtype = row.type || '';
        const bdTeal = {
            top:{style:'thin',color:{rgb:'5EEAD4'}},
            bottom:{style:'thin',color:{rgb:'5EEAD4'}},
            left:{style:'medium',color:{rgb:'0D9488'}},
            right:{style:'thin',color:{rgb:'5EEAD4'}}
        };
        const bdTealR = { ...bdTeal, left:{style:'thin',color:{rgb:'5EEAD4'}},
                          right:{style:'medium',color:{rgb:'0D9488'}} };
        const bdGray = {
            top:{style:'hair',color:{rgb:'E2E8F0'}}, bottom:{style:'hair',color:{rgb:'E2E8F0'}},
            left:{style:'medium',color:{rgb:'94A3B8'}}, right:{style:'medium',color:{rgb:'94A3B8'}}
        };
        const bdItem = {
            top:{style:'hair',color:{rgb:'E2E8F0'}}, bottom:{style:'hair',color:{rgb:'E2E8F0'}},
            left:{style:'medium',color:{rgb:'94A3B8'}}, right:{style:'thin',color:{rgb:'CBD5E1'}}
        };
        const bdItemR = { ...bdItem, left:{style:'thin',color:{rgb:'CBD5E1'}},
                          right:{style:'medium',color:{rgb:'94A3B8'}} };

        const volNum = parseFloat((row.vol||'0').toString().replace(/\./g,'').replace(',','.')) || 0;
        const hsNum  = unFmt(row.hs);
        const jmlNum = unFmt(row.jml);

        if (rtype === 'header') {
            aoa.push([
                { v:row.no||'', t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL}},
                  fill:FL(YEL_LT), alignment:AL('center'), border:bdTeal } },
                { v:row.uraian||'', t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
                  fill:FL(YEL_LT), alignment:AL('left','center',true), border:BD('thin')} },
                { v:volNum, t:'n', z:FMT_D3, s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
                  fill:FL(YEL_LT), alignment:AL('right'), border:BD('thin')} },
                { v:row.sat||'', t:'s', s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
                  fill:FL(YEL_LT), alignment:AL('center'), border:BD('thin')} },
                { v:hsNum, t:'n', z:FMT_IDR, s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
                  fill:FL(YEL_LT), alignment:AL('right'), border:BD('thin')} },
                { v:jmlNum, t:'n', z:FMT_IDR, s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
                  fill:FL(YEL_LT), alignment:AL('right'), border:bdTealR} },
            ]); alt = false;

        } else if (rtype === 'sub') {
            aoa.push([
                { v:'', t:'s', s:{fill:FL(SL_LT), border:bdGray} },
                { v:`  ${row.uraian||''}`, t:'s',
                  s:{font:{name:'Arial',sz:8,italic:true,color:{rgb:'64748B'}},
                     fill:FL(SL_LT), alignment:AL('left','center',true), border:bdGray} },
                CE(),CE(),CE(),CE()
            ]);
            merge(r,1,r,5); alt = !alt;

        } else {
            const bg = alt ? SL_LT : WHITE;
            aoa.push([
                { v:'', t:'s', s:{fill:FL(bg), border:bdItem} },
                { v:`  ${row.uraian||''}`, t:'s',
                  s:{font:{name:'Arial',sz:9,color:{rgb:'374151'}},
                     fill:FL(bg), alignment:AL('left','center',true), border:BD('hair')} },
                { v:volNum, t:'n', z:FMT_D3,
                  s:{font:{name:'Arial',sz:9},fill:FL(bg),alignment:AL('right'),border:BD('hair')} },
                { v:row.sat||'', t:'s',
                  s:{font:{name:'Arial',sz:9,color:{rgb:'475569'}},fill:FL(bg),
                     alignment:AL('center'),border:BD('hair')} },
                { v:hsNum, t:'n', z:FMT_IDR,
                  s:{font:{name:'Arial',sz:9},fill:FL(bg),alignment:AL('right'),border:BD('hair')} },
                { v:jmlNum, t:'n', z:FMT_IDR,
                  s:{font:{name:'Arial',sz:9},fill:FL(bg),alignment:AL('right'),border:bdItemR} },
            ]); alt = !alt;
        }
        r++;
    });

    // Garis penutup tabel
    const LINE_CLR = '334155';
    aoa.push(Array(6).fill(null).map(() =>
        ({v:'',t:'s',s:{border:{top:{style:'medium',color:{rgb:LINE_CLR}}}}})
    )); r++;

    // ── SUBTOTAL ─────────────────────────────────────────────
    const bdST = { top:{style:'medium',color:{rgb:'1E293B'}},
                   bottom:{style:'medium',color:{rgb:'1E293B'}},
                   left:{style:'medium',color:{rgb:'1E293B'}},
                   right:{style:'hair',color:{rgb:'475569'}} };
    const bdSTR = { ...bdST, left:{style:'hair',color:{rgb:'475569'}},
                    right:{style:'medium',color:{rgb:'1E293B'}} };
    aoa.push([
        { v:'SUBTOTAL BIAYA KONSTRUKSI', t:'s',
          s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
             fill:FL(SLATE), alignment:AL('right'), border:bdST} },
        CE(),CE(),CE(),CE(),
        { v:subtotal, t:'n', z:FMT_IDR,
          s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
             fill:FL(SLATE), alignment:AL('right'), border:bdSTR} }
    ]);
    merge(r,0,r,4); r++;

    // ── OH / PROFIT / PPN ────────────────────────────────────
    const compRows: any[] = [];
    if (pctOH  > 0) compRows.push([`Overhead (${fmtNum(pctOH*100, 1)}% × Subtotal)`,   ohVal,  ORG_LT, AMBER]);
    if (pctPrf > 0) compRows.push([`Profit (${fmtNum(pctPrf*100, 1)}% × Subtotal)`,    prfVal, ORG_LT, AMBER]);
    if (pctOH>0 && pctPrf>0)
        compRows.push([`Total OH + Profit (${fmtNum((pctOH+pctPrf)*100, 1)}% × Subtotal)`,
                       ohVal+prfVal, 'FED7AA', 'C2410C']);
    if (pctPPN > 0)
        compRows.push([`PPN (${fmtNum(pctPPN*100, 1)}% × (Subtotal+OH+Profit))`, ppnVal, RED_LT, RED_D]);

    compRows.forEach(([lbl, val, bg_c, fg_c]) => {
        const bdC  = { top:{style:'hair',color:{rgb:'E2E8F0'}},
                       bottom:{style:'hair',color:{rgb:'E2E8F0'}},
                       left:{style:'medium',color:{rgb:'94A3B8'}},
                       right:{style:'hair',color:{rgb:'E2E8F0'}} };
        const bdCR = { ...bdC, left:{style:'hair',color:{rgb:'E2E8F0'}},
                       right:{style:'medium',color:{rgb:'94A3B8'}} };
        aoa.push([
            { v:lbl, t:'s',
              s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:fg_c}},
                 fill:FL(bg_c), alignment:AL('right'), border:bdC} },
            CE(),CE(),CE(),CE(),
            { v:val, t:'n', z:FMT_IDR,
              s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:fg_c}},
                 fill:FL(bg_c), alignment:AL('right'), border:bdCR} }
        ]);
        merge(r,0,r,4); r++;
    });

    // ── GRAND TOTAL ──────────────────────────────────────────
    const bdGT  = bdThickTeal;
    const bdGTR = bdThickTeal;
    aoa.push([
        { v:'TOTAL AKHIR RAB  (termasuk OH, Profit & PPN)', t:'s',
          s:{font:{name:'Arial',sz:12,bold:true,color:{rgb:WHITE}},
             fill:FL(TEAL), alignment:AL('right'), border:bdGT} },
        CE(),CE(),CE(),CE(),
        { v:grandTotal, t:'n', z:FMT_IDR,
          s:{font:{name:'Arial',sz:12,bold:true,color:{rgb:WHITE}},
             fill:FL(TEAL), alignment:AL('right'), border:bdGTR} }
    ]);
    merge(r,0,r,4); r++;

    // Harga per m²
    aoa.push([
        { v:'Harga Satuan per m² Jalan', t:'s',
          s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
             fill:FL(TEAL_LT), alignment:AL('right'),
             border:{top:{style:'thin',color:{rgb:'5EEAD4'}},
                     bottom:{style:'thin',color:{rgb:'5EEAD4'}},
                     left:{style:'medium',color:{rgb:'5EEAD4'}},
                     right:{style:'hair',color:{rgb:'5EEAD4'}}} } },
        CE(),CE(),CE(),CE(),
        { v:Math.round(hargaPerM2), t:'n', z:FMT_IDR,
          s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
             fill:FL(TEAL_LT), alignment:AL('right'),
             border:{top:{style:'thin',color:{rgb:'5EEAD4'}},
                     bottom:{style:'thin',color:{rgb:'5EEAD4'}},
                     left:{style:'hair',color:{rgb:'5EEAD4'}},
                     right:{style:'medium',color:{rgb:'5EEAD4'}}} } }
    ]);
    merge(r,0,r,4); r++;

    // Spacer + tanda tangan
    pushEmpty(2);
    aoa.push([
        {v:'Mengetahui,',t:'s',s:{font:{name:'Arial',sz:9,color:{rgb:'475569'}},
         alignment:AL('center','center',false)}},
        CE(),CE(),
        {v:'Dibuat Oleh,',t:'s',s:{font:{name:'Arial',sz:9,color:{rgb:'475569'}},
         alignment:AL('center','center',false)}},
        CE(),CE()
    ]);
    merge(r,0,r,2); merge(r,3,r,5); r++;
    aoa.push([
        {v:'Kepala Desa / PPK',t:'s',s:{font:{name:'Arial',sz:8,italic:true,color:{rgb:'94A3B8'}},
         alignment:AL('center','center',false)}},
        CE(),CE(),
        {v:'Penyusun RAB',t:'s',s:{font:{name:'Arial',sz:8,italic:true,color:{rgb:'94A3B8'}},
         alignment:AL('center','center',false)}},
        CE(),CE()
    ]);
    merge(r,0,r,2); merge(r,3,r,5); r++;
    pushEmpty(3);
    aoa.push([
        {v:'(  _______________________  )',t:'s',s:{font:{name:'Arial',sz:9},alignment:AL('center','center',false)}},
        CE(),CE(),
        {v:`(  ${penyusun||'_______________________'}  )`,t:'s',
         s:{font:{name:'Arial',sz:9,bold:true},alignment:AL('center','center',false)}},
        CE(),CE()
    ]);
    merge(r,0,r,2); merge(r,3,r,5); r++;

    pushEmpty(1);

    // Catatan koef SNI
    const noteText = `Sumber koefisien: SNI 7394:2008  |  ${koef.ref} Mutu ${mutuLabel}  |  ` +
        `PC=${koef.pcKg} kg/m³ = ${fmtNum(koef.semen, 3)} zak (@40kg)  ·  ` +
        `Pasir=${fmtNum(koef.pasir, 5)} m³/m³ (BJ 1.400 kg/m³)  ·  ` +
        `Batu Pecah=${fmtNum(koef.batu, 5)} m³/m³ (BJ 1.500 kg/m³)  ·  ` +
        `Air=${koef.air} ltr/m³  ·  ` +
        `Upah: Pekerja ${upahKoef.pekerja} · Tukang ${upahKoef.tukang} · ` +
        `KepTukang ${upahKoef.kepalaTukang} · Mandor ${upahKoef.mandor} OH/m³`;
    aoa.push([
        {v:noteText, t:'s', s:{font:{name:'Arial',sz:7.5,italic:true,color:{rgb:'94A3B8'}},
         fill:FL(SL_LT), alignment:AL('left','center',true)} },
        CE(),CE(),CE(),CE(),CE()
    ]);
    merge(r,0,r,5); r++;
    const LAST_ROW = r - 1;

    // ── Build worksheet ──────────────────────────────────────
    const ws = XLSX.utils.aoa_to_sheet(aoa.map(row => row.map(c => {
        if (!c || c.v === undefined || c.v === '') return null;
        return c.v;
    })));

    // Apply cell styles
    aoa.forEach((row, ri) => {
        row.forEach((cell, ci) => {
            if (!cell || !cell.s) return;
            const addr = XLSX.utils.encode_cell({r:ri, c:ci});
            if (!ws[addr]) ws[addr] = { v:'', t:'s' };
            ws[addr].s = cell.s;
            if (cell.z) ws[addr].z = cell.z;
            if (cell.t) ws[addr].t = cell.t;
            if (cell.v !== undefined) ws[addr].v = cell.v;
        });
    });

    ws['!cols'] = [
        {wch:5},   // A: No
        {wch:52},  // B: Uraian
        {wch:13},  // C: Volume
        {wch:8},   // D: Satuan
        {wch:20},  // E: Harga Satuan
        {wch:22},  // F: Jumlah
    ];
    ws['!merges'] = merges;

    // Row heights
    ws['!rows'] = [];
    for (let i = 0; i <= LAST_ROW; i++) {
        if (i === 0) ws['!rows'][i] = { hpt: 32 };
        else if (i === 1) ws['!rows'][i] = { hpt: 18 };
        else if (i === HDR_ROW) ws['!rows'][i] = { hpt: 28 };
        else ws['!rows'][i] = { hpt: 18 };
    }

    // Print setup A4
    ws['!pageSetup'] = {
        paperSize: 9,       // A4
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalDpi: 300,
        verticalDpi: 300,
    };
    ws['!margins'] = { left:0.55, right:0.40, top:0.75, bottom:0.65, header:0.3, footer:0.3 };
    ws['!printHeader'] = HDR_ROW;

    // ══════════════════════════════════════════════════════════
    // SHEET 2 — RINGKASAN
    // ══════════════════════════════════════════════════════════
    const s2: any[][] = [];
    const m2: any[] = [];
    let r2 = 0;
    const p2 = (...cells: any[]) => { s2.push(cells); r2++; };
    const pe2 = (n=1) => {
        for(let i=0;i<n;i++){
            s2.push([{v:'',t:'s',s:{fill:{patternType:'none'}}},{v:'',t:'s',s:{fill:{patternType:'none'}}}]);
            r2++;
        }
    };
    const mg2 = (rs: number,c1: number,c2: number) => m2.push({s:{r:rs,c:c1},e:{r:rs,c:c2}});

    p2( {v:'RINGKASAN RAB',t:'s',s:{font:{name:'Arial',sz:14,bold:true,color:{rgb:WHITE}},
         fill:FL(NAVY),alignment:AL('center'),border:BDM()}},CE() );
    mg2(r2-1,0,1);
    p2( {v:namaProyek,t:'s',s:{font:{name:'Arial',sz:9,color:{rgb:WHITE}},
         fill:FL(TEAL),alignment:AL('center')}},CE() );
    mg2(r2-1,0,1);
    p2( {v:`Mutu ${mutuLabel}  ·  fc' ${koef.fc} MPa  ·  TA ${tahunAng}  ·  SNI 7394:2008`,
         t:'s',s:{font:{name:'Arial',sz:8.5,color:{rgb:SL_MED}},
         fill:FL(SLATE),alignment:AL('center')}},CE() );
    mg2(r2-1,0,1);
    pe2(1);

    // Header
    p2( {v:'Komponen Biaya',t:'s',s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
         fill:FL(NAVY),alignment:AL('center'),border:bdThickTeal}},
        {v:'Nilai (Rp)',t:'s',s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
         fill:FL(NAVY),alignment:AL('center'),border:bdThickTeal}} );

    const comp2: any[] = [['Subtotal Biaya Konstruksi',subtotal,SL_LT,'0F172A',false]];
    if (pctOH  > 0) comp2.push([`+ Overhead (${fmtNum(pctOH*100, 1)}% × Subtotal)`,  ohVal,  ORG_LT, AMBER, false]);
    if (pctPrf > 0) comp2.push([`+ Profit (${fmtNum(pctPrf*100, 1)}% × Subtotal)`,   prfVal, ORG_LT, AMBER, false]);
    if (pctOH>0 && pctPrf>0)
        comp2.push([`= Total OH + Profit (${fmtNum((pctOH+pctPrf)*100, 1)}%)`,ohVal+prfVal,'FED7AA','C2410C',true]);
    if (pctPPN > 0) comp2.push([`+ PPN (${fmtNum(pctPPN*100, 1)}%)`,ppnVal,RED_LT,RED_D,false]);
    comp2.push(['TOTAL AKHIR RAB', grandTotal, TEAL, WHITE, true]);

    comp2.forEach(([lbl,val,bg_c,fg_c,isBold]) => {
        const sz = isBold ? 11 : 9;
        const brd = isBold ? bdThickTeal : BD('thin');
        p2( {v:lbl,t:'s',s:{font:{name:'Arial',sz,bold:isBold,color:{rgb:fg_c}},
             fill:FL(bg_c),alignment:AL('left','center',true),border:brd}},
            {v:val,t:'n',z:FMT_IDR,s:{font:{name:'Arial',sz,bold:isBold,color:{rgb:fg_c}},
             fill:FL(bg_c),alignment:AL('right'),border:brd}} );
    });

    pe2(1);
    p2( {v:'Harga Satuan per m² Jalan',t:'s',s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
         fill:FL(TEAL_LT),alignment:AL('left'),border:BD('thin')}},
        {v:Math.round(hargaPerM2),t:'n',z:FMT_IDR,
         s:{font:{name:'Arial',sz:9,bold:true,color:{rgb:TEAL_D}},
         fill:FL(TEAL_LT),alignment:AL('right'),border:BD('thin')}} );
    pe2(1);

    // Info teknis
    p2( {v:'INFORMASI TEKNIS & DIMENSI',t:'s',s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
         fill:FL(NAVY),alignment:AL('center'),border:BDM()}},CE() );
    mg2(r2-1,0,1);
    [['Panjang Jalan (m)',fmtNum(panjang)],
     ['Lebar Jalan (m)', fmtNum(lebar)],
     ['Tebal Beton (cm)',fmtNum(tebal*100, 0)],
     ['Volume Beton (m³)',fmtNum(volBeton, 3)],
     ['Luas Area (m²)',  fmtNum(area, 2)],
     ['Mutu Beton',      mutuLabel],
    ].forEach(([l,v],i) => {
        const bg = i%2===0?SL_LT:WHITE;
        p2( {v:l,t:'s',s:{font:{name:'Arial',sz:9},fill:FL(bg),alignment:AL('left'),border:BD('thin')}},
            {v:v,t:'s',s:{font:{name:'Arial',sz:9,bold:true},fill:FL(bg),alignment:AL('right'),border:BD('thin')}} );
    });

    pe2(1);
    p2( {v:`KOEFISIEN SNI 7394:2008 — ${mutuLabel} (${koef.ref})`,t:'s',
         s:{font:{name:'Arial',sz:10,bold:true,color:{rgb:WHITE}},
         fill:FL(NAVY),alignment:AL('center'),border:BDM()}},CE() );
    mg2(r2-1,0,1);
    [['Semen Portland (kg/m³)',String(koef.pcKg)],
     ['Semen (zak/m³ @40 kg)',fmtNum(koef.semen, 3)],
     ['Pasir Beton (m³/m³)',fmtNum(koef.pasir, 5)],
     ['Batu Pecah 2-3 cm (m³/m³)',fmtNum(koef.batu, 5)],
     ['Air (ltr/m³)',String(koef.air)],
     ['BJ Pasir — SNI hal.3','1.400 kg/m³'],
     ['BJ Batu Pecah — SNI hal.3','1.500 kg/m³'],
     ['Upah Pekerja (OH/m³)',String(upahKoef.pekerja)],
     ['Upah Tukang Batu (OH/m³)',String(upahKoef.tukang)],
     ['Upah Kepala Tukang (OH/m³)',String(upahKoef.kepalaTukang)],
     ['Upah Mandor (OH/m³)',String(upahKoef.mandor)],
    ].forEach(([l,v],i) => {
        const bg = i%2===0?SL_LT:WHITE;
        p2( {v:l,t:'s',s:{font:{name:'Arial',sz:9},fill:FL(bg),alignment:AL('left'),border:BD('thin')}},
            {v:v,t:'s',s:{font:{name:'Arial',sz:9,bold:true},fill:FL(bg),alignment:AL('right'),border:BD('thin')}} );
    });

    const ws2 = XLSX.utils.aoa_to_sheet(s2.map(row => row.map(c => c&&c.v!==undefined?c.v:null)));
    s2.forEach((row, ri) => {
        row.forEach((cell, ci) => {
            if (!cell || !cell.s) return;
            const addr = XLSX.utils.encode_cell({r:ri, c:ci});
            if (!ws2[addr]) ws2[addr] = {v:'',t:'s'};
            ws2[addr].s = cell.s;
            if (cell.z) ws2[addr].z = cell.z;
            if (cell.t) ws2[addr].t = cell.t;
            if (cell.v !== undefined) ws2[addr].v = cell.v;
        });
    });
    ws2['!cols'] = [{wch:42},{wch:26}];
    ws2['!merges'] = m2;
    ws2['!pageSetup'] = { paperSize:9, orientation:'portrait', fitToPage:true, fitToWidth:1, fitToHeight:0 };
    ws2['!margins'] = { left:0.6, right:0.5, top:0.75, bottom:0.65, header:0.3, footer:0.3 };

    // ── Export ───────────────────────────────────────────────
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RAB Lengkap');
    XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan');

    const fname = `RAB_${namaProyek.replace(/[\s\/\\:*?"<>|]/g,'_').substring(0,35)}_${mutuLabel.replace('-','')}_${tahunAng}.xlsx`;
    XLSX.writeFile(wb, fname, { bookType:'xlsx', type:'binary', cellStyles:true });
}

import { CalculationResult } from '../types';
import { fmt, fmtNum } from './format';

export function printPDF(result: CalculationResult | null) {
    if (!result) { 
        alert('Hitung RAB terlebih dahulu sebelum mencetak.'); 
        return; 
    }
    const { rows, subtotal, ohVal, prfVal, ppnVal, grandTotal,
            pctOH, pctPrf, pctPPN, namaProyek, lokasiProyek,
            tahunAng, mutuLabel, penyusun, panjang, lebar, tebal, hargaPerM2, koef, upahKoef } = result;
    const tgl = new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

    let trs = '';
    rows.forEach(r => {
        if (r.type === 'header') {
            trs += `<tr class="h"><td>${r.no}</td><td>${r.uraian}</td>
                <td class="r">${r.vol}</td><td>${r.sat}</td>
                <td class="r">${fmt(r.hs)}</td><td class="r">${fmt(r.jml)}</td></tr>`;
        } else if (r.type === 'sub') {
            trs += `<tr class="s"><td colspan="6">&nbsp;&nbsp;— ${r.uraian} —</td></tr>`;
        } else {
            trs += `<tr><td></td><td style="padding-left:16px">${r.uraian}</td>
                <td class="r">${r.vol}</td><td>${r.sat}</td>
                <td class="r">${fmt(r.hs)}</td><td class="r">${fmt(r.jml)}</td></tr>`;
        }
    });
    trs += `<tr class="tot"><td colspan="5" class="r">SUBTOTAL PEKERJAAN</td><td class="r">Rp ${fmt(subtotal)}</td></tr>`;
    if (pctOH>0)  trs += `<tr class="oh"><td colspan="5" class="r">Overhead (${fmtNum(pctOH*100, 1)}% × Subtotal)</td><td class="r">Rp ${fmt(ohVal)}</td></tr>`;
    if (pctPrf>0) trs += `<tr class="oh"><td colspan="5" class="r">Profit (${fmtNum(pctPrf*100, 1)}% × Subtotal)</td><td class="r">Rp ${fmt(prfVal)}</td></tr>`;
    if (pctOH>0 && pctPrf>0) trs += `<tr class="oh" style="font-weight:700"><td colspan="5" class="r">Total OH + Profit (${fmtNum((pctOH+pctPrf)*100, 1)}% × Subtotal)</td><td class="r">Rp ${fmt(ohVal+prfVal)}</td></tr>`;
    if (pctPPN>0) trs += `<tr class="oh"><td colspan="5" class="r">PPN (${fmtNum(pctPPN*100, 1)}%)</td><td class="r">Rp ${fmt(ppnVal)}</td></tr>`;
    trs += `<tr class="grand"><td colspan="5" class="r">TOTAL AKHIR RAB</td><td class="r">Rp ${fmt(grandTotal)}</td></tr>`;

    const html = `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8">
<title>RAB - ${namaProyek}</title>
<style>
  @page { size: A4; margin: 18mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; margin:0; padding:0; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #111; }
  .doc-header { text-align:center; border-bottom: 2.5px solid #0D9488; padding-bottom:10px; margin-bottom:14px; }
  .doc-header h1 { font-size:13pt; font-weight:800; color:#0D9488; letter-spacing:-0.01em; }
  .doc-header p { font-size:9pt; color:#555; margin-top:2px; }
  .sni-note { font-size:8pt; color:#0F766E; background:#F0FDFA; border:1px solid #99F6E4; border-radius:4px; padding:4px 10px; margin-bottom:12px; text-align:center; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:2px 24px; margin-bottom:14px; font-size:9pt; }
  .info-grid .lbl { font-weight:700; color:#555; }
  .stats { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
  .stat { border:1px solid #ddd; border-radius:5px; padding:6px 12px; font-size:8.5pt; min-width:100px; }
  .stat .sv { font-size:11pt; font-weight:800; color:#0D9488; }
  .stat .sl { font-size:7.5pt; color:#888; text-transform:uppercase; letter-spacing:.04em; }
  table { width:100%; border-collapse:collapse; font-size:8.5pt; }
  th { background:#0D9488; color:#fff; font-weight:700; padding:7px 8px; text-align:left; font-size:8pt; letter-spacing:.03em; text-transform:uppercase; }
  th:not(:first-child) { border-left:1px solid rgba(255,255,255,0.2); }
  td { padding:6px 8px; border-bottom:1px solid #eee; vertical-align:middle; }
  tr:hover td { background:#F0FDFA; }
  tr.h td { background:#F0FDFA; font-weight:700; color:#0F766E; }
  tr.s td { background:#F8FAFC; color:#888; font-style:italic; font-size:8pt; padding:4px 8px; }
  tr.tot td { background:#0F172A; color:#fff; font-weight:700; }
  tr.oh td { background:#FEF3C7; color:#92400E; }
  tr.grand td { background:#0D9488; color:#fff; font-weight:800; font-size:10pt; }
  .r { text-align:right; font-family:'Courier New',monospace; }
  .signatures { display:flex; justify-content:space-between; margin-top:40px; font-size:9pt; }
  .sig-block { text-align:center; }
  .sig-title { color:#555; margin-bottom:52px; }
  .sig-line { border-top:1px solid #333; padding-top:4px; font-weight:700; min-width:160px; }
  .sig-sub { font-size:8pt; color:#666; }
  .footer { margin-top:16px; text-align:center; font-size:8pt; color:#aaa; border-top:1px solid #eee; padding-top:8px; }
  .koef-table { margin-bottom:14px; font-size:8pt; border:1px solid #ddd; }
  .koef-table th { background:#f1f5f9; color:#475569; font-size:7.5pt; }
  .koef-table td { padding:4px 8px; background:#fff; color:#374151; }
</style>
</head><body>
<div class="doc-header">
  <h1>RENCANA ANGGARAN BIAYA (RAB)</h1>
  <p>Pembangunan Jalan Rabat Beton ${mutuLabel} Tidak Bertulang</p>
</div>
<div class="sni-note">✅ Koefisien berdasarkan SNI 7394:2008 — Tata Cara Perhitungan Harga Satuan Pekerjaan Beton</div>
<div class="info-grid">
  <div><span class="lbl">Nama Proyek</span><br>${namaProyek}</div>
  <div><span class="lbl">Tahun Anggaran</span><br>${tahunAng}</div>
  <div><span class="lbl">Lokasi</span><br>${lokasiProyek}</div>
  <div><span class="lbl">Tanggal Disusun</span><br>${tgl}</div>
</div>
<div class="stats">
  <div class="stat"><div class="sl">Panjang</div><div class="sv">${panjang} m</div></div>
  <div class="stat"><div class="sl">Lebar</div><div class="sv">${lebar} m</div></div>
  <div class="stat"><div class="sl">Tebal</div><div class="sv">${fmtNum(tebal*100, 0)} cm</div></div>
  <div class="stat"><div class="sl">Volume Beton</div><div class="sv">${fmtNum(panjang*lebar*tebal, 3)} m³</div></div>
  <div class="stat"><div class="sl">Harga / m²</div><div class="sv">Rp ${fmt(hargaPerM2)}</div></div>
</div>
<table>
  <thead><tr>
    <th style="width:4%">No</th>
    <th style="width:38%">Uraian Pekerjaan</th>
    <th style="width:10%;text-align:right">Volume</th>
    <th style="width:8%">Sat.</th>
    <th style="width:19%;text-align:right">Harga Satuan (Rp)</th>
    <th style="width:21%;text-align:right">Jumlah (Rp)</th>
  </tr></thead>
  <tbody>${trs}</tbody>
</table>
<div style="margin-top:12px;font-size:7.5pt;color:#888;border-top:1px solid #eee;padding-top:6px">
  Koefisien bahan beton ${mutuLabel} (SNI 7394:2008): Semen ${koef.pcKg} kg/m³ = ${fmtNum(koef.semen, 3)} zak/m³ (@40kg) · Pasir ${fmtNum(koef.pasir, 5)} m³/m³ · Batu Pecah ${fmtNum(koef.batu, 5)} m³/m³ · Air ${koef.air} ltr/m³ &nbsp;|&nbsp;
  Koefisien upah: Pekerja ${fmtNum(upahKoef.pekerja, 3)} OH · Tukang ${fmtNum(upahKoef.tukang, 3)} OH · Kep.Tukang ${fmtNum(upahKoef.kepalaTukang, 3)} OH · Mandor ${fmtNum(upahKoef.mandor, 3)} OH per m³ beton
</div>
<div class="signatures">
  <div class="sig-block">
    <div class="sig-title">Mengetahui,<br>Kepala Desa / PPK</div>
    <div class="sig-line">( _________________________ )</div>
    <div class="sig-sub">Nama Terang &amp; Jabatan</div>
  </div>
  <div class="sig-block">
    <div class="sig-title">Disusun Oleh,<br>Penyusun RAB</div>
    <div class="sig-line">( ${penyusun || '________________________'} )</div>
    <div class="sig-sub">Nama Terang &amp; Jabatan</div>
  </div>
</div>
<div class="footer">© ${new Date().getFullYear()} RAB Jalan Rabat Beton — Koefisien SNI 7394:2008 | Dibuat dengan Kalkulator RAB Digital</div>
</body></html>`;

    const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    if (!win) {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `RAB_${namaProyek.replace(/\s+/g,'_')}.html`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        alert('Pop-up diblokir. File HTML cetak telah diunduh — buka dan Ctrl+P untuk cetak/PDF.');
        return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
}

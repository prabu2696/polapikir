# DESIGN.md — Pola Pikir MI

## Product

Pola Pikir MI adalah web asesmen pendidikan untuk Guru MI dan Murid MI. Pengalaman inti: peserta masuk tanpa login, mengisi identitas, mengerjakan asesmen, melihat nilai 0–100, lalu mengunduh laporan PDF.

Karakter produk: **editorial luxury, humanis, tenang, terpercaya, presisi, hangat, dan premium tanpa dekorasi berlebihan.**

Desain harus terasa seperti produk pendidikan yang dibuat dengan serius, bukan portal pemerintah generik, bukan dashboard SaaS generik, dan bukan hasil generator AI.

## Visual Direction

### Palette
- Canvas / warm paper: `#F7F5F0`
- Secondary paper: `#FAF9F6`
- Surface: `#FFFDFC`
- Subtle surface: `#F1EEE7`
- Primary text / charcoal: `#2D2D2D`
- Secondary text: `#68645D`
- Quiet text: `#89837A`
- Deep Forest: `#0D3B23`
- Forest hover: `#123F29`
- Forest tint: `#E9F0EB`
- Forest soft border: `#C9D7CD`
- Muted Gold: `#C59B27`
- Gold tint: `#F5EEDC`
- Warm hairline: `#DDD8CF`
- Strong hairline: `#CFC8BC`
- Error: `#8A3A35`
- Error tint: `#F5E9E7`

Deep Forest digunakan untuk aksi dan penegasan utama. Muted Gold hanya untuk highlight kecil, nomor, marker progres, atau detail editorial.

### Typography
**Display / editorial serif:** Newsreader  
Fallback: Georgia, "Times New Roman", serif

Gunakan untuk:
- nama aplikasi
- heading utama
- heading hasil
- angka skor 0–100

**UI / questionnaire sans:** Plus Jakarta Sans  
Fallback: "Segoe UI", Arial, sans-serif

Gunakan untuk:
- pertanyaan
- jawaban
- form
- tombol
- navigasi
- tabel
- metadata

Body desktop minimum 15–16px. Body mobile 16px. Pertanyaan 16–18px desktop dan 17–19px mobile. Line-height teks minimum 1.6.

Jika webfont digunakan, muat hanya weight yang diperlukan, gunakan `font-display: swap`, dan hindari dependency font yang tidak perlu.

## Anti-Slop Boundaries

Hindari:
- gradient biru/ungu atau glow dekoratif
- glassmorphism / backdrop blur
- box-shadow tebal
- card putih melayang di semua section
- warna hijau/kuning murni
- badge kapsul berlebihan
- bento grid
- hero SaaS generik
- statistik/testimoni palsu
- ikon generik untuk setiap kalimat
- radius besar pada semua komponen
- floating/bounce/parallax
- dekorasi tanpa fungsi

Prefer:
- border hairline 1px
- whitespace luas namun terukur
- hierarchy berbasis tipografi
- struktur editorial
- alignment presisi
- state interaksi yang jelas
- motion singkat berbasis transform/opacity

## Layout System

- Content client: 1120–1180px maksimum.
- Reading width form/hasil: 680–760px.
- Ritme spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Radius small controls: 8–10px.
- Radius form controls: 10–12px.
- Radius major sections: 12–16px.
- Pill hanya untuk status kecil yang memang membutuhkan bentuk status.
- Border lebih diutamakan daripada shadow.

## Topbar

Topbar adalah satu-satunya area identitas produk yang persisten:
- logo Kementerian Agama
- Pola Pikir MI
- descriptor pendek bila diperlukan

Tidak memakai blur. Tidak memakai shadow besar. Logo tidak diulang di hero.

## Landing / Dashboard Awal

Landing harus terasa editorial, bukan landing page SaaS.

Hero:
- heading serif kuat tetapi tidak oversized
- copy singkat dan tenang
- tanpa eyebrow badge generik
- tanpa mockup palsu
- tanpa statistik palsu
- tanpa glow

Pemilihan Guru/Murid menggunakan **editorial action rows / role panels**, bukan dua floating cards generik:
- hairline border
- judul role jelas
- deskripsi singkat
- area klik besar
- hover/tap subtle

Informasi 01 / 02 / 03 menggunakan editorial strip/list, bukan feature-card grid generik:
1. Tanpa login peserta
2. Nyaman di semua layar
3. Laporan otomatis

Nomor memiliki kolom fixed-width agar tidak menabrak teks.

## Identity Form

Form identitas harus terasa seperti form editorial premium:
- heading serif ukuran sedang
- label sans
- input tinggi sekitar 50–54px
- hairline border hangat
- focus state Deep Forest
- satu primary action
- tidak ada card di dalam card
- tidak ada shadow berat

Nama tetap uppercase sesuai logika aplikasi. Normalisasi sekolah tetap dipertahankan. Murid wajib memilih kelas. Input mobile minimal 16px.

## Assessment

### Desktop
- daftar soal seperti lembar asesmen modern
- nomor soal di kolom tetap
- reading width nyaman
- jawaban berupa Interactive Choice Cards
- progress tipis dan informatif

### Mobile
- satu soal per step
- tidak menggunakan native `<select>` untuk jawaban
- semua jawaban menjadi full-width Interactive Choice Cards
- minimum touch target 48px
- setelah memilih jawaban, tunggu sekitar 250ms lalu lanjut otomatis ke soal berikutnya
- Previous tetap tersedia
- Next hanya fallback

Interactive Choice Cards:

Unselected:
- background `#FAF9F6`
- border 1px `#DDD8CF`
- teks charcoal

Selected:
- background `#E9F0EB`
- border 1.5px `#0D3B23`
- teks Deep Forest
- weight lebih kuat

Pressed:
- `transform: scale(.98)`
- transition singkat dengan `cubic-bezier(.2,.8,.2,1)`

## Fase A

Fase A kelas 1–2 dibuat lebih ramah anak tanpa menjadi kekanak-kanakan:
- pertanyaan sedikit lebih besar
- spacing lebih lega
- choice cards lebih tinggi
- emoji hanya sebagai penguat makna pilihan
- progres sedikit lebih playful dengan Deep Forest + Muted Gold

Emoji harus konsisten dan membantu pemahaman, bukan dekorasi acak.

## Progress

Gunakan thin progress line. Deep Forest menunjukkan progres aktif. Muted Gold hanya sebagai marker kecil atau completion cue.

Tampilkan informasi seperti “7 dari 20” atau persentase yang jelas.

Tidak menggunakan gradient, confetti, glow, atau bouncing number.

## Result

Hasil harus terasa resmi dan tenang:
- heading serif
- nilai 0–100 menggunakan Newsreader
- kategori
- penjelasan singkat
- identitas
- status penyimpanan
- Unduh PDF
- Cetak
- Mulai Lagi

Nilai adalah focal point. Unduh PDF menjadi primary action setelah hasil tersedia.

## Admin

### Login
- minimal
- tanpa portrait
- satu form fokus
- eye toggle password tetap tersedia

### Dashboard
Portrait hanya setelah login:
- Pengawas Bina
- Zainal Arifin, S.Ag., M.M
- RA dan MI

Data desktop memakai tabel bersih dengan horizontal rules. Mobile memakai reflow row/card yang eksplisit. Statistik sebaiknya berupa editorial summary row, bukan empat card identik bila tidak diperlukan.

## Motion

Motion harus cepat dan mempunyai fungsi.

Allowed:
- opacity
- transform
- progress width
- border/underline state

Avoid:
- animated blur
- animated shadow
- floating
- bounce
- parallax
- dekorasi bergerak terus-menerus
- transition properti layout berat

Timing:
- hover/tap: 120–180ms
- view transition: 180–240ms
- mobile answer auto-advance: sekitar 250ms
- easing: `cubic-bezier(.2,.8,.2,1)`

Website tidak memaksa 120Hz; implementasi dibuat ringan agar browser dapat memanfaatkan refresh tinggi pada perangkat yang mendukungnya.

## Accessibility

- touch target minimum 44×44px
- answer target ideal 48px+
- focus state selalu terlihat
- keyboard dapat menyelesaikan asesmen desktop
- tidak mengandalkan warna saja
- error dekat dengan sumber masalah
- empty/loading/error state harus tersedia
- tidak ada horizontal overflow pada 320px
- mobile adalah composition tersendiri, bukan desktop yang diperkecil

## PDF / Print

Arah visual: **Sertifikat Kedinasan Modern**.

- warm white paper
- double hairline border
- heading serif resmi
- sans untuk metadata/tabel
- Deep Forest sebagai aksen
- Muted Gold untuk detail kecil
- tabel tanpa garis vertikal
- separator horizontal tipis
- zebra striping sangat halus

Konten:
- identitas
- sekolah
- jenis peserta
- kelas/fase
- nilai 0–100
- kategori
- penjelasan
- raw score
- seluruh pertanyaan
- jawaban
- skor item
- tanggal

Tanda tangan di kanan bawah:
- Pengawas Bina
- Zainal Arifin, S.Ag., M.M
- RA dan MI

Footer:
- nomor halaman
- Develoved by: Prabu26.dev

## Content Integrity

Desain tidak boleh mengubah aturan asesmen.

Guru MI:
- 20 soal
- scoring instrumen sumber tetap
- raw score 0–60
- nilai final 0–100

Murid:
- Fase A / kelas 1–2: 10 soal
- Fase B / kelas 3–4: 15 soal
- Fase C / kelas 5–6: 20 soal
- semua nilai final 0–100

Flow:
Identitas → Asesmen → semua jawaban lengkap → Cek Nilai → hasil 0–100 → Unduh PDF.

Perubahan UI tidak boleh memutus jumlah soal, scoring, penyimpanan Firestore, admin, atau PDF.

## Delivery Checklist

Sebelum redesign dianggap selesai:
- semua tombol/link berfungsi
- Guru 20 soal tampil
- Fase A 10 soal tampil
- Fase B 15 soal tampil
- Fase C 20 soal tampil
- skor maksimum 100
- Cek Nilai bekerja
- Unduh PDF bekerja
- admin bekerja
- mobile 320px tidak overflow
- tablet memiliki layout sendiri
- focus/keyboard bekerja
- motion ringan
- dependency berat dimuat hanya saat diperlukan
- tidak ada blur/glow/shadow berat
- tidak ada native select untuk jawaban asesmen mobile
- desain tetap terasa khas Pola Pikir MI walaupun logo dilepas

## Implementation Order

1. Foundation: palette, typography, spacing, navigation.
2. Landing/dashboard awal.
3. Identity Guru dan Murid.
4. Assessment desktop.
5. Assessment mobile Interactive Choice Cards.
6. Treatment Fase A.
7. Result.
8. Admin login.
9. Admin dashboard.
10. PDF/print.
11. Performance pass.
12. Accessibility pass.
13. Regression test instrumen dan scoring.
14. Antislop delivery audit.

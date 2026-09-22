# Profil Pola Pikir MI

Web asesmen responsif untuk **Guru MI** dan **Murid MI (Fase A–C)**.

**Develoved by: Prabu26.dev**

## URL

- Client: `https://prabu2696.github.io/polapikir/`
- Admin: `https://prabu2696.github.io/polapikir/admin/`

Client tidak menampilkan tautan menuju panel admin.

## Desain

Versi terbaru menggunakan antarmuka putih minimalis bergaya iOS:
- dominan putih/off-white dengan teks gelap berkontras tinggi;
- aksen hijau dan emas yang mengikuti identitas visual logo;
- logo Kementerian Agama digunakan pada halaman client;
- animasi transisi, micro-interaction, dan progress yang halus;
- responsif untuk smartphone, tablet, laptop, dan desktop;
- admin login minimalis tanpa foto;
- foto Pengawas Bina hanya ditampilkan setelah login di dashboard;
- kolom password admin memiliki tombol mata untuk tampil/sembunyikan password.

## Instrumen

- **Guru MI:** 20 pernyataan baru tentang praktik mengajar dan belajar.
- **Fase A / kelas 1–2:** 10 pernyataan sederhana dan konkret.
- **Fase B / kelas 3–4:** 15 pernyataan situasional dengan refleksi belajar tingkat menengah.
- **Fase C / kelas 5–6:** 20 pernyataan lebih reflektif tentang strategi, umpan balik, tantangan, dan evaluasi diri.
- Semua hasil dinormalisasi ke skala **0–100**. Setiap pertanyaan menyumbang bobot yang sama: 20 soal = 5 poin, 15 soal = 100/15 ≈ 6,67 poin, 10 soal = 10 poin.
- Enam aspek yang ditampilkan: **Growth, Challenge, Creator, Abundance, Benefit, dan Outward Mindset**. Setiap aspek dihitung dari pernyataan yang sesuai, termasuk pernyataan dengan penilaian terbalik.
- Fase A memiliki hanya satu pernyataan untuk Benefit dan Outward. Keduanya diberi tanda **indikasi awal** dan tidak digunakan dalam urutan kecenderungan paling menonjol.

Rincian aspek, pernyataan terbalik, perhitungan, dan batas interpretasi tersedia di [INSTRUMENT.md](INSTRUMENT.md).

Pada desktop/laptop, pilihan jawaban tampil sebagai radio button. Pada smartphone, satu pertanyaan ditampilkan per langkah dengan pilihan sentuh yang besar.

## Alur data

1. Peserta memilih Guru MI atau Murid MI.
2. Peserta mengisi nama dan sekolah; murid juga memilih kelas.
3. Sistem menentukan fase murid otomatis dari kelas.
4. Peserta menjawab seluruh pernyataan.
5. Saat menekan **Cek Nilai**, hasil langsung dihitung dan tampil di perangkat.
6. Pada saat yang sama jawaban dikirim ke Supabase.
7. Supabase menghitung ulang skor di server berdasarkan versi instrumen. Data lama v3 tetap memakai rubrik lamanya; jawaban baru memakai v4.
8. Admin dapat melihat data berdasarkan sekolah, jenis peserta, dan fase.

## Normalisasi data

- Nama peserta disimpan dalam huruf kapital.
- Nama sekolah dirapikan untuk variasi spasi dan tanda baca.
- Contoh variasi seperti `RA-Alhidayah` dan `RA Alhidayah` dapat masuk ke nama normalisasi yang sama.

## Supabase

Konfigurasi project dan publishable key berada di `config.js`.

Agar backend aktif, jalankan `supabase/schema.sql` di SQL Editor project Supabase dan buat akun Authentication admin dengan email internal yang ditetapkan dalam konfigurasi. Terapkan pembaruan SQL **sebelum** menerbitkan klien v4; trigger lama mengabaikan rubrik v4.

Login antarmuka admin tetap menggunakan username, bukan email internal.

**Jangan memasukkan service-role key ke repository atau browser.**

## Laporan PDF

Client dan admin dapat menghasilkan laporan PDF A4 langsung dari browser.

Laporan memuat:
- identitas peserta;
- sekolah/madrasah;
- jenis peserta dan kelas/fase;
- nilai akhir 0–100;
- kecenderungan enam mindset beserta jumlah soal per aspek;
- seluruh pernyataan, jawaban, dan skor item;
- skor mentah;
- tanggal pengisian;
- identitas Pengawas Bina;
- nomor halaman;
- footer `Develoved by: Prabu26.dev`.

Client memiliki tombol **Unduh PDF** dan **Cetak** setelah hasil keluar. Admin memiliki tombol yang sama di detail peserta.

## Catatan metodologis

Seluruh pertanyaan v4 merupakan draf baru untuk refleksi pendidikan yang disusun khusus bagi guru dan murid per fase. Instrumen ini belum divalidasi secara psikometrik. Skor per aspek menunjukkan kecenderungan jawaban pada konteks pertanyaan, bukan ukuran kepribadian yang menetap. Perbandingan antaraspek perlu mempertimbangkan jumlah soal yang berbeda.


### Stabilitas tampilan

- Halaman aktif tetap terlihat ketika perangkat memakai pengaturan **Reduce motion**.
- Asset CSS/JavaScript memakai version query agar pembaruan GitHub Pages tidak tertahan cache browser.
- Logo client memakai versi vektor lambang Kementerian Agama yang sama dengan logo referensi agar tetap tajam pada layar Retina/HiDPI.

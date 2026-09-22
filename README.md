# Profil Pola Pikir MI

Web asesmen responsif untuk **Guru MI** dan **Murid MI (Fase A–C)**.

**Develoved by: Prabu26.dev**

## URL
- Client: `https://prabu2696.github.io/polapikir/`
- Admin: `https://prabu2696.github.io/polapikir/admin/`

Client tidak menampilkan tautan menuju panel admin. Foto Pengawas Bina hanya muncul setelah login di dashboard.

## Instrumen
- Guru MI: 20 pernyataan; pola scoring asli dipertahankan.
- Murid kelas 1–2 / Fase A: 10 pernyataan sederhana dan konkret.
- Murid kelas 3–4 / Fase B: 15 pernyataan situasional dengan refleksi belajar tingkat menengah.
- Murid kelas 5–6 / Fase C: 20 pernyataan lebih reflektif tentang strategi, umpan balik, tantangan, dan evaluasi diri.
- Semua hasil ditampilkan pada skala **0–100**.

## Alur data
1. Peserta mengisi identitas dan seluruh jawaban.
2. Saat menekan **Cek Nilai**, nilai langsung dihitung dan tampil di perangkat.
3. Pada saat yang sama jawaban dikirim ke Supabase.
4. Supabase menghitung ulang skor di server sehingga nilai dashboard tidak bergantung pada angka dari browser.
5. Admin login dan melihat data yang dikelompokkan berdasarkan sekolah.

## Supabase
Project URL dan publishable key sudah berada di `config.js`.

Agar backend benar-benar aktif:
1. Jalankan `supabase/schema.sql` sekali di SQL Editor project `fiizlowisexafwolnydh`.
2. Di Supabase Authentication buat user:
   - email internal: `zainalarifin@polapikir.local`
   - password: sesuai password admin yang ditetapkan
   - tandai/konfirmasi email sebagai terverifikasi.
3. Login website tetap menggunakan username `zainalarifin`; email internal tidak ditampilkan ke admin.

**Jangan** memasukkan service-role key ke repository atau browser.

## Catatan
Pertanyaan Murid MI adalah instrumen reflektif pendidikan yang disusun khusus per fase. Ini bukan tes psikologis klinis atau instrumen psikometrik tervalidasi.


## Laporan PDF

Client dan admin dapat menghasilkan laporan PDF A4 langsung di browser.

Isi laporan:
- identitas peserta dan sekolah;
- jenis peserta serta kelas/fase;
- nilai akhir 0-100 dan kategori;
- interpretasi hasil;
- tabel seluruh pernyataan, jawaban, dan skor item;
- skor mentah serta nilai akhir;
- tanggal pengisian dan waktu pembuatan laporan;
- identitas Pengawas Bina;
- footer `Develoved by: Prabu26.dev` dan nomor halaman.

Client menyediakan tombol **Unduh Laporan PDF** dan **Cetak PDF** setelah nilai tampil.
Admin menyediakan tombol yang sama pada detail setiap peserta.

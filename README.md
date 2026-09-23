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
6. Firebase Authentication membuat sesi anonymous peserta tanpa formulir login. Jawaban asli dikirim ke Cloud Firestore.
7. Status tersimpan muncul setelah konfirmasi server. Kirim ulang memakai ID yang sama dan memeriksa jawaban tersimpan agar tidak membuat duplikat.
   Pengiriman yang tertunda disimpan di sessionStorage dan dicoba kembali saat koneksi kembali atau halaman dimuat ulang pada tab yang sama. Menutup tab dapat menghapus salinan yang belum terkirim.
8. Dashboard admin berlangganan perubahan Firestore. Skor, enam mindset, dan PDF dihitung kembali dari jawaban asli memakai rubrik v4, bukan dari skor kiriman peserta.

## Normalisasi data

- Nama peserta disimpan dalam huruf kapital.
- Nama sekolah dirapikan untuk variasi spasi dan tanda baca.
- Contoh variasi seperti `RA-Alhidayah` dan `RA Alhidayah` dapat masuk ke nama normalisasi yang sama.

## Firebase

Konfigurasi web proyek `polapikir-mi`, email admin `cailembursingkur@gmail.com`, dan UID admin berada di `config.js`. Password tidak disimpan di repositori.

Aktifkan provider Email/Password dan Anonymous di Firebase Authentication. Tambahkan `prabu2696.github.io` serta `localhost` untuk pengujian ke Authorized domains. Database Firestore menggunakan `(default)`. Publikasikan isi `firestore.rules` melalui Console, atau jalankan `firebase deploy --only firestore --project polapikir-mi` dengan Firebase CLI yang sudah login sebagai pengelola proyek.

Login memakai email admin. Firebase memverifikasi password; akses data dibatasi oleh UID pada Rules. Sesi admin bertahan selama tab terbuka dan diperbarui oleh Firebase SDK. Sesi peserta terpisah dari sesi admin.

Koleksi `submissions` menyimpan `owner_uid`, `instrument_version`, `participant_type`, `participant_name`, `school_raw`, `grade`, `phase`, `answers` (daftar indeks pilihan), serta `created_at` (server timestamp). Peserta tidak dapat mengubah hasil atau membaca peserta lain. Admin dapat membaca seluruh hasil. Perhitungan skor berjalan di aplikasi; jawaban dan jumlah soal divalidasi oleh Rules.

Tidak diperlukan Analytics, Storage, atau Cloud Functions untuk alur ini. Firebase SDK modular versi 12.19.0 dimuat dari CDN resmi. Jangan memasukkan service account/private key ke browser.

Pengujian lokal: `node tests/server.mjs`, lalu buka `http://127.0.0.1:4173`. Pratinjau memakai proyek Firebase yang dikonfigurasi, sehingga pengiriman dari halaman ini adalah data sungguhan. Uji perhitungan/PDF: `node tests/regression.cjs`; uji dokumen: `node tests/firestore-data.cjs`.

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

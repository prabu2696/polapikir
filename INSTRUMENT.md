# Draf Instrumen Profil Pola Pikir MI (v4)

Instrumen ini menyajikan enam kecenderungan reflektif untuk Guru MI dan Murid MI. Seluruh pernyataan merupakan draf baru. Naskah pertanyaan, urutan, aspek, pilihan jawaban, dan arah skor berada di `assets/instruments.js` sebagai satu sumber untuk antarmuka dan laporan. Firestore menyimpan jawaban asli. Dashboard menghitung ulang skor dari jawaban tersebut memakai modul instrumen yang sama.

| Aspek | Perilaku yang dicermati |
| --- | --- |
| Growth Mindset | Memperbaiki kemampuan melalui latihan, strategi, umpan balik, dan evaluasi. |
| Challenge Mindset | Menghadapi tugas sulit sebagai kesempatan belajar. |
| Creator Mindset | Mengambil langkah yang dapat dilakukan ketika hasil belum sesuai harapan. |
| Abundance Mindset | Berbagi pengetahuan dan belajar bersama tanpa merasa tersaingi. |
| Benefit Mindset | Memakai pengetahuan untuk memberi manfaat bagi sekitar. |
| Outward Mindset | Mempertimbangkan kebutuhan, kendala, dan sudut pandang orang lain. |

| Peserta | Jumlah soal | Pilihan jawaban | Skor mentah maksimum | Bobot maksimum per soal |
| --- | ---: | --- | ---: | ---: |
| Guru MI | 20 | Sangat Setuju hingga Sangat Tidak Setuju | 60 | 5 |
| Murid Fase A (kelas 1–2) | 10 | Ya, Kadang-kadang, Tidak | 20 | 10 |
| Murid Fase B (kelas 3–4) | 15 | Sangat Sesuai hingga Tidak Sesuai | 45 | 100/15 = 6,666… |
| Murid Fase C (kelas 5–6) | 20 | Sangat Sesuai hingga Tidak Sesuai | 60 | 5 |

Jawaban yang paling sejalan dengan aspek mendapat 3 poin untuk empat pilihan atau 2 poin untuk tiga pilihan. Jawaban yang paling tidak sejalan mendapat 0. Pernyataan terbalik mengubah arah skornya. Nomor pernyataan terbalik: Guru 9 dan 14; Fase A tidak ada; Fase B 8 dan 15; Fase C 14.

Nilai keseluruhan = `round(jumlah skor mentah / skor mentah maksimum × 100)`. Poin setiap soal di laporan = `skor item / skor item maksimum × (100 / jumlah soal)`. Nilai akhir dihitung dari angka sebelum pembulatan tampilan. Jadi laporan menampilkan 6,67 sebagai pendekatan dari 100/15, tetapi lima belas bobot tetap berjumlah tepat 100 dalam perhitungan.

Persentase aspek = `jumlah skor aspek / (jumlah soal aspek × skor item maksimum) × 100`, dibulatkan untuk tampilan. Aspek yang hanya memiliki satu soal ditandai **indikasi awal** dan tidak dipakai untuk menentukan aspek paling menonjol. Itu terjadi pada Benefit dan Outward Mindset di Fase A. Jika persentase semua aspek yang memiliki sedikitnya dua soal sama, laporan menyatakan belum ada aspek yang lebih menonjol. Jika ada aspek tertinggi yang seri, semuanya ditampilkan sebagai kecenderungan bersama.

Instrumen ini belum divalidasi secara psikometrik. Persentase aspek tidak boleh dibaca sebagai diagnosis, sifat permanen, atau peringkat antarpeserta. Gunakan hasil bersama percakapan, pengamatan, dan konteks belajar peserta. Catatan ini penting terutama untuk murid kecil dan aspek yang diwakili sedikit pernyataan.

Generator PDF tetap dapat membaca laporan historis v3 dengan rubrik lamanya. Pengiriman Firestore hanya menerima versi `2026.09-v4`, dengan validasi fase, jumlah jawaban, dan pilihan di `firestore.rules`. Skor tidak disimpan dari browser peserta; dashboard menurunkannya kembali dari jawaban asli.

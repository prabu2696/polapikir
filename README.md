# Profil Pola Pikir MI

Web asesmen responsif untuk **Guru MI** dan **Murid MI (Fase A–C)**.

**Developed by: Prabu26.dev**

## URL

Setelah GitHub Pages diaktifkan dari branch `main` / root:

- Client: `https://prabu2696.github.io/polapikir/`
- Admin: `https://prabu2696.github.io/polapikir/admin/`

Halaman client tidak menampilkan tautan menuju panel admin.

## Fitur

- Guru MI: 20 pernyataan dan scoring mengikuti versi sumber sebelumnya.
- Murid MI: bank pertanyaan terpisah untuk Fase A (kelas 1–2), Fase B (kelas 3–4), Fase C (kelas 5–6).
- Desktop/laptop: pilihan jawaban radio langsung.
- Smartphone: satu pertanyaan per layar + dropdown.
- Normalisasi nama peserta menjadi uppercase.
- Normalisasi sekolah untuk variasi spasi/tanda baca, mis. `RA-Alhidayah` dan `RA Alhidayah`.
- Dashboard admin berdasarkan sekolah.
- Login admin via Supabase Auth.
- Row Level Security: publik hanya INSERT; admin terdaftar dapat SELECT.

## Mengaktifkan backend Supabase

1. Buat project Supabase.
2. Jalankan seluruh isi `supabase/schema.sql` pada SQL Editor.
3. Buat satu user admin melalui Authentication.
4. Ambil UUID user admin, lalu jalankan:
   `insert into public.admin_users (user_id) values ('UUID-USER-ADMIN');`
5. Isi `config.js`:
   - `supabaseUrl`
   - `supabaseAnonKey`

Anon key memang boleh berada di frontend Supabase selama RLS aktif. Jangan pernah menaruh `service_role` key di repository/browser.

## Catatan metodologis

Bank pertanyaan Murid MI pada aplikasi ini adalah instrumen reflektif yang disusun untuk penggunaan pendidikan berdasarkan kompleksitas bahasa per fase. Ini bukan tes psikologis klinis atau instrumen psikometrik tervalidasi.

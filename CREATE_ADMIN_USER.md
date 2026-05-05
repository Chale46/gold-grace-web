# Cara Membuat Admin User

## Opsi 1: Via Supabase Dashboard (Rekomendasi)

1. Buka https://app.supabase.io
2. Pilih project **gold-grace-web**
3. Klik menu **Authentication** (di sidebar kiri)
4. Klik tab **Users**
5. Klik tombol **Add User** (kanan atas)
6. Pilih **Create new user**
7. Masukkan:
   - **Email**: admin@jadtra.com (atau email yang kamu mau)
   - **Password**: minimal 6 karakter, misal: `Admin123!`
8. Klik **Create user**

## Opsi 2: Via SQL Editor (Alternatif)

1. Di Supabase Dashboard, klik **SQL Editor** (sidebar kiri)
2. New Query
3. Jalankan SQL ini:

```sql
-- Insert user ke auth.users (password akan di-hash otomatis)
-- Gunakan Supabase Auth API atau buat via Dashboard saja
-- Karena password hash manual ribet
```

## Opsi 3: Halaman Register Sementara

Saya bisa buatkan halaman register sementara, tapi setelah buat user hapus filenya untuk keamanan.

## Cara Login Setelah User Dibuat

1. Buka: `https://your-domain.com/admin/login`
2. Masukkan email & password yang sudah dibuat
3. Harusnya redirect ke `/admin/dashboard`

## Catatan Keamanan

- Jangan commit password ke git
- Gunakan password kuat (min 8 karakter, campuran huruf/angka/simbol)
- Ganti password secara berkala
- Hapus halaman register setelah user dibuat (kalau pakai opsi 3)

## Troubleshooting

Kalau masih error "Invalid login credentials":
1. Cek email/password sudah benar (case sensitive)
2. Cek user sudah ter-create di Supabase Dashboard
3. Cek tidak ada spasi di awal/akhir email/password
4. Coba hard refresh browser (Ctrl+F5)

## Konfirmasi Keberhasilan

Setelah berhasil login, cek console browser harusnya ada log:
```
LOGIN SUCCESS: admin@jadtra.com
NAVIGATING...
```

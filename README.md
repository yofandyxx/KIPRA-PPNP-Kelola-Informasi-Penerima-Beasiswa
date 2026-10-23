# PPNP Scholarship

Aplikasi mobile untuk mengelola beasiswa, mahasiswa, pendaftaran, dan proses seleksi.

## Teknologi

- React Native
- Expo
- TypeScript
- React Navigation
- Google Sheets sebagai penyimpanan data

## Fitur

- Dashboard statistik
- Kelola beasiswa dan mahasiswa
- Kategori program studi
- Pendaftaran beasiswa
- Validasi periode pendaftaran
- Proses seleksi dan laporan

## Instalasi

Persyaratan: Node.js, npm, Expo CLI, dan Android Studio atau perangkat Android.

```bash
npm install
npm start
```

Untuk menjalankan Android:

```bash
npm run android
```

## Konfigurasi API

Alamat API dikonfigurasi pada:

```text
src/api/config.ts
```

Isi nilai `BASE_URL` dengan alamat REST API yang digunakan aplikasi.

## Struktur Google Spreadsheet

### Sheet `Scholarships`

Header wajib:

```text
id, code, name, organizer, academic_year, start_date, end_date, requirements, description, quota, status
```

Contoh:

| id | code | name | organizer | academic_year | start_date | end_date | quota | status |
|---|---|---|---|---|---|---|---:|---|
| SCH-001 | B-PRESTASI | Beasiswa Prestasi | PPNP | 2026/2027 | 01/08/2026 | 31/12/2026 | 10 | Aktif |

Gunakan format tanggal `DD/MM/YYYY`. Nilai status harus tepat `Aktif`.

### Sheet `Students`

Header wajib:

```text
id, nim, name, study_program, study_category, semester, gpa, email, phone
```

Nilai `study_category` yang tersedia: `Teknik/Komputer`, `Ekonomi`, `Kesehatan`, `Pendidikan`, `Sosial`, dan `Lainnya`.

### Sheet `Applications`

Header wajib:

```text
id, scholarship_id, student_id, application_date, motivation, document_url, declaration, selection_status, selection_notes, selection_date
```

Nilai `selection_status`: `Menunggu Seleksi`, `Diterima`, atau `Ditolak`.

## Validasi Periode

Pendaftaran hanya dapat dilakukan jika:

```text
start_date <= tanggal pendaftaran <= end_date
```

Status `Aktif` saja tidak cukup. Pastikan tanggal sekarang masih berada dalam periode beasiswa.

## Pemeriksaan Kode

```bash
npx tsc --noEmit
npx expo export --platform android
```

## Struktur Folder

```text
src/
├── api/          Konfigurasi dan client API
├── components/   Komponen UI bersama
├── constants/    Tema dan konstanta
├── screens/      Halaman aplikasi
├── services/     Layanan akses data
├── types/        Tipe TypeScript
└── utils/        Validasi dan utilitas
```

## Catatan

- Jangan mengubah nama header Spreadsheet.
- Hindari spasi tambahan pada nilai `status`.
- Pastikan kolom tanggal dikenali sebagai tanggal oleh Google Sheets, bukan teks biasa.
- Jangan menyimpan kredensial atau konfigurasi rahasia di repository publik.

import { z } from 'zod';

export const scholarshipSchema = z.object({
  code: z.string().trim().min(1, 'Kode beasiswa wajib diisi.'),
  name: z.string().trim().min(1, 'Nama program wajib diisi.'),
  organizer: z.string(),
  academic_year: z.string(),
  start_date: z.string().regex(/^(?:\d{2}\/\d{2}\/\d{2}|\d{4}-\d{2}-\d{2})$/, 'Format DD/MM/YY.'),
  end_date: z.string().regex(/^(?:\d{2}\/\d{2}\/\d{2}|\d{4}-\d{2}-\d{2})$/, 'Format DD/MM/YY.'),
  requirements: z.string(),
  description: z.string(),
  quota: z.number().int().positive('Kuota harus > 0.'),
  status: z.enum(['Aktif', 'Ditutup']),
});

export const studentSchema = z.object({
  nim: z.string().trim().min(1, 'NIM wajib diisi.'),
  name: z.string().trim().min(1, 'Nama wajib diisi.'),
  study_program: z.string(),
  study_category: z.enum(['Teknik/Komputer', 'Ekonomi', 'Kesehatan', 'Pendidikan', 'Sosial', 'Lainnya']),
  semester: z.number().int().min(1, 'Minimal 1.').max(14, 'Maksimal 14.'),
  gpa: z.number().min(0, 'Minimal 0,00.').max(4, 'Maksimal 4,00.'),
  email: z.string().trim().email('Email tidak valid.'),
  phone: z.string(),
});

export const applicationSchema = z.object({
  scholarship_id: z.string().min(1, 'Pilih program.'),
  student_id: z.string().min(1, 'Pilih mahasiswa.'),
  motivation: z.string().trim().min(1, 'Motivasi wajib diisi.'),
  document_url: z.string(),
  declaration: z.literal(true, { message: 'Pernyataan wajib disetujui.' }),
});

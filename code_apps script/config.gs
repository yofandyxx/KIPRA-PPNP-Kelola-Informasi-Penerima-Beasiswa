/**
 * Konfigurasi global backend PPNP Scholarship.
 * Ganti SPREADSHEET_ID dengan ID spreadsheet Anda.
 */
var CONFIG = {
  SPREADSHEET_ID: '103pbBIWK6fdFQH3QC-Ta0oUgGgK_6ymoSCIrclS4F4c',

  SHEETS: {
    SCHOLARSHIPS: 'SCHOLARSHIPS',
    STUDENTS: 'STUDENTS',
    APPLICATIONS: 'APPLICATIONS'
  },

  HEADERS: {
    SCHOLARSHIPS: [
      'id', 'code', 'name', 'organizer', 'academic_year',
      'start_date', 'end_date', 'requirements', 'description',
      'quota', 'status'
    ],
    STUDENTS: [
      'id', 'nim', 'name', 'study_program', 'semester',
      'gpa', 'email', 'phone'
    ],
    APPLICATIONS: [
      'id', 'scholarship_id', 'student_id', 'application_date',
      'motivation', 'document_url', 'declaration',
      'selection_status', 'selection_notes', 'selection_date'
    ]
  },

  MAX_SCHOLARSHIPS: 3,

  STATUS: {
    SCHOLARSHIP_ACTIVE: 'Aktif',
    SCHOLARSHIP_CLOSED: 'Ditutup',
    SELECTION_PENDING: 'Menunggu Seleksi',
    SELECTION_ACCEPTED: 'Diterima',
    SELECTION_REJECTED: 'Ditolak'
  },

  LOCK_TIMEOUT_MS: 30000
};
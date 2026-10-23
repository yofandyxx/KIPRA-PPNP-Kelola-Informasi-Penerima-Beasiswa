/**
 * Validasi backend. Backend adalah sumber keputusan akhir.
 */

function validateScholarshipPayload(payload, existingId) {
  var errors = [];
  var code = sanitizeString(payload.code);
  var name = sanitizeString(payload.name);
  var quota = parseNumber(payload.quota);
  var startDate = sanitizeString(payload.start_date);
  var endDate = sanitizeString(payload.end_date);
  var status = sanitizeString(payload.status);

  if (!code) errors.push('Kode beasiswa wajib diisi.');
  if (!name) errors.push('Nama program wajib diisi.');
  if (quota <= 0) errors.push('Kuota harus lebih besar dari nol.');
  if (!isValidDateString(startDate)) errors.push('Tanggal mulai tidak valid.');
  if (!isValidDateString(endDate)) errors.push('Tanggal akhir tidak valid.');
  if (startDate && endDate && startDate > endDate) {
    errors.push('Tanggal mulai tidak boleh setelah tanggal akhir.');
  }
  if ([CONFIG.STATUS.SCHOLARSHIP_ACTIVE, CONFIG.STATUS.SCHOLARSHIP_CLOSED].indexOf(status) === -1) {
    errors.push('Status program tidak valid.');
  }

  var duplicate = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS).filter(function (s) {
    return String(s.code).toLowerCase() === code.toLowerCase() && String(s.id) !== String(existingId);
  });
  if (duplicate.length > 0) errors.push('Kode beasiswa sudah digunakan.');

  if (!existingId && readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS).length >= CONFIG.MAX_SCHOLARSHIPS) {
    errors.push('Maksimal ' + CONFIG.MAX_SCHOLARSHIPS + ' program beasiswa.');
  }

  return errors;
}

function validateStudentPayload(payload, existingId) {
  var errors = [];
  var nim = sanitizeString(payload.nim);
  var name = sanitizeString(payload.name);
  var email = sanitizeString(payload.email);
  var semester = parseNumber(payload.semester);
  var gpa = Number(payload.gpa);

  if (!nim) errors.push('NIM wajib diisi.');
  if (!name) errors.push('Nama wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Format email tidak valid.');
  if (semester < 1 || semester > 14) errors.push('Semester harus antara 1 sampai 14.');
  if (isNaN(gpa) || gpa < 0 || gpa > 4) errors.push('IPK harus antara 0.00 sampai 4.00.');

  var duplicate = readSheetObjects(CONFIG.SHEETS.STUDENTS).filter(function (s) {
    return String(s.nim) === nim && String(s.id) !== String(existingId);
  });
  if (duplicate.length > 0) errors.push('NIM sudah terdaftar.');

  return errors;
}

function validateApplicationPayload(payload) {
  var errors = [];
  var scholarshipId = sanitizeString(payload.scholarship_id);
  var studentId = sanitizeString(payload.student_id);
  var motivation = sanitizeString(payload.motivation);
  var declaration = payload.declaration === true || payload.declaration === 'true';

  if (!scholarshipId) errors.push('Program beasiswa wajib dipilih.');
  if (!studentId) errors.push('Mahasiswa wajib dipilih.');
  if (!motivation) errors.push('Motivasi wajib diisi.');
  if (!declaration) errors.push('Pernyataan kebenaran data wajib disetujui.');

  var scholarship = null;
  if (scholarshipId) {
    scholarship = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS).filter(function (s) {
      return String(s.id) === scholarshipId;
    })[0];
    if (!scholarship) errors.push('Program beasiswa tidak ditemukan.');
  }

  if (studentId && !readSheetObjects(CONFIG.SHEETS.STUDENTS).some(function (s) {
    return String(s.id) === studentId;
  })) {
    errors.push('Mahasiswa tidak ditemukan.');
  }

  if (scholarship) {
    if (scholarship.status !== CONFIG.STATUS.SCHOLARSHIP_ACTIVE) {
      errors.push('Program beasiswa tidak aktif.');
    }
    var today = nowString();
    if (today < scholarship.start_date || today > scholarship.end_date) {
      errors.push('Pendaftaran berada di luar periode yang ditentukan.');
    }
  }

  if (scholarshipId && studentId) {
    var duplicate = readSheetObjects(CONFIG.SHEETS.APPLICATIONS).filter(function (a) {
      return String(a.scholarship_id) === scholarshipId && String(a.student_id) === studentId;
    });
    if (duplicate.length > 0) {
      errors.push('Mahasiswa sudah mendaftar pada program beasiswa ini.');
    }
  }

  return errors;
}

function validateSelectionPayload(payload) {
  var errors = [];
  var status = sanitizeString(payload.selection_status);
  if ([CONFIG.STATUS.SELECTION_ACCEPTED, CONFIG.STATUS.SELECTION_REJECTED].indexOf(status) === -1) {
    errors.push('Status seleksi harus Diterima atau Ditolak.');
  }
  return errors;
}
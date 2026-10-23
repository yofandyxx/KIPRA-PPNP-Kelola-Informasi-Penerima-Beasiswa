/**
 * Layanan pendaftaran beasiswa.
 * PERBAIKAN: join academic_year dari scholarship agar filter tahun bekerja.
 */

function listApplications(params) {
  var apps = readSheetObjects(CONFIG.SHEETS.APPLICATIONS);
  var scholarships = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS);
  var students = readSheetObjects(CONFIG.SHEETS.STUDENTS);

  var data = apps.map(function (a) {
    var s = scholarships.filter(function (x) { return String(x.id) === String(a.scholarship_id); })[0];
    var m = students.filter(function (x) { return String(x.id) === String(a.student_id); })[0];
    return Object.assign({}, a, {
      scholarship_name: s ? s.name : '(Tidak ditemukan)',
      scholarship_code: s ? s.code : '',
      academic_year: s ? s.academic_year : '',
      student_name: m ? m.name : '(Tidak ditemukan)',
      student_nim: m ? m.nim : '',
      student_gpa: m ? m.gpa : null,
      student_semester: m ? m.semester : null
    });
  });

  var scholarshipId = sanitizeString(params.scholarship_id);
  var status = sanitizeString(params.selection_status);
  var search = sanitizeString(params.search).toLowerCase();
  var year = sanitizeString(params.academic_year);

  if (scholarshipId) {
    data = data.filter(function (a) { return String(a.scholarship_id) === scholarshipId; });
  }
  if (status && status !== 'Semua') {
    data = data.filter(function (a) { return a.selection_status === status; });
  }
  if (year) {
    data = data.filter(function (a) { return a.academic_year === year; });
  }
  if (search) {
    data = data.filter(function (a) {
      return String(a.student_name).toLowerCase().indexOf(search) >= 0 ||
        String(a.student_nim).toLowerCase().indexOf(search) >= 0;
    });
  }
  return data;
}

function getApplication(id) {
  var found = listApplications({}).filter(function (a) { return String(a.id) === String(id); });
  if (found.length === 0) throw new Error('Pendaftaran tidak ditemukan.');
  return found[0];
}

function getStudentApplications(studentId) {
  return listApplications({}).filter(function (a) {
    return String(a.student_id) === String(studentId);
  });
}

function createApplication(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var errors = validateApplicationPayload(payload);
    if (errors.length > 0) throw new Error(errors.join(' '));

    var obj = {
      id: generateId('APP'),
      scholarship_id: sanitizeString(payload.scholarship_id),
      student_id: sanitizeString(payload.student_id),
      application_date: nowString(),
      motivation: sanitizeString(payload.motivation),
      document_url: sanitizeString(payload.document_url),
      declaration: payload.declaration === true || payload.declaration === 'true',
      selection_status: CONFIG.STATUS.SELECTION_PENDING,
      selection_notes: '',
      selection_date: ''
    };
    appendObject(CONFIG.SHEETS.APPLICATIONS, obj);
    return obj;
  } finally {
    lock.releaseLock();
  }
}

function updateApplication(id, payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var existing = getApplication(id);
    if (existing.selection_status !== CONFIG.STATUS.SELECTION_PENDING) {
      throw new Error('Pendaftaran yang sudah final tidak dapat diubah.');
    }
    return updateObjectById(CONFIG.SHEETS.APPLICATIONS, id, {
      motivation: sanitizeString(payload.motivation || existing.motivation),
      document_url: sanitizeString(payload.document_url || existing.document_url)
    });
  } finally {
    lock.releaseLock();
  }
}
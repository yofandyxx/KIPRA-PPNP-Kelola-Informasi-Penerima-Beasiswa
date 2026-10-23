/**
 * Layanan CRUD mahasiswa.
 */

function listStudents(params) {
  var data = readSheetObjects(CONFIG.SHEETS.STUDENTS);
  var search = sanitizeString(params.search).toLowerCase();
  if (search) {
    data = data.filter(function (s) {
      return String(s.nim).toLowerCase().indexOf(search) >= 0 ||
        String(s.name).toLowerCase().indexOf(search) >= 0;
    });
  }
  return data;
}

function getStudent(id) {
  var found = readSheetObjects(CONFIG.SHEETS.STUDENTS).filter(function (s) {
    return String(s.id) === String(id);
  });
  if (found.length === 0) throw new Error('Mahasiswa tidak ditemukan.');
  return found[0];
}

function createStudent(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var errors = validateStudentPayload(payload, null);
    if (errors.length > 0) throw new Error(errors.join(' '));

    var obj = {
      id: generateId('STD'),
      nim: sanitizeString(payload.nim),
      name: sanitizeString(payload.name),
      study_program: sanitizeString(payload.study_program),
      semester: parseNumber(payload.semester),
      gpa: Number(payload.gpa),
      email: sanitizeString(payload.email),
      phone: sanitizeString(payload.phone)
    };
    appendObject(CONFIG.SHEETS.STUDENTS, obj);
    return obj;
  } finally {
    lock.releaseLock();
  }
}

function updateStudent(id, payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var existing = getStudent(id);
    var errors = validateStudentPayload(Object.assign({}, existing, payload), id);
    if (errors.length > 0) throw new Error(errors.join(' '));

    return updateObjectById(CONFIG.SHEETS.STUDENTS, id, {
      nim: sanitizeString(payload.nim || existing.nim),
      name: sanitizeString(payload.name || existing.name),
      study_program: sanitizeString(payload.study_program || existing.study_program),
      semester: parseNumber(payload.semester || existing.semester),
      gpa: Number(payload.gpa !== undefined ? payload.gpa : existing.gpa),
      email: sanitizeString(payload.email || existing.email),
      phone: sanitizeString(payload.phone || existing.phone)
    });
  } finally {
    lock.releaseLock();
  }
}

function deleteStudent(id) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var used = readSheetObjects(CONFIG.SHEETS.APPLICATIONS).some(function (a) {
      return String(a.student_id) === String(id);
    });
    if (used) {
      throw new Error('Mahasiswa tidak dapat dihapus karena memiliki riwayat pendaftaran.');
    }
    var ok = deleteObjectById(CONFIG.SHEETS.STUDENTS, id);
    if (!ok) throw new Error('Mahasiswa tidak ditemukan.');
    return { id: id };
  } finally {
    lock.releaseLock();
  }
}
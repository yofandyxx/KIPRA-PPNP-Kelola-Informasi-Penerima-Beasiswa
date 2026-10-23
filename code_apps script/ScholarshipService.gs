/**
 * Layanan CRUD beasiswa.
 */

function listScholarships(params) {
  var data = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS);
  var search = sanitizeString(params.search).toLowerCase();
  var status = sanitizeString(params.status);

  if (search) {
    data = data.filter(function (s) {
      return String(s.name).toLowerCase().indexOf(search) >= 0 ||
        String(s.code).toLowerCase().indexOf(search) >= 0 ||
        String(s.organizer).toLowerCase().indexOf(search) >= 0;
    });
  }
  if (status && status !== 'Semua') {
    data = data.filter(function (s) { return s.status === status; });
  }
  return data;
}

function getScholarship(id) {
  var found = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS).filter(function (s) {
    return String(s.id) === String(id);
  });
  if (found.length === 0) throw new Error('Beasiswa tidak ditemukan.');
  return found[0];
}

function createScholarship(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var errors = validateScholarshipPayload(payload, null);
    if (errors.length > 0) throw new Error(errors.join(' '));

    var obj = {
      id: generateId('SCH'),
      code: sanitizeString(payload.code),
      name: sanitizeString(payload.name),
      organizer: sanitizeString(payload.organizer),
      academic_year: sanitizeString(payload.academic_year),
      start_date: sanitizeString(payload.start_date),
      end_date: sanitizeString(payload.end_date),
      requirements: sanitizeString(payload.requirements),
      description: sanitizeString(payload.description),
      quota: parseNumber(payload.quota),
      status: sanitizeString(payload.status)
    };
    appendObject(CONFIG.SHEETS.SCHOLARSHIPS, obj);
    return obj;
  } finally {
    lock.releaseLock();
  }
}

function updateScholarship(id, payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var existing = getScholarship(id);
    var errors = validateScholarshipPayload(Object.assign({}, existing, payload), id);
    if (errors.length > 0) throw new Error(errors.join(' '));

    return updateObjectById(CONFIG.SHEETS.SCHOLARSHIPS, id, {
      code: sanitizeString(payload.code || existing.code),
      name: sanitizeString(payload.name || existing.name),
      organizer: sanitizeString(payload.organizer || existing.organizer),
      academic_year: sanitizeString(payload.academic_year || existing.academic_year),
      start_date: sanitizeString(payload.start_date || existing.start_date),
      end_date: sanitizeString(payload.end_date || existing.end_date),
      requirements: sanitizeString(payload.requirements || existing.requirements),
      description: sanitizeString(payload.description || existing.description),
      quota: parseNumber(payload.quota || existing.quota),
      status: sanitizeString(payload.status || existing.status)
    });
  } finally {
    lock.releaseLock();
  }
}

function deleteScholarship(id) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    var used = readSheetObjects(CONFIG.SHEETS.APPLICATIONS).some(function (a) {
      return String(a.scholarship_id) === String(id);
    });
    if (used) {
      throw new Error('Beasiswa tidak dapat dihapus karena sudah memiliki pendaftar.');
    }
    var ok = deleteObjectById(CONFIG.SHEETS.SCHOLARSHIPS, id);
    if (!ok) throw new Error('Beasiswa tidak ditemukan.');
    return { id: id };
  } finally {
    lock.releaseLock();
  }
}
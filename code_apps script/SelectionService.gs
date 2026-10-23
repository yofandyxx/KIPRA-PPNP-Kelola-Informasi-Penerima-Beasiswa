/**
 * Layanan seleksi, kuota, dan pengumuman.
 */

function selectApplication(id, payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

    var errors = validateSelectionPayload(payload);
    if (errors.length > 0) throw new Error(errors.join(' '));

    var application = getApplication(id);
    if (application.selection_status !== CONFIG.STATUS.SELECTION_PENDING) {
      throw new Error('Pendaftaran ini sudah memiliki keputusan final.');
    }

    var newStatus = sanitizeString(payload.selection_status);

    if (newStatus === CONFIG.STATUS.SELECTION_ACCEPTED) {
      var scholarship = getScholarship(application.scholarship_id);
      var acceptedCount = readSheetObjects(CONFIG.SHEETS.APPLICATIONS).filter(function (a) {
        return String(a.scholarship_id) === String(application.scholarship_id) &&
          a.selection_status === CONFIG.STATUS.SELECTION_ACCEPTED;
      }).length;

      if (acceptedCount >= parseNumber(scholarship.quota)) {
        throw new Error('Kuota penerima beasiswa ini sudah penuh.');
      }
    }

    return updateObjectById(CONFIG.SHEETS.APPLICATIONS, id, {
      selection_status: newStatus,
      selection_notes: sanitizeString(payload.selection_notes),
      selection_date: nowString()
    });
  } finally {
    lock.releaseLock();
  }
}

function listSelectionResults(params) {
  var data = listApplications({
    scholarship_id: params.scholarship_id,
    selection_status: params.selection_status,
    academic_year: params.academic_year
  });

  // Pengumuman publik: sembunyikan data pribadi (IPK, kontak, motivasi, dokumen).
  return data.map(function (a) {
    return {
      id: a.id,
      scholarship_name: a.scholarship_name,
      scholarship_code: a.scholarship_code,
      student_name: a.student_name,
      student_nim: a.student_nim,
      selection_status: a.selection_status,
      selection_notes: a.selection_notes,
      selection_date: a.selection_date,
      academic_year: a.academic_year
    };
  });
}

function getScholarshipQuotaSummary(scholarshipId) {
  var scholarship = getScholarship(scholarshipId);
  var apps = readSheetObjects(CONFIG.SHEETS.APPLICATIONS).filter(function (a) {
    return String(a.scholarship_id) === String(scholarshipId);
  });
  var accepted = apps.filter(function (a) {
    return a.selection_status === CONFIG.STATUS.SELECTION_ACCEPTED;
  }).length;
  return {
    scholarship_id: scholarshipId,
    scholarship_name: scholarship.name,
    quota: parseNumber(scholarship.quota),
    accepted: accepted,
    remaining: Math.max(0, parseNumber(scholarship.quota) - accepted)
  };
}
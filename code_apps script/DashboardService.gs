/**
 * Dashboard, statistik, dan laporan.
 */

function getDashboardSummary() {
  var scholarships = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS);
  var students = readSheetObjects(CONFIG.SHEETS.STUDENTS);
  var applications = readSheetObjects(CONFIG.SHEETS.APPLICATIONS);

  var pending = applications.filter(function (a) {
    return a.selection_status === CONFIG.STATUS.SELECTION_PENDING;
  }).length;
  var accepted = applications.filter(function (a) {
    return a.selection_status === CONFIG.STATUS.SELECTION_ACCEPTED;
  }).length;
  var rejected = applications.filter(function (a) {
    return a.selection_status === CONFIG.STATUS.SELECTION_REJECTED;
  }).length;

  return {
    total_students: students.length,
    total_scholarships: scholarships.length,
    total_applications: applications.length,
    total_pending: pending,
    total_accepted: accepted,
    total_rejected: rejected,
    acceptance_rate: applications.length > 0
      ? Math.round((accepted / applications.length) * 1000) / 10
      : 0
  };
}

function getApplicationStatistics(params) {
  var apps = listApplications({
    scholarship_id: params.scholarship_id,
    academic_year: params.academic_year
  });

  var map = {};
  apps.forEach(function (a) {
    var key = a.scholarship_name || 'Lainnya';
    if (!map[key]) {
      map[key] = { name: key, total: 0, accepted: 0, rejected: 0, pending: 0 };
    }
    map[key].total += 1;
    if (a.selection_status === CONFIG.STATUS.SELECTION_ACCEPTED) map[key].accepted += 1;
    if (a.selection_status === CONFIG.STATUS.SELECTION_REJECTED) map[key].rejected += 1;
    if (a.selection_status === CONFIG.STATUS.SELECTION_PENDING) map[key].pending += 1;
  });

  return Object.keys(map).map(function (k) { return map[k]; });
}

function getScholarshipStatistics() {
  var scholarships = readSheetObjects(CONFIG.SHEETS.SCHOLARSHIPS);
  var applications = readSheetObjects(CONFIG.SHEETS.APPLICATIONS);

  return scholarships.map(function (s) {
    var apps = applications.filter(function (a) {
      return String(a.scholarship_id) === String(s.id);
    });
    var accepted = apps.filter(function (a) {
      return a.selection_status === CONFIG.STATUS.SELECTION_ACCEPTED;
    }).length;
    return {
      id: s.id,
      name: s.name,
      code: s.code,
      quota: parseNumber(s.quota),
      applicants: apps.length,
      accepted: accepted,
      remaining: Math.max(0, parseNumber(s.quota) - accepted)
    };
  });
}
/**
 * Setup awal spreadsheet: membuat sheet, header, dan data contoh.
 * Jalankan fungsi setupSpreadsheet() SATU KALI dari editor Apps Script.
 */

function setupSpreadsheet() {
  var ss = getSpreadsheet();

  ensureSheet(ss, CONFIG.SHEETS.SCHOLARSHIPS, CONFIG.HEADERS.SCHOLARSHIPS);
  ensureSheet(ss, CONFIG.SHEETS.STUDENTS, CONFIG.HEADERS.STUDENTS);
  ensureSheet(ss, CONFIG.SHEETS.APPLICATIONS, CONFIG.HEADERS.APPLICATIONS);

  seedScholarships(ss);
  seedStudents(ss);

  return 'Setup selesai. Periksa ketiga sheet.';
}

function ensureSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var needsHeader = headers.some(function (h, i) {
    return String(firstRow[i]) !== h;
  });
  if (needsHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0B1D33')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

function seedScholarships(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SCHOLARSHIPS);
  if (sheet.getLastRow() > 1) return;

  var samples = [
    {
      id: 'SCH-001', code: 'B-PRESTASI', name: 'Beasiswa Prestasi',
      organizer: 'PPNP', academic_year: '2025/2026',
      start_date: '2025-08-01', end_date: '2025-12-31',
      requirements: 'IPK minimal 3.50; Semester minimal 3; Aktif kuliah.',
      description: 'Beasiswa untuk mahasiswa berprestasi akademik tinggi.',
      quota: 10, status: CONFIG.STATUS.SCHOLARSHIP_ACTIVE
    },
    {
      id: 'SCH-002', code: 'B-UKT', name: 'Bantuan Pendidikan / UKT',
      organizer: 'PPNP', academic_year: '2025/2026',
      start_date: '2025-08-01', end_date: '2025-12-31',
      requirements: 'Mahasiswa aktif; Kondisi ekonomi kurang mampu; IPK minimal 3.00.',
      description: 'Bantuan biaya pendidikan bagi mahasiswa terdampak ekonomi.',
      quota: 15, status: CONFIG.STATUS.SCHOLARSHIP_ACTIVE
    },
    {
      id: 'SCH-003', code: 'B-PENELITIAN', name: 'Beasiswa Penelitian',
      organizer: 'PPNP', academic_year: '2025/2026',
      start_date: '2025-08-01', end_date: '2025-12-31',
      requirements: 'IPK minimal 3.40; Memiliki proposal penelitian; Semester minimal 5.',
      description: 'Beasiswa untuk mendukung penelitian mahasiswa tingkat lanjut.',
      quota: 5, status: CONFIG.STATUS.SCHOLARSHIP_ACTIVE
    }
  ];

  samples.forEach(function (s) { appendObject(CONFIG.SHEETS.SCHOLARSHIPS, s); });
}

function seedStudents(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.STUDENTS);
  if (sheet.getLastRow() > 1) return;

  var samples = [
    {
      id: 'STD-001', nim: '2301001', name: 'Ahmad Fauzi',
      study_program: 'Teknologi Rekayasa Komputer', semester: 5,
      gpa: 3.75, email: 'ahmad.fauzi@ppnp.ac.id', phone: '081234567890'
    },
    {
      id: 'STD-002', nim: '2301002', name: 'Siti Aisyah',
      study_program: 'Teknologi Rekayasa Komputer', semester: 5,
      gpa: 3.85, email: 'siti.aisyah@ppnp.ac.id', phone: '081234567891'
    },
    {
      id: 'STD-003', nim: '2301003', name: 'Budi Santoso',
      study_program: 'Teknologi Rekayasa Komputer', semester: 3,
      gpa: 3.40, email: 'budi.santoso@ppnp.ac.id', phone: '081234567892'
    }
  ];

  samples.forEach(function (s) { appendObject(CONFIG.SHEETS.STUDENTS, s); });
}

/**
 * Verifikasi struktur sheet. Jalankan untuk memastikan header sesuai.
 */
function verifySheets() {
  var ss = getSpreadsheet();
  var report = [];
  ['SCHOLARSHIPS', 'STUDENTS', 'APPLICATIONS'].forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      report.push('MISSING: ' + name);
      return;
    }
    var headers = CONFIG.HEADERS[name];
    var actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    var match = headers.every(function (h, i) { return String(actual[i]) === h; });
    report.push(name + ': header ' + (match ? 'OK' : 'MISMATCH') +
      ' | rows=' + Math.max(0, sheet.getLastRow() - 1));
  });
  Logger.log(report.join('\n'));
  return report.join('\n');
}
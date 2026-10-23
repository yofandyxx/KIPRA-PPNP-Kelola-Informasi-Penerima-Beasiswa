/**
 * Routing API berbasis action.
 * GET  -> action di query parameter
 * POST -> action di body JSON (method override untuk update/delete)
 */

function routeGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = sanitizeString(params.action);
    var data;

    switch (action) {
      case 'listScholarships':
        data = listScholarships(params);
        break;
      case 'getScholarship':
        data = getScholarship(params.id);
        break;
      case 'listStudents':
        data = listStudents(params);
        break;
      case 'getStudent':
        data = getStudent(params.id);
        break;
      case 'listApplications':
        data = listApplications(params);
        break;
      case 'getApplication':
        data = getApplication(params.id);
        break;
      case 'getStudentApplications':
        data = getStudentApplications(params.student_id);
        break;
      case 'listSelectionResults':
        data = listSelectionResults(params);
        break;
      case 'getScholarshipQuotaSummary':
        data = getScholarshipQuotaSummary(params.scholarship_id);
        break;
      case 'getDashboardSummary':
        data = getDashboardSummary();
        break;
      case 'getApplicationStatistics':
        data = getApplicationStatistics(params);
        break;
      case 'getScholarshipStatistics':
        data = getScholarshipStatistics();
        break;
      case 'ping':
        data = { status: 'ok', timestamp: new Date().toISOString() };
        break;
      default:
        return jsonResponse(false, 'Action GET tidak dikenali: ' + action, null);
    }

    return jsonResponse(true, 'Data berhasil diambil', data);
  } catch (err) {
    return jsonResponse(false, err.message || 'Terjadi kesalahan pada server', null);
  }
}

function routePost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    var action = sanitizeString(body.action);
    var data;

    switch (action) {
      case 'createScholarship':
        data = createScholarship(body);
        break;
      case 'updateScholarship':
        data = updateScholarship(body.id, body);
        break;
      case 'deleteScholarship':
        data = deleteScholarship(body.id);
        break;
      case 'createStudent':
        data = createStudent(body);
        break;
      case 'updateStudent':
        data = updateStudent(body.id, body);
        break;
      case 'deleteStudent':
        data = deleteStudent(body.id);
        break;
      case 'createApplication':
        data = createApplication(body);
        break;
      case 'updateApplication':
        data = updateApplication(body.id, body);
        break;
      case 'selectApplication':
        data = selectApplication(body.id, body);
        break;
      default:
        return jsonResponse(false, 'Action POST tidak dikenali: ' + action, null);
    }

    return jsonResponse(true, 'Data berhasil disimpan', data);
  } catch (err) {
    return jsonResponse(false, err.message || 'Terjadi kesalahan pada server', null);
  }
}
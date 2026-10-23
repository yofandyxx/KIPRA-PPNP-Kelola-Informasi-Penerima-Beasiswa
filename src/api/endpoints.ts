export const ENDPOINTS = {
    SCHOLARSHIP: { LIST:'listScholarships', GET:'getScholarship', CREATE:'createScholarship', UPDATE:'updateScholarship', DELETE:'deleteScholarship' },
    STUDENT: { LIST:'listStudents', GET:'getStudent', CREATE:'createStudent', UPDATE:'updateStudent', DELETE:'deleteStudent' },
    APPLICATION: { LIST:'listApplications', GET:'getApplication', CREATE:'createApplication', UPDATE:'updateApplication', BY_STUDENT:'getStudentApplications' },
    SELECTION: { SELECT:'selectApplication', RESULTS:'listSelectionResults', QUOTA_SUMMARY:'getScholarshipQuotaSummary' },
    DASHBOARD: { SUMMARY:'getDashboardSummary', APPLICATION_STATS:'getApplicationStatistics', SCHOLARSHIP_STATS:'getScholarshipStatistics' },
    PING: 'ping',
  } as const;
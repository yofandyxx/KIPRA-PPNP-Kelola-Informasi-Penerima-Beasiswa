export type ScholarshipStatus = 'Aktif' | 'Ditutup';
export type SelectionStatus = 'Menunggu Seleksi' | 'Diterima' | 'Ditolak';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface Scholarship {
  id: string; code: string; name: string; organizer: string;
  academic_year: string; start_date: string; end_date: string;
  requirements: string; description: string; quota: number; status: ScholarshipStatus;
}
export type ScholarshipInput = Omit<Scholarship, 'id'>;

export type StudyProgramCategory = 'Teknik/Komputer' | 'Ekonomi' | 'Kesehatan' | 'Pendidikan' | 'Sosial' | 'Lainnya';
export interface Student {
  id: string; nim: string; name: string; study_program: string; study_category: StudyProgramCategory;
  semester: number; gpa: number; email: string; phone: string;
}
export type StudentInput = Omit<Student, 'id'>;

export interface Application {
  id: string; scholarship_id: string; student_id: string;
  application_date: string; motivation: string; document_url: string;
  declaration: boolean; selection_status: SelectionStatus;
  selection_notes: string; selection_date: string;
  scholarship_name?: string; scholarship_code?: string;
  academic_year?: string;
  student_name?: string; student_nim?: string;
  student_gpa?: number | null; student_semester?: number | null;
}

export interface ApplicationInput {
  scholarship_id: string; student_id: string;
  motivation: string; document_url: string; declaration: boolean;
}

export interface DashboardSummary {
  total_students: number; total_scholarships: number; total_applications: number;
  total_pending: number; total_accepted: number; total_rejected: number; acceptance_rate: number;
}

export interface ApplicationStatistic {
  name: string; total: number; accepted: number; rejected: number; pending: number;
}

export interface ScholarshipStatistic {
  id: string; name: string; code: string; quota: number;
  applicants: number; accepted: number; remaining: number;
}

export interface QuotaSummary {
  scholarship_id: string; scholarship_name: string;
  quota: number; accepted: number; remaining: number;
}

export interface PublicSelectionResult {
  id: string; scholarship_name: string; scholarship_code: string;
  student_name: string; student_nim: string;
  selection_status: SelectionStatus; selection_notes: string;
  selection_date: string; academic_year: string;
}

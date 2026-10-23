import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { Application, ApplicationInput } from '../types';

export const applicationService = {
  list: (params: { scholarship_id?: string; selection_status?: string; search?: string } = {}) =>
    apiClient.get<Application[]>(ENDPOINTS.APPLICATION.LIST, params),
  getById: (id: string) => apiClient.get<Application>(ENDPOINTS.APPLICATION.GET, { id }),
  listByStudent: (studentId: string) => apiClient.get<Application[]>(ENDPOINTS.APPLICATION.BY_STUDENT, { student_id: studentId }),
  create: (input: ApplicationInput) => apiClient.post<Application>(ENDPOINTS.APPLICATION.CREATE, { ...input }),
  update: (id: string, input: { motivation?: string; document_url?: string }) =>
    apiClient.post<Application>(ENDPOINTS.APPLICATION.UPDATE, { id, ...input }),
};
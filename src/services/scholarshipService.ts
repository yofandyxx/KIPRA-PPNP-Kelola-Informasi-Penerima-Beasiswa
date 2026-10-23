import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { Scholarship, ScholarshipInput } from '../types';

export const scholarshipService = {
  list: (params: { search?: string; status?: string } = {}) => apiClient.get<Scholarship[]>(ENDPOINTS.SCHOLARSHIP.LIST, params),
  getById: (id: string) => apiClient.get<Scholarship>(ENDPOINTS.SCHOLARSHIP.GET, { id }),
  create: (input: ScholarshipInput) => apiClient.post<Scholarship>(ENDPOINTS.SCHOLARSHIP.CREATE, { ...input }),
  update: (id: string, input: Partial<ScholarshipInput>) => apiClient.post<Scholarship>(ENDPOINTS.SCHOLARSHIP.UPDATE, { id, ...input }),
  remove: (id: string) => apiClient.post<{ id: string }>(ENDPOINTS.SCHOLARSHIP.DELETE, { id }),
};
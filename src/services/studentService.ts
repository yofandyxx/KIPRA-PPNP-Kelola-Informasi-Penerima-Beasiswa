import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { Student, StudentInput } from '../types';

export const studentService = {
  list: (params: { search?: string } = {}) => apiClient.get<Student[]>(ENDPOINTS.STUDENT.LIST, params),
  getById: (id: string) => apiClient.get<Student>(ENDPOINTS.STUDENT.GET, { id }),
  create: (input: StudentInput) => apiClient.post<Student>(ENDPOINTS.STUDENT.CREATE, { ...input }),
  update: (id: string, input: Partial<StudentInput>) => apiClient.post<Student>(ENDPOINTS.STUDENT.UPDATE, { id, ...input }),
  remove: (id: string) => apiClient.post<{ id: string }>(ENDPOINTS.STUDENT.DELETE, { id }),
};
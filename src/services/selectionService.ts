import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { Application, PublicSelectionResult, QuotaSummary } from '../types';

export const selectionService = {
  select: (id: string, input: { selection_status: string; selection_notes: string }) =>
    apiClient.post<Application>(ENDPOINTS.SELECTION.SELECT, { id, ...input }),
  listResults: (params: { scholarship_id?: string; selection_status?: string; academic_year?: string } = {}) =>
    apiClient.get<PublicSelectionResult[]>(ENDPOINTS.SELECTION.RESULTS, params),
  getQuotaSummary: (scholarshipId: string) =>
    apiClient.get<QuotaSummary>(ENDPOINTS.SELECTION.QUOTA_SUMMARY, { scholarship_id: scholarshipId }),
};
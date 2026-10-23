import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApplicationStatistic, DashboardSummary, ScholarshipStatistic } from '../types';

export const dashboardService = {
  getSummary: () => apiClient.get<DashboardSummary>(ENDPOINTS.DASHBOARD.SUMMARY),
  getApplicationStats: (scholarshipId?: string) =>
    apiClient.get<ApplicationStatistic[]>(ENDPOINTS.DASHBOARD.APPLICATION_STATS, scholarshipId ? { scholarship_id: scholarshipId } : {}),
  getScholarshipStats: () => apiClient.get<ScholarshipStatistic[]>(ENDPOINTS.DASHBOARD.SCHOLARSHIP_STATS),
};
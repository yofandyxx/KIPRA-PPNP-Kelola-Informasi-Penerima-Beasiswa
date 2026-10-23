import { ApiError } from '../api/apiClient';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan yang tidak diketahui.';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT');
}
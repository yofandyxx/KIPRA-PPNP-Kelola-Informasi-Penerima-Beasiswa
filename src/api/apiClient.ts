import { API_CONFIG } from './config';
import { ApiResponse } from '../types';

export class ApiError extends Error {
  public readonly code: string;
  constructor(message: string, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  let json: ApiResponse<T>;
  try {
    json = JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new ApiError('Respons server bukan JSON valid. Periksa URL deployment.', 'INVALID_JSON');
  }
  if (!response.ok) throw new ApiError(json.message || `HTTP ${response.status}`, 'HTTP_ERROR');
  if (!json.success) throw new ApiError(json.message || 'Operasi tidak berhasil.', 'BUSINESS_ERROR');
  return json;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new ApiError('Permintaan melebihi batas waktu.', 'TIMEOUT')), ms);
    promise.then((v) => { clearTimeout(timer); resolve(v); })
      .catch((e) => { clearTimeout(timer); reject(e); });
  });
}

export const apiClient = {
  async get<T>(action: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
    const query = new URLSearchParams({ action });
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) query.append(k, String(v));
    });
    const url = `${API_CONFIG.BASE_URL}?${query.toString()}`;
    try {
      const response = await withTimeout(fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }), API_CONFIG.TIMEOUT_MS);
      const json = await parseResponse<T>(response);
      return json.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet.', 'NETWORK_ERROR');
    }
  },

  async post<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
    try {
      const response = await withTimeout(fetch(API_CONFIG.BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action, ...body }),
      }), API_CONFIG.TIMEOUT_MS);
      const json = await parseResponse<T>(response);
      return json.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet.', 'NETWORK_ERROR');
    }
  },
};
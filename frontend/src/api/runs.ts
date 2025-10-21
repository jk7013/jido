import { apiClient } from './client';
import { Run } from '../stores/useRunsStore';

export interface RunsResponse {
  runs: Run[];
  total: number;
  page: number;
  limit: number;
}

export interface ResultsResponse {
  run: Run;
  result: any;
  raw: any;
  processed?: any;
  json_path?: string;
}

export interface LogsResponse {
  run: Run;
  steps: Array<{
    id: string;
    step_type: string;
    duration_ms: number;
    model?: string;
    tokens_in?: number;
    tokens_out?: number;
    cost_usd?: number;
    error_code?: string;
    data: any;
  }>;
}

export const runsApi = {
  // 최근 실행 목록
  getRuns: async (params: {
    limit?: number;
    search?: string;
    page?: number;
  } = {}): Promise<RunsResponse> => {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page.toString());
    
    const response = await apiClient.get<RunsResponse>(`/runs?${query}`);
    return response.data;
  },

  // 결과 조회
  getResults: async (runId: string): Promise<ResultsResponse> => {
    const response = await apiClient.get<ResultsResponse>(`/results/${runId}`);
    return response.data;
  },

  // 로그 조회
  getLogs: async (runId: string, tab?: string): Promise<LogsResponse> => {
    const query = tab ? `?tab=${tab}` : '';
    const response = await apiClient.get<LogsResponse>(`/logs/${runId}${query}`);
    return response.data;
  },
};

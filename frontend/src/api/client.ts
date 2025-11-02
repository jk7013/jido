interface ApiError {
  error_code: string;
  message: string;
  trace_id: string;
  hint?: string;
}

interface ApiResponse<T = any> {
  ok: boolean;
  data: T;
  error?: ApiError;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json().catch(() => ({}));
      
      return {
        ok: response.ok,
        data,
        error: response.ok ? undefined : data as ApiError,
      };
    } catch (error) {
      return {
        ok: false,
        data: {} as T,
        error: {
          error_code: 'NETWORK_ERROR',
          message: '네트워크 오류가 발생했습니다.',
          trace_id: '',
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 백오프 처리
  async requestWithBackoff<T>(
    endpoint: string,
    data: any,
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> {
    const backoff = [100, 300, 900]; // ms
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await this.post<T>(endpoint, data);
      
      if (response.ok) {
        return response;
      }

      const isRetryable = response.error?.error_code === 'RATE_429' || 
                         response.error?.error_code === 'LLM_5XX';
      
      if (!isRetryable || attempt >= backoff.length - 1) {
        return response;
      }

      const waitTime = backoff[attempt];
      
      // 토스트 알림 (구현 필요)
      console.log(`재시도 대기중… ${waitTime}ms (사유: ${response.error?.error_code})`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    return {
      ok: false,
      data: {} as T,
      error: {
        error_code: 'MAX_RETRIES_EXCEEDED',
        message: '최대 재시도 횟수를 초과했습니다.',
        trace_id: '',
      },
    };
  }
}

export const apiClient = new ApiClient();
export type { ApiError, ApiResponse };

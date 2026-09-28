import { API_URL } from '../config/env';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export type QueryParams = Record<string, string | number | undefined>;

export interface ApiRequestInit {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: QueryParams;
  /** JWT для заголовка `Authorization: Bearer`. */
  token?: string;
}

function buildUrl(path: string, query?: QueryParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const search = params.toString();
  return `${API_URL}${path}${search ? `?${search}` : ''}`;
}

/** JSON-запрос к API. Не-2xx ответ превращается в `ApiError` с сообщением сервера. */
export async function apiRequest<TResponse>(
  path: string,
  { method = 'GET', body, query, token }: ApiRequestInit = {},
): Promise<TResponse> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Что-то пошло не так. Попробуйте ещё раз';
    throw new ApiError(response.status, message);
  }
  return data as TResponse;
}

export function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return apiRequest<TResponse>(path, { method: 'POST', body });
}

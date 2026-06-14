// lib/api.ts — Clerk-aware fetch wrapper (sin Express, sin JWT propio)
const BASE = '/api';

async function req(method: string, path: string, body?: unknown): Promise<any> {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(BASE + path, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (url: string, config?: { params?: Record<string, string | number> }) => {
    const qs = config?.params ? '?' + new URLSearchParams(Object.fromEntries(
      Object.entries(config.params).map(([k,v]) => [k, String(v)])
    )).toString() : '';
    return req('GET', url + qs);
  },
  post:   (url: string, data?: unknown) => req('POST',   url, data),
  put:    (url: string, data?: unknown) => req('PUT',    url, data),
  patch:  (url: string, data?: unknown) => req('PATCH',  url, data),
  delete: (url: string)                 => req('DELETE', url),
};

export default api;
// Compat shims (archivos viejos que importan esto)
export const getTokens = () => null;
export const setTokens = (_?: unknown) => {};
export const clearTokens = () => {};

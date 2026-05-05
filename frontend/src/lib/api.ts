// ============================================================
// lib/api.ts — Cliente HTTP centralizado
// Base URL configurable desde variable de entorno
// Backend Biblioteca Comunitaria corre en puerto 3001
// ============================================================

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const messages: string[] = Array.isArray(error.message)
      ? error.message
      : [error.message ?? "Error desconocido"];
    throw new ApiError(res.status, messages);
  }

  // 204 No Content (DELETE)
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[]
  ) {
    super(messages.join(", "));
    this.name = "ApiError";
  }
}

export const api = {
  get:    <T>(path: string)              => request<T>("GET",    path),
  post:   <T>(path: string, body: unknown) => request<T>("POST",   path, body),
  patch:  <T>(path: string, body: unknown) => request<T>("PATCH",  path, body),
  delete: <T>(path: string)              => request<T>("DELETE", path),
};

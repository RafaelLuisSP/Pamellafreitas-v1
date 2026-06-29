import Constants from 'expo-constants';
import type {
  AuthResponse,
  AuthTokens,
  Child,
  Guardian,
  AnamneseSession,
  AnamneseAnswers,
  QuestionnaireGroup,
} from '@pf/shared';
import { storage } from '../storage/storage';

const TOKENS_KEY = 'pf.tokens';

const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:8787';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const raw = await storage.get(TOKENS_KEY);
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as AuthTokens;
    accessToken = t.accessToken;
    refreshToken = t.refreshToken;
    return t;
  } catch {
    return null;
  }
}

export async function setTokens(tokens: AuthTokens | null): Promise<void> {
  accessToken = tokens?.accessToken ?? null;
  refreshToken = tokens?.refreshToken ?? null;
  if (tokens) await storage.set(TOKENS_KEY, JSON.stringify(tokens));
  else await storage.remove(TOKENS_KEY);
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { tokens: AuthTokens };
  await setTokens(data.tokens);
  return true;
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && retry && (await tryRefresh())) {
    return request<T>(path, init, false);
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string }).error ?? 'Erro inesperado', data);
  }
  return data as T;
}

export const api = {
  baseUrl: API_URL,

  // Magic link: solicitar o e-mail de acesso (sem senha).
  async requestMagicLink(input: { email: string; consent: boolean; turnstileToken?: string }) {
    return request<{ ok: boolean; message: string }>('/auth/magic/request', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Magic link: verificar o token recebido por e-mail e abrir a sessao.
  async verifyMagicLink(token: string) {
    const data = await request<AuthResponse & { isNew: boolean }>('/auth/magic/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    await setTokens(data.tokens);
    return data;
  },

  // Onboarding: salvar o nome do responsavel apos o 1o acesso.
  updateProfile: (name: string) =>
    request<{ guardian: Guardian }>('/account/me', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),

  me: () => request<{ guardian: Guardian }>('/account/me'),

  listChildren: () => request<{ children: Child[] }>('/children'),
  createChild: (input: { name: string; birthdate?: string | null }) =>
    request<{ child: Child }>('/children', { method: 'POST', body: JSON.stringify(input) }),
  deleteChild: (id: string) => request<{ ok: boolean }>(`/children/${id}`, { method: 'DELETE' }),

  questionnaire: () => request<{ groups: QuestionnaireGroup[] }>('/anamnese/questionnaire'),
  getAnamnese: (childId: string) =>
    request<{ session: AnamneseSession; answers: AnamneseAnswers }>(`/anamnese/${childId}`),
  saveAnamnese: (childId: string, body: { answers: AnamneseAnswers; currentGroup?: number }) =>
    request<{ session: AnamneseSession; answers: AnamneseAnswers }>(`/anamnese/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  submitAnamnese: (childId: string) =>
    request<{ session: AnamneseSession }>(`/anamnese/${childId}/submit`, { method: 'POST' }),

  exportData: () => request<Record<string, unknown>>('/account/export'),
  deleteAccount: () => request<{ ok: boolean }>('/account', { method: 'DELETE' }),
};

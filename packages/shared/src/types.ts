// Tipos de dominio compartilhados entre a API (Cloudflare Workers) e o app (Expo / RN Web).

export interface Guardian {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

export interface Child {
  id: string;
  guardianId: string;
  name: string;
  birthdate: string | null; // ISO yyyy-mm-dd
  createdAt: number;
  updatedAt: number;
}

export type AnamneseStatus = 'draft' | 'submitted';

export interface AnamneseSession {
  id: string;
  childId: string;
  status: AnamneseStatus;
  currentGroup: number;
  submittedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export type AnamneseAnswers = Record<string, string>;

export interface AnamneseState {
  session: AnamneseSession;
  answers: AnamneseAnswers;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  guardian: Guardian;
  tokens: AuthTokens;
}

export interface ConsentRecord {
  id: string;
  guardianId: string;
  type: string;
  granted: boolean;
  version: string;
  createdAt: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

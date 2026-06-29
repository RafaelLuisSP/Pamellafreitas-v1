import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  JWT_SECRET: string;
  ALLOWED_ORIGIN?: string;
  CONSENT_VERSION?: string;
  // Magic link (login sem senha) + e-mail transacional (Resend)
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string; // ex.: "Pâmella Freitas <acesso@pamellafreitas.com>"
  APP_URL?: string; // base do app web para montar o link (ex.: https://pamellafreitas.com)
  PSICOLOGA_EMAIL?: string; // destino das notificacoes de anamnese enviada (futuro)
}

// Generics do Hono: bindings (env) + variables (estado por request).
export type AppEnv = {
  Bindings: Env;
  Variables: { guardianId: string };
};

// Tokens de magic link (login sem senha) guardados no KV com TTL e uso unico.
import { bytesToB64url } from './crypto';
import type { Env } from '../types';

const PREFIX = 'magic:';
const TTL_SECONDS = 15 * 60; // 15 minutos

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Gera o token (retornado em claro para o e-mail) e guarda apenas o hash no KV.
export async function createMagicToken(env: Env, email: string): Promise<string> {
  const raw = bytesToB64url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await sha256Hex(raw);
  await env.KV.put(
    `${PREFIX}${hash}`,
    JSON.stringify({ email, createdAt: Date.now() }),
    { expirationTtl: TTL_SECONDS },
  );
  return raw;
}

// Valida e CONSOME o token (uso unico). Retorna o e-mail associado ou null.
export async function consumeMagicToken(env: Env, raw: string): Promise<string | null> {
  const hash = await sha256Hex(raw);
  const key = `${PREFIX}${hash}`;
  const stored = await env.KV.get(key);
  if (!stored) return null;
  await env.KV.delete(key); // single-use: invalida imediatamente
  try {
    const data = JSON.parse(stored) as { email?: string };
    return data.email ?? null;
  } catch {
    return null;
  }
}

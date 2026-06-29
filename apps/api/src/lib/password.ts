import { bytesToB64url, b64urlToBytes, timingSafeEqual } from './crypto';

const ITERATIONS = 100_000;
const KEY_LEN_BITS = 256;

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    KEY_LEN_BITS,
  );
  return new Uint8Array(bits);
}

// Formato armazenado: pbkdf2$<iter>$<salt_b64url>$<hash_b64url>
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${bytesToB64url(salt)}$${bytesToB64url(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const [scheme, iterStr, saltB64, hashB64] = parts as [string, string, string, string];
  if (scheme !== 'pbkdf2') return false;
  const iterations = Number.parseInt(iterStr, 10);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  const hash = await pbkdf2(password, b64urlToBytes(saltB64), iterations);
  return timingSafeEqual(hash, b64urlToBytes(hashB64));
}

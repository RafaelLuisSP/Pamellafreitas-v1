import { bytesToB64url, b64urlToBytes, strToB64url, b64urlToStr, timingSafeEqual } from './crypto';

export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  type: TokenType;
  iat: number;
  exp: number;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signJwt(payload: JwtPayload, secret: string): Promise<string> {
  const header = strToB64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = strToB64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${bytesToB64url(new Uint8Array(sig))}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed token');
  const [header, body, sig] = parts as [string, string, string];
  const data = `${header}.${body}`;
  const key = await hmacKey(secret);
  const expected = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)),
  );
  if (!timingSafeEqual(expected, b64urlToBytes(sig))) throw new Error('invalid signature');
  const payload = JSON.parse(b64urlToStr(body)) as JwtPayload;
  if (typeof payload.exp !== 'number' || Math.floor(Date.now() / 1000) >= payload.exp) {
    throw new Error('token expired');
  }
  return payload;
}

const ACCESS_TTL = 60 * 60; // 1h
const REFRESH_TTL = 60 * 60 * 24 * 30; // 30d

export async function issueTokens(sub: string, secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const accessToken = await signJwt({ sub, type: 'access', iat: now, exp: now + ACCESS_TTL }, secret);
  const refreshToken = await signJwt({ sub, type: 'refresh', iat: now, exp: now + REFRESH_TTL }, secret);
  return { accessToken, refreshToken };
}

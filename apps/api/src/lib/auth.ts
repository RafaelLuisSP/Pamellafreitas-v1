import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../types';
import { verifyJwt } from './jwt';
import { unauthorized } from './http';

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) throw unauthorized();
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    if (payload.type !== 'access') throw unauthorized('Token invalido');
    c.set('guardianId', payload.sub);
  } catch (err) {
    if (err instanceof Error && err.message === 'Token invalido') throw err;
    throw unauthorized('Sessao invalida ou expirada');
  }
  await next();
});

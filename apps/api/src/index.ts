import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ZodError } from 'zod';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppEnv } from './types';
import { HttpError } from './lib/http';
import { requireAuth } from './lib/auth';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { childrenRoutes } from './routes/children';
import { anamneseRoutes } from './routes/anamnese';
import { accountRoutes } from './routes/account';

const app = new Hono<AppEnv>();

app.use('*', (c, next) =>
  cors({
    origin: c.env.ALLOWED_ORIGIN ?? '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })(c, next),
);

// Publicas
app.route('/', healthRoutes);
app.route('/auth', authRoutes);

// Protegidas (JWT custom)
const api = new Hono<AppEnv>();
api.use('*', requireAuth);
api.route('/account', accountRoutes);
api.route('/children', childrenRoutes);
api.route('/anamnese', anamneseRoutes);
app.route('/', api);

app.notFound((c) => c.json({ error: 'Rota nao encontrada' }, 404));

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ error: 'Dados invalidos', details: err.flatten() }, 400);
  }
  if (err instanceof HttpError) {
    return c.json({ error: err.message, details: err.details }, err.status as ContentfulStatusCode);
  }
  if (err instanceof SyntaxError) {
    return c.json({ error: 'Corpo da requisicao invalido (JSON)' }, 400);
  }
  console.error('Erro nao tratado:', err);
  return c.json({ error: 'Erro interno do servidor' }, 500);
});

export default app;

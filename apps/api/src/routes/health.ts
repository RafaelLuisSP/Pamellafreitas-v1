import { Hono } from 'hono';
import type { AppEnv } from '../types';

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get('/', (c) =>
  c.json({
    ok: true,
    service: 'Pamella Freitas API',
    description: 'Anamnese infantil online + painel de atendimentos',
    time: new Date().toISOString(),
  }),
);

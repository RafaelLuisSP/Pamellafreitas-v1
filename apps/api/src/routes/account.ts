import { Hono } from 'hono';
import { eq, inArray } from 'drizzle-orm';
import type { AppEnv } from '../types';
import { getDb } from '../db';
import { guardians, children, anamneseSessions, anamneseAnswers, consents } from '../db/schema';
import { notFound } from '../lib/http';
import { deleteGuardianDeep } from '../lib/repo';
import { profileSchema } from '../validation';

export const accountRoutes = new Hono<AppEnv>();

accountRoutes.get('/me', async (c) => {
  const db = getDb(c.env);
  const g = await db.select().from(guardians).where(eq(guardians.id, c.get('guardianId'))).get();
  if (!g) throw notFound('Conta nao encontrada');
  return c.json({
    guardian: { id: g.id, name: g.name, email: g.email, createdAt: g.createdAt, updatedAt: g.updatedAt },
  });
});

// Atualizar o nome do responsavel (onboarding apos o 1o acesso por magic link).
accountRoutes.patch('/me', async (c) => {
  const body = profileSchema.parse(await c.req.json());
  const db = getDb(c.env);
  const gid = c.get('guardianId');
  await db.update(guardians).set({ name: body.name, updatedAt: Date.now() }).where(eq(guardians.id, gid));
  const g = await db.select().from(guardians).where(eq(guardians.id, gid)).get();
  if (!g) throw notFound('Conta nao encontrada');
  return c.json({
    guardian: { id: g.id, name: g.name, email: g.email, createdAt: g.createdAt, updatedAt: g.updatedAt },
  });
});

// Portabilidade LGPD: todos os dados do responsavel em JSON.
accountRoutes.get('/export', async (c) => {
  const db = getDb(c.env);
  const gid = c.get('guardianId');
  const g = await db.select().from(guardians).where(eq(guardians.id, gid)).get();
  if (!g) throw notFound('Conta nao encontrada');

  const kids = await db.select().from(children).where(eq(children.guardianId, gid));
  const childIds = kids.map((k) => k.id);
  const sessions = childIds.length
    ? await db.select().from(anamneseSessions).where(inArray(anamneseSessions.childId, childIds))
    : [];
  const sessionIds = sessions.map((s) => s.id);
  const answers = sessionIds.length
    ? await db.select().from(anamneseAnswers).where(inArray(anamneseAnswers.sessionId, sessionIds))
    : [];
  const consentRows = await db.select().from(consents).where(eq(consents.guardianId, gid));

  return c.json({
    exportedAt: new Date().toISOString(),
    guardian: { id: g.id, name: g.name, email: g.email, createdAt: g.createdAt },
    consents: consentRows,
    children: kids,
    anamneseSessions: sessions,
    anamneseAnswers: answers,
  });
});

// Exclusao definitiva (direito ao esquecimento - LGPD).
accountRoutes.delete('/', async (c) => {
  const db = getDb(c.env);
  await deleteGuardianDeep(db, c.get('guardianId'));
  return c.json({ ok: true, message: 'Conta e todos os dados foram excluidos.' });
});

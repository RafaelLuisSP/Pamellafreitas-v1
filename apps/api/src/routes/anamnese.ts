import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { QUESTIONNAIRE, isValidQuestionId, type AnamneseAnswers } from '@pf/shared';
import type { AppEnv } from '../types';
import { getDb, type Db } from '../db';
import { children, anamneseSessions, anamneseAnswers } from '../db/schema';
import { uuid } from '../lib/crypto';
import { notFound, badRequest } from '../lib/http';
import { answersSchema } from '../validation';

export const anamneseRoutes = new Hono<AppEnv>();

async function getOwnedChild(db: Db, guardianId: string, childId: string) {
  const child = await db
    .select()
    .from(children)
    .where(and(eq(children.id, childId), eq(children.guardianId, guardianId)))
    .get();
  if (!child) throw notFound('Crianca nao encontrada');
  return child;
}

async function getOrCreateSession(db: Db, childId: string) {
  const existing = await db
    .select()
    .from(anamneseSessions)
    .where(eq(anamneseSessions.childId, childId))
    .get();
  if (existing) return existing;
  const now = Date.now();
  const row = {
    id: uuid(),
    childId,
    status: 'draft' as const,
    currentGroup: 1,
    submittedAt: null as number | null,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(anamneseSessions).values(row);
  return row;
}

async function answersMap(db: Db, sessionId: string): Promise<AnamneseAnswers> {
  const rows = await db
    .select()
    .from(anamneseAnswers)
    .where(eq(anamneseAnswers.sessionId, sessionId));
  const map: AnamneseAnswers = {};
  for (const r of rows) map[r.questionId] = r.value;
  return map;
}

// Estrutura do questionario (publica para o app montar a UI).
anamneseRoutes.get('/questionnaire', (c) => c.json({ groups: QUESTIONNAIRE }));

// Estado da anamnese de uma crianca.
anamneseRoutes.get('/:childId', async (c) => {
  const db = getDb(c.env);
  await getOwnedChild(db, c.get('guardianId'), c.req.param('childId'));
  const session = await getOrCreateSession(db, c.req.param('childId'));
  return c.json({ session, answers: await answersMap(db, session.id) });
});

// Salvar rascunho (upsert por pergunta).
anamneseRoutes.put('/:childId', async (c) => {
  const body = answersSchema.parse(await c.req.json());
  const db = getDb(c.env);
  await getOwnedChild(db, c.get('guardianId'), c.req.param('childId'));
  const session = await getOrCreateSession(db, c.req.param('childId'));
  const now = Date.now();

  for (const [questionId, value] of Object.entries(body.answers)) {
    if (!isValidQuestionId(questionId)) throw badRequest(`Pergunta desconhecida: ${questionId}`);
    await db
      .insert(anamneseAnswers)
      .values({ id: uuid(), sessionId: session.id, questionId, value, updatedAt: now })
      .onConflictDoUpdate({
        target: [anamneseAnswers.sessionId, anamneseAnswers.questionId],
        set: { value, updatedAt: now },
      });
  }

  await db
    .update(anamneseSessions)
    .set({ currentGroup: body.currentGroup ?? session.currentGroup, updatedAt: now })
    .where(eq(anamneseSessions.id, session.id));

  const updated = await db.select().from(anamneseSessions).where(eq(anamneseSessions.id, session.id)).get();
  return c.json({ session: updated, answers: await answersMap(db, session.id) });
});

// Enviar (finalizar) a anamnese.
anamneseRoutes.post('/:childId/submit', async (c) => {
  const db = getDb(c.env);
  await getOwnedChild(db, c.get('guardianId'), c.req.param('childId'));
  const session = await getOrCreateSession(db, c.req.param('childId'));
  const now = Date.now();
  await db
    .update(anamneseSessions)
    .set({ status: 'submitted', submittedAt: now, updatedAt: now })
    .where(eq(anamneseSessions.id, session.id));
  const updated = await db.select().from(anamneseSessions).where(eq(anamneseSessions.id, session.id)).get();
  return c.json({ session: updated });
});

import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import type { AppEnv } from '../types';
import { getDb } from '../db';
import { children } from '../db/schema';
import { uuid } from '../lib/crypto';
import { notFound } from '../lib/http';
import { childSchema } from '../validation';
import { deleteChildDeep } from '../lib/repo';

export const childrenRoutes = new Hono<AppEnv>();

childrenRoutes.get('/', async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(children).where(eq(children.guardianId, c.get('guardianId')));
  return c.json({ children: rows });
});

childrenRoutes.post('/', async (c) => {
  const body = childSchema.parse(await c.req.json());
  const db = getDb(c.env);
  const now = Date.now();
  const row = {
    id: uuid(),
    guardianId: c.get('guardianId'),
    name: body.name,
    birthdate: body.birthdate ?? null,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(children).values(row);
  return c.json({ child: row }, 201);
});

childrenRoutes.get('/:id', async (c) => {
  const db = getDb(c.env);
  const child = await db
    .select()
    .from(children)
    .where(and(eq(children.id, c.req.param('id')), eq(children.guardianId, c.get('guardianId'))))
    .get();
  if (!child) throw notFound('Crianca nao encontrada');
  return c.json({ child });
});

childrenRoutes.patch('/:id', async (c) => {
  const body = childSchema.partial().parse(await c.req.json());
  const db = getDb(c.env);
  const id = c.req.param('id');
  const child = await db
    .select()
    .from(children)
    .where(and(eq(children.id, id), eq(children.guardianId, c.get('guardianId'))))
    .get();
  if (!child) throw notFound('Crianca nao encontrada');
  await db
    .update(children)
    .set({
      name: body.name ?? child.name,
      birthdate: body.birthdate === undefined ? child.birthdate : body.birthdate ?? null,
      updatedAt: Date.now(),
    })
    .where(eq(children.id, id));
  const updated = await db.select().from(children).where(eq(children.id, id)).get();
  return c.json({ child: updated });
});

childrenRoutes.delete('/:id', async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const child = await db
    .select()
    .from(children)
    .where(and(eq(children.id, id), eq(children.guardianId, c.get('guardianId'))))
    .get();
  if (!child) throw notFound('Crianca nao encontrada');
  await deleteChildDeep(db, id);
  return c.json({ ok: true });
});

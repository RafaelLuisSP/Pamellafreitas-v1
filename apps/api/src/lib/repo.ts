import { eq, inArray } from 'drizzle-orm';
import type { Db } from '../db';
import { children, anamneseSessions, anamneseAnswers, consents, guardians } from '../db/schema';

// D1/SQLite nao habilita PRAGMA foreign_keys por padrao: fazemos a cascata na mao.
export async function deleteChildDeep(db: Db, childId: string): Promise<void> {
  const sessions = await db
    .select({ id: anamneseSessions.id })
    .from(anamneseSessions)
    .where(eq(anamneseSessions.childId, childId));
  const sessionIds = sessions.map((s) => s.id);
  if (sessionIds.length > 0) {
    await db.delete(anamneseAnswers).where(inArray(anamneseAnswers.sessionId, sessionIds));
  }
  await db.delete(anamneseSessions).where(eq(anamneseSessions.childId, childId));
  await db.delete(children).where(eq(children.id, childId));
}

// Exclusao total da conta (direito LGPD do responsavel).
export async function deleteGuardianDeep(db: Db, guardianId: string): Promise<void> {
  const kids = await db
    .select({ id: children.id })
    .from(children)
    .where(eq(children.guardianId, guardianId));
  for (const k of kids) await deleteChildDeep(db, k.id);
  await db.delete(consents).where(eq(consents.guardianId, guardianId));
  await db.delete(guardians).where(eq(guardians.id, guardianId));
}

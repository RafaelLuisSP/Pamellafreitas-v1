import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

// Responsavel legal (quem cria a conta e responde a anamnese).
export const guardians = sqliteTable('guardians', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Registro de consentimento LGPD (dado sensivel de menor).
export const consents = sqliteTable(
  'consents',
  {
    id: text('id').primaryKey(),
    guardianId: text('guardian_id')
      .notNull()
      .references(() => guardians.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    granted: integer('granted').notNull(), // 0 | 1
    version: text('version').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({ byGuardian: index('idx_consents_guardian').on(t.guardianId) }),
);

// Crianca (menor de 14). Nunca acessa o sistema diretamente.
export const children = sqliteTable(
  'children',
  {
    id: text('id').primaryKey(),
    guardianId: text('guardian_id')
      .notNull()
      .references(() => guardians.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    birthdate: text('birthdate'), // ISO yyyy-mm-dd | null
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => ({ byGuardian: index('idx_children_guardian').on(t.guardianId) }),
);

// Uma sessao de anamnese por crianca.
export const anamneseSessions = sqliteTable('anamnese_sessions', {
  id: text('id').primaryKey(),
  childId: text('child_id')
    .notNull()
    .unique()
    .references(() => children.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('draft'),
  currentGroup: integer('current_group').notNull().default(1),
  submittedAt: integer('submitted_at'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Respostas individuais (upsert por pergunta).
export const anamneseAnswers = sqliteTable(
  'anamnese_answers',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id')
      .notNull()
      .references(() => anamneseSessions.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull(),
    value: text('value').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => ({
    uniqAnswer: uniqueIndex('uq_answer').on(t.sessionId, t.questionId),
    bySession: index('idx_answers_session').on(t.sessionId),
  }),
);

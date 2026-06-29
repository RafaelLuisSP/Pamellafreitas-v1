import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import type { AppEnv } from '../types';
import { getDb } from '../db';
import { guardians, consents } from '../db/schema';
import { issueTokens, verifyJwt } from '../lib/jwt';
import { uuid } from '../lib/crypto';
import { unauthorized, badRequest } from '../lib/http';
import { magicRequestSchema, magicVerifySchema, refreshSchema } from '../validation';
import { createMagicToken, consumeMagicToken } from '../lib/magic';
import { sendEmail, magicLinkEmail } from '../lib/email';

// Verifica o token do Cloudflare Turnstile (anti-bot / forca-bruta) no servidor.
// Sem TURNSTILE_SECRET configurado (ex.: dev local), nao bloqueia.
async function verifyTurnstile(secret: string | undefined, token: string | undefined, ip: string | null): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const authRoutes = new Hono<AppEnv>();

function publicGuardian(g: { id: string; name: string; email: string; createdAt: number; updatedAt: number }) {
  return { id: g.id, name: g.name, email: g.email, createdAt: g.createdAt, updatedAt: g.updatedAt };
}

// 1) Solicitar acesso: gera um magic link e o envia por e-mail (Resend).
//    Resposta neutra: nao revela se o e-mail ja possui conta.
authRoutes.post('/magic/request', async (c) => {
  const body = magicRequestSchema.parse(await c.req.json());

  // Protecao anti-bot/forca-bruta: valida o Turnstile antes de qualquer envio de e-mail.
  const ip = c.req.header('CF-Connecting-IP') ?? null;
  const human = await verifyTurnstile(c.env.TURNSTILE_SECRET, body.turnstileToken, ip);
  if (!human) {
    throw badRequest('Não foi possível confirmar a verificação de segurança. Atualize a página e tente novamente.');
  }

  const email = body.email.toLowerCase();

  const token = await createMagicToken(c.env, email);
  const appUrl = (c.env.APP_URL ?? 'https://pamellafreitas.com').replace(/\/+$/, '');
  const link = `${appUrl}/entrar?token=${encodeURIComponent(token)}`;

  const { subject, html } = magicLinkEmail(link);
  try {
    await sendEmail(c.env, email, subject, html);
  } catch (err) {
    console.error('Falha ao enviar magic link:', err);
    throw badRequest('Nao foi possivel enviar o e-mail agora. Tente novamente em instantes.');
  }

  return c.json({ ok: true, message: 'Se este e-mail estiver correto, enviamos um link de acesso.' });
});

// 2) Verificar o token do e-mail: cria a conta no 1o acesso (com consentimento) e emite tokens.
authRoutes.post('/magic/verify', async (c) => {
  const body = magicVerifySchema.parse(await c.req.json());
  const email = await consumeMagicToken(c.env, body.token);
  if (!email) throw unauthorized('Link invalido ou expirado. Solicite um novo acesso.');

  const db = getDb(c.env);
  const now = Date.now();
  let guardian = await db.select().from(guardians).where(eq(guardians.email, email)).get();
  let isNew = false;

  if (!guardian) {
    isNew = true;
    const id = uuid();
    guardian = { id, name: '', email, passwordHash: '', createdAt: now, updatedAt: now };
    await db.insert(guardians).values(guardian);
    // Consentimento LGPD registrado no 1o acesso (o request exige consent=true).
    await db.insert(consents).values({
      id: uuid(),
      guardianId: id,
      type: 'lgpd_anamnese',
      granted: 1,
      version: c.env.CONSENT_VERSION ?? 'v1',
      createdAt: now,
    });
  }

  const tokens = await issueTokens(guardian.id, c.env.JWT_SECRET);
  // isNew (ou name vazio) sinaliza ao app que falta o onboarding do nome.
  return c.json({ guardian: publicGuardian(guardian), tokens, isNew });
});

// 3) Refresh de sessao (inalterado).
authRoutes.post('/refresh', async (c) => {
  const body = refreshSchema.parse(await c.req.json());
  let sub: string;
  try {
    const payload = await verifyJwt(body.refreshToken, c.env.JWT_SECRET);
    if (payload.type !== 'refresh') throw new Error('wrong type');
    sub = payload.sub;
  } catch {
    throw unauthorized('Sessao expirada. Entre novamente.');
  }
  const tokens = await issueTokens(sub, c.env.JWT_SECRET);
  return c.json({ tokens });
});

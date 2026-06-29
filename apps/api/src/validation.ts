import { z } from 'zod';

// Magic link: solicitar acesso (e-mail + consentimento LGPD obrigatorio).
export const magicRequestSchema = z.object({
  email: z.string().trim().email('E-mail invalido').max(200),
  consent: z.literal(true, { errorMap: () => ({ message: 'O consentimento LGPD e obrigatorio' }) }),
  turnstileToken: z.string().max(2048).optional(),
});

// Magic link: verificar o token recebido por e-mail.
export const magicVerifySchema = z.object({
  token: z.string().min(10).max(200),
});

// Onboarding: nome do responsavel (preenchido apos o 1o acesso).
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').max(120),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const childSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da crianca').max(120),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD')
    .nullish(),
});

export const answersSchema = z.object({
  answers: z.record(z.string(), z.string().max(5000)),
  currentGroup: z.number().int().min(1).max(6).optional(),
});

export type MagicRequestInput = z.infer<typeof magicRequestSchema>;
export type MagicVerifyInput = z.infer<typeof magicVerifySchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChildInput = z.infer<typeof childSchema>;
export type AnswersInput = z.infer<typeof answersSchema>;

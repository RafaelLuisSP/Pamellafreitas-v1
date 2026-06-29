// Envio de e-mail transacional via Resend (https://resend.com).
// Sem SDK: usamos a API HTTP diretamente (compativel com o runtime dos Workers).
import type { Env } from '../types';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Pâmella Freitas <acesso@pamellafreitas.com>';

export async function sendEmail(
  env: Env,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    // Modo desenvolvimento: sem chave, apenas registra (nao quebra o fluxo local).
    console.warn(`[email] RESEND_API_KEY ausente — e-mail para ${to} nao enviado (dev).`);
    return;
  }
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.EMAIL_FROM ?? DEFAULT_FROM, to, subject, html }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend respondeu ${res.status}: ${detail}`);
  }
}

// Template do e-mail de acesso (magic link), na voz e na paleta da marca.
export function magicLinkEmail(link: string): { subject: string; html: string } {
  const subject = 'Seu acesso à área dos pais — Pâmella Freitas';
  const html = `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;background:#F5EFE4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#38342B;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE4;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border-radius:16px;padding:40px;border:1px solid #E7DCC6;">
            <tr><td style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#5F7B57;font-weight:600;">Pâmella Freitas · Psicologia Infantil</td></tr>
            <tr><td style="padding-top:16px;font-size:24px;line-height:1.3;color:#2E3A2C;font-weight:600;">Que bom ter você por aqui</td></tr>
            <tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#7B5E47;">
              Para entrar na área dos pais com segurança, é só tocar no botão abaixo. O link vale por 15 minutos e é de uso único.
            </td></tr>
            <tr><td style="padding-top:28px;">
              <a href="${link}" style="display:inline-block;background:#5F7B57;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;border-radius:999px;">Entrar com segurança</a>
            </td></tr>
            <tr><td style="padding-top:24px;font-size:13px;line-height:1.6;color:#BCB3A2;">
              Se o botão não funcionar, copie e cole este endereço no navegador:<br/>
              <span style="color:#7B5E47;word-break:break-all;">${link}</span>
            </td></tr>
            <tr><td style="padding-top:24px;font-size:13px;line-height:1.6;color:#BCB3A2;border-top:1px solid #E7DCC6;padding-top:20px;margin-top:20px;">
              Se você não pediu este acesso, pode ignorar este e-mail com tranquilidade — nada acontece.
            </td></tr>
          </table>
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr><td style="padding-top:16px;font-size:12px;color:#BCB3A2;text-align:center;">
              Cuidado com sigilo. Dados usados apenas para o atendimento clínico da criança (LGPD).
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return { subject, html };
}

// Configuracao do site institucional da Pamella Freitas.
// Itens marcados com TODO precisam dos dados reais (preencher e dar push).
export const site = {
  nome: 'Pâmella Freitas',
  especialidade: 'Psicologia Infantil',
  lema: 'Toda criança merece ser compreendida antes de ser corrigida.',
  crp: 'CRP 00/00000', // TODO: numero real do CRP
  email: 'contato@pamellafreitas.com', // TODO: confirmar e-mail de contato
  whatsapp: '', // TODO: somente digitos com DDI, ex '5511999999999'
  instagram: '', // TODO: @usuario (sem @)
  atendimento: 'Atendimento on-line e presencial', // TODO: ajustar (cidade/UF, modalidade)
  // Link de agendamento (Calendly/Cal.com). Liberado para a familia APOS o envio
  // da anamnese — e o passo final do fluxo dos pais.
  agendamentoUrl: '', // TODO: URL de agendamento on-line
  // Cloudflare Turnstile (protecao anti-bot no acesso dos pais). Chave do site (publica).
  turnstileSiteKey: '0x4AAAAAADs_aY1NpkaoehvI',
} as const;

// Monta um link de WhatsApp (wa.me) com mensagem opcional. Retorna null se nao configurado.
export function whatsappLink(msg?: string): string | null {
  if (!site.whatsapp) return null;
  const base = `https://wa.me/${site.whatsapp}`;
  return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
}

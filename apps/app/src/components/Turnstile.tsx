// Fallback nativo do Turnstile (iOS/Android). O produto e web-first; no nativo
// o widget nao e exibido. Mantem a mesma interface da versao .web.tsx.
export interface TurnstileProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
}

export function Turnstile(_props: TurnstileProps): null {
  return null;
}

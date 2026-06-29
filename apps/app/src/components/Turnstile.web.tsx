// Widget Cloudflare Turnstile (web). Renderiza o desafio e devolve o token,
// que o AccessScreen envia ao backend para validacao server-side.
import React, { useEffect, useRef } from 'react';
import { site } from '../config';

export interface TurnstileProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
}

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
}

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (getTurnstile()) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      if (getTurnstile()) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener('load', () => resolve(), { once: true });
    document.head.appendChild(s);
  });
}

export function Turnstile({ onToken, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;

  useEffect(() => {
    let active = true;
    void ensureScript().then(() => {
      if (!active) return;
      const ts = getTurnstile();
      const el = containerRef.current;
      if (!ts || !el || widgetId.current) return;
      widgetId.current = ts.render(el, {
        sitekey: site.turnstileSiteKey,
        language: 'pt-br',
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => {
          onTokenRef.current('');
          onExpireRef.current?.();
        },
        'error-callback': () => onTokenRef.current(''),
      });
    });
    return () => {
      active = false;
      const ts = getTurnstile();
      if (ts && widgetId.current) {
        try {
          ts.remove(widgetId.current);
        } catch {
          /* noop */
        }
        widgetId.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ marginBottom: 16, minHeight: 65 }} />;
}

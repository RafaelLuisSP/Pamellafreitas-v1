import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import type { Guardian } from '@pf/shared';
import { api, loadTokens, setTokens } from '../api/client';

interface AuthState {
  guardian: Guardian | null;
  loading: boolean;
  verifying: boolean; // true enquanto valida um magic link vindo da URL
  needsName: boolean; // 1o acesso ainda sem nome do responsavel
  requestMagicLink: (email: string, consent: boolean, turnstileToken?: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// No web, o magic link chega como https://pamellafreitas.com/entrar?token=...
function readTokenFromUrl(): string | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get('token');
  } catch {
    return null;
  }
}

function clearTokenFromUrl(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    (async () => {
      // 1) Magic link na URL tem prioridade (abre a sessao direto).
      const urlToken = readTokenFromUrl();
      if (urlToken) {
        setVerifying(true);
        try {
          const data = await api.verifyMagicLink(urlToken);
          setGuardian(data.guardian);
          clearTokenFromUrl();
          setVerifying(false);
          setLoading(false);
          return;
        } catch {
          clearTokenFromUrl();
          setVerifying(false);
          // segue para tentar uma sessao existente / tela de acesso
        }
      }

      // 2) Sessao previamente salva.
      const tokens = await loadTokens();
      if (tokens) {
        try {
          const { guardian: g } = await api.me();
          setGuardian(g);
        } catch {
          await setTokens(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      guardian,
      loading,
      verifying,
      needsName: !!guardian && guardian.name.trim() === '',
      requestMagicLink: async (email, consent, turnstileToken) => {
        await api.requestMagicLink({ email, consent, turnstileToken });
      },
      updateName: async (name) => {
        const { guardian: g } = await api.updateProfile(name);
        setGuardian(g);
      },
      logout: async () => {
        await setTokens(null);
        setGuardian(null);
      },
      refreshMe: async () => {
        const { guardian: g } = await api.me();
        setGuardian(g);
      },
    }),
    [guardian, loading, verifying],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}

// Componentes do SITE INSTITUCIONAL publico (visitante deslogado).
// Cabecalho + rodape + secoes + blocos reutilizaveis, na identidade da marca.
import React, { type ReactNode } from 'react';
import { View, Text, Pressable, ScrollView, Linking, useWindowDimensions, type ViewStyle, type TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, fonts, shadows } from '../theme/tokens';
import { Logo } from './ui';
import { site } from '../config';
import type { PublicStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList>;
type RouteKey = keyof PublicStackParamList;

const NAV_ITEMS: { key: RouteKey; label: string }[] = [
  { key: 'Inicio', label: 'Início' },
  { key: 'Sobre', label: 'Sobre' },
  { key: 'ComoTrabalho', label: 'Como eu trabalho' },
  { key: 'ParaOsPais', label: 'Para os pais' },
  { key: 'Contato', label: 'Contato' },
];

export function useWide(breakpoint = 880): boolean {
  const { width } = useWindowDimensions();
  return width >= breakpoint;
}

export function useNav() {
  const nav = useNavigation<Nav>();
  return (screen: RouteKey) => nav.navigate(screen as never);
}

/* ------------------------------- Cabecalho ------------------------------ */
export function SiteHeader({ active }: { active: RouteKey }) {
  const go = useNav();
  const wide = useWide();
  return (
    <View style={{ backgroundColor: colors.linho, borderBottomWidth: 1, borderBottomColor: colors.areia }}>
      <View
        style={{
          width: '100%',
          maxWidth: 1140,
          alignSelf: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          flexDirection: wide ? 'row' : 'column',
          alignItems: wide ? 'center' : 'flex-start',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        <Pressable onPress={() => go('Inicio')} accessibilityRole="link">
          <Logo compact />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md }}>
          {NAV_ITEMS.map((it) => (
            <Pressable key={it.key} onPress={() => go(it.key)} accessibilityRole="link">
              <Text
                style={{
                  fontFamily: active === it.key ? fonts.bodyBold : fonts.bodySemibold,
                  fontSize: 14,
                  color: active === it.key ? colors.musgo : colors.madeira,
                }}
              >
                {it.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => go('Entrar')}
            accessibilityRole="button"
            style={({ pressed }) => [
              { backgroundColor: colors.folha, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10, opacity: pressed ? 0.9 : 1 },
              shadows.card,
            ]}
          >
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white }}>Área dos Pais</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* --------------------------------- Rodape -------------------------------- */
export function SiteFooter() {
  const go = useNav();
  const wide = useWide(720);
  return (
    <View style={{ backgroundColor: colors.musgo, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg }}>
      <View style={{ width: '100%', maxWidth: 1000, alignSelf: 'center' }}>
        <View style={{ flexDirection: wide ? 'row' : 'column', justifyContent: 'space-between', gap: spacing.lg }}>
          <View style={{ maxWidth: 360 }}>
            <Logo light />
            <View style={{ height: spacing.sm }} />
            <Text style={{ fontFamily: fonts.italic, fontSize: 15, lineHeight: 23, color: colors.broto }}>{site.lema}</Text>
          </View>
          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.broto }}>
              Navegar
            </Text>
            {NAV_ITEMS.map((it) => (
              <Pressable key={it.key} onPress={() => go(it.key)} accessibilityRole="link">
                <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.linho }}>{it.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => go('Privacidade')} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.linho }}>Privacidade e LGPD</Text>
            </Pressable>
          </View>
          <View style={{ gap: spacing.sm, maxWidth: 280 }}>
            <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.broto }}>
              Contato
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.linho }}>{site.atendimento}</Text>
            {!!site.email && <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.linho }}>{site.email}</Text>}
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.linho }}>{site.crp}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#46523F', marginVertical: spacing.lg }} />
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.nevoa }}>
          © {new Date().getFullYear()} {site.nome} · {site.especialidade}. Este site não substitui uma consulta. Em situações de urgência, procure
          atendimento imediato.
        </Text>
      </View>
    </View>
  );
}

/* ------------------------------- Estrutura ------------------------------- */
export function SiteShell({ active, children }: { active: RouteKey; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.linho }}>
      <SiteHeader active={active} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ width: '100%' }}>{children}</View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

type Tone = 'linho' | 'white' | 'areia' | 'musgo' | 'verde';
function toneBg(tone?: Tone): string {
  if (tone === 'white') return colors.white;
  if (tone === 'areia') return colors.areia;
  if (tone === 'musgo') return colors.musgo;
  if (tone === 'verde') return colors.folha;
  return colors.linho;
}

export function Section({ children, tone, maxWidth = 1000, style }: { children: ReactNode; tone?: Tone; maxWidth?: number; style?: ViewStyle }) {
  return (
    <View style={{ backgroundColor: toneBg(tone), paddingVertical: 56, paddingHorizontal: spacing.lg }}>
      <View style={[{ width: '100%', maxWidth, alignSelf: 'center' }, style]}>{children}</View>
    </View>
  );
}

/* ------------------------------ Tipografia ------------------------------- */
export function Kicker({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, letterSpacing: 1.8, textTransform: 'uppercase', color: light ? colors.broto : colors.folha, marginBottom: spacing.sm }}>
      {children}
    </Text>
  );
}

export function Title({ children, light, style }: { children: ReactNode; light?: boolean; style?: TextStyle }) {
  return (
    <Text style={[{ fontFamily: fonts.displayLight, fontSize: 32, lineHeight: 40, color: light ? colors.linho : colors.musgo }, style]}>{children}</Text>
  );
}

export function Lead({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <Text style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 28, color: light ? colors.areia : colors.madeira }}>{children}</Text>
  );
}

export function Para({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <Text style={{ fontFamily: fonts.body, fontSize: 15.5, lineHeight: 26, color: light ? colors.areia : colors.carvao, marginTop: spacing.sm }}>{children}</Text>
  );
}

/* ----------------------------- Blocos de UI ------------------------------ */
export function FeatureCard({ title, children, accent = colors.broto }: { title: string; children: ReactNode; accent?: string }) {
  return (
    <View style={{ flex: 1, minWidth: 240, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, ...shadows.card }}>
      <View style={{ width: 34, height: 34, borderRadius: radius.pill, backgroundColor: accent, marginBottom: spacing.md }} />
      <Text style={{ fontFamily: fonts.display, fontSize: 19, color: colors.musgo, marginBottom: 6 }}>{title}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.madeira }}>{children}</Text>
    </View>
  );
}

export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <View style={{ flex: 1, minWidth: 240, flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
      <Text style={{ fontFamily: fonts.displayLight, fontSize: 40, lineHeight: 44, color: colors.broto, width: 44 }}>{n}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.musgo, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.madeira }}>{children}</Text>
      </View>
    </View>
  );
}

export function Cluster({ children, gap = spacing.lg }: { children: ReactNode; gap?: number }) {
  const wide = useWide(760);
  return <View style={{ flexDirection: wide ? 'row' : 'column', gap, alignItems: 'stretch' }}>{children}</View>;
}

/* -------------------------------- Botoes --------------------------------- */
export function CTAButton({ label, onPress, tone = 'primary' }: { label: string; onPress: () => void; tone?: 'primary' | 'light' | 'outline' }) {
  const bg = tone === 'primary' ? colors.folha : tone === 'light' ? colors.linho : 'transparent';
  const fg = tone === 'primary' ? colors.white : colors.musgo;
  const border = tone === 'outline' ? { borderWidth: 1.5, borderColor: colors.folha } : null;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        { backgroundColor: bg, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 26, alignItems: 'center', opacity: pressed ? 0.9 : 1 },
        border,
        tone !== 'outline' && shadows.card,
      ]}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function openExternal(url: string) {
  Linking.openURL(url).catch(() => {});
}

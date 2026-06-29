import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
  type KeyboardTypeOptions,
} from 'react-native';
import { colors, spacing, radius, fonts, shadows } from '../theme/tokens';

/* ----------------------------- Tipografia ----------------------------- */
export function Heading({ children, level = 1, style }: { children: ReactNode; level?: 1 | 2 | 3; style?: TextStyle }) {
  const map: Record<number, TextStyle> = {
    1: { fontFamily: fonts.displayLight, fontSize: 34, lineHeight: 40, color: colors.musgo },
    2: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.musgo },
    3: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 24, color: colors.carvao },
  };
  return <Text style={[map[level], style]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: TextStyle }) {
  return (
    <Text style={[{ fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: muted ? colors.madeira : colors.carvao }, style]}>
      {children}
    </Text>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <Text style={{ fontFamily: fonts.italic, fontSize: 18, lineHeight: 27, color: colors.folha }}>{children}</Text>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.madeira }}>
      {children}
    </Text>
  );
}

/* ------------------------------- Layout ------------------------------- */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  if (!scroll) return <View style={styles.screen}>{children}</View>;
  return (
    <ScrollView style={{ backgroundColor: colors.linho }} contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.areia, marginVertical: spacing.md }} />;
}

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text style={{ fontFamily: fonts.display, fontSize: compact ? 22 : 30, color: colors.musgo }}>
        Pâmella Freitas <Text style={{ color: colors.folha }}>🌱</Text>
      </Text>
      {!compact && <Label>Psicologia Infantil</Label>}
    </View>
  );
}

/* ------------------------------ Controles ----------------------------- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const bg = isGhost ? 'transparent' : isPrimary ? colors.folha : colors.areia;
  const fg = isPrimary ? colors.white : colors.musgo;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }: { pressed: boolean }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        isGhost && { paddingVertical: spacing.sm },
        !isGhost && shadows.card,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: fg }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  error,
}: {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  error?: string;
}) {
  return (
    <View style={{ marginBottom: spacing.md, width: '100%' }}>
      {label ? <View style={{ marginBottom: spacing.xs }}><Label>{label}</Label></View> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.nevoa}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, multiline && { minHeight: 110, textAlignVertical: 'top' }, !!error && { borderColor: colors.error }]}
      />
      {error ? <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.error, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}

export function Tag({ children, tone = 'broto' }: { children: ReactNode; tone?: 'broto' | 'terracota' | 'success' }) {
  const bg = tone === 'terracota' ? colors.terracota : tone === 'success' ? colors.success : colors.broto;
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.musgo }}>{children}</Text>
    </View>
  );
}

export function ProgressBar({ progress, caption }: { progress: number; caption?: string }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: '100%', marginVertical: spacing.sm }}>
      <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.areia, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: colors.folha }} />
      </View>
      {caption ? <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.madeira, marginTop: 6 }}>{caption}</Text> : null}
    </View>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <View style={{ backgroundColor: '#F3E2DC', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }}>
      <Text style={{ fontFamily: fonts.body, color: colors.error, fontSize: 14 }}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.linho },
  screenContent: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 640, width: '100%', alignSelf: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, ...shadows.card },
  button: { borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.carvao,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.areia,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
});

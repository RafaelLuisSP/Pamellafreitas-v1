// Tela de acesso por MAGIC LINK (sem senha). O responsavel informa o e-mail,
// concorda com a LGPD e recebe um link de acesso. (Arquivo historico: LoginScreen.tsx.)
import React, { useState } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Logo, Heading, Body, Field, Button, ErrorNote } from '../components/ui';
import { colors, spacing, radius, fonts } from '../theme/tokens';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';
import { Turnstile } from '../components/Turnstile';

export function AccessScreen() {
  const { requestMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  async function onSubmit() {
    setError('');
    if (!email.trim()) {
      setError('Informe seu e-mail para receber o link.');
      return;
    }
    if (!consent) {
      setError('Para continuar, é preciso concordar com o uso dos dados (LGPD).');
      return;
    }
    if (Platform.OS === 'web' && !token) {
      setError('Conclua a verificação de segurança abaixo para continuar.');
      return;
    }
    setLoading(true);
    try {
      await requestMagicLink(email.trim(), consent, token);
      setSent(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Vamos tentar de novo, com calma.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Screen>
          <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
            <Logo />
          </View>
          <Heading level={1}>Verifique seu e-mail</Heading>
          <View style={{ height: spacing.sm }} />
          <Body muted>
            Enviamos um link de acesso para {email.trim()}. Abra o e-mail e toque em “Entrar com segurança”.
            O link vale por 15 minutos e é de uso único.
          </Body>
          <View style={{ height: spacing.lg }} />
          <Button title="Usar outro e-mail" variant="ghost" onPress={() => setSent(false)} />
        </Screen>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
          <Logo />
        </View>
        <Heading level={1}>Que bom ter você aqui</Heading>
        <View style={{ height: spacing.sm }} />
        <Body muted>
          Entre na área dos pais com segurança. Sem senha: enviamos um link de acesso para o seu e-mail.
        </Body>
        <View style={{ height: spacing.lg }} />

        <ErrorNote>{error}</ErrorNote>
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable
          onPress={() => setConsent((v) => !v)}
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.xs, marginBottom: spacing.lg }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: radius.sm,
              borderWidth: 2,
              borderColor: consent ? colors.folha : colors.nevoa,
              backgroundColor: consent ? colors.folha : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.sm,
              marginTop: 2,
            }}
          >
            {consent ? <Text style={{ color: colors.white, fontSize: 14 }}>✓</Text> : null}
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.madeira }}>
            Concordo que os dados informados sejam usados apenas para o atendimento clínico do meu filho, com sigilo, e
            sei que posso solicitar a exclusão a qualquer momento (LGPD).
          </Text>
        </Pressable>

        <Turnstile onToken={setToken} />

        <Button title="Receber link de acesso" onPress={onSubmit} loading={loading} />
      </Screen>
    </SafeAreaView>
  );
}

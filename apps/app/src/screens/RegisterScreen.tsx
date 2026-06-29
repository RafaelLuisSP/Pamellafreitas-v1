// Onboarding: coleta o NOME do responsavel apos o 1o acesso por magic link.
// (Arquivo historico: RegisterScreen.tsx — nao ha mais cadastro com senha.)
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Logo, Heading, Body, Field, Button, ErrorNote } from '../components/ui';
import { spacing } from '../theme/tokens';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

export function OnboardingScreen() {
  const { updateName, logout } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    if (name.trim().length < 2) {
      setError('Como podemos te chamar?');
      return;
    }
    setLoading(true);
    try {
      await updateName(name.trim());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Vamos tentar de novo, com calma.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
          <Logo />
        </View>
        <Heading level={1}>Antes de começar</Heading>
        <View style={{ height: spacing.sm }} />
        <Body muted>
          Como você gostaria de ser chamado(a)? Quem responde a anamnese é sempre o responsável pela criança.
        </Body>
        <View style={{ height: spacing.lg }} />

        <ErrorNote>{error}</ErrorNote>
        <Field
          label="Seu nome"
          value={name}
          onChangeText={setName}
          placeholder="Como podemos te chamar?"
          autoCapitalize="words"
        />

        <Button title="Continuar" onPress={onSubmit} loading={loading} />
        <View style={{ height: spacing.md }} />
        <Button title="Sair" variant="ghost" onPress={() => logout()} />
      </Screen>
    </SafeAreaView>
  );
}

import React, { useCallback, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { Child } from '@pf/shared';
import { Screen, Logo, Heading, Body, Label, Button, Card, Divider, ErrorNote } from '../components/ui';
import { colors, spacing, radius, fonts } from '../theme/tokens';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import type { AppScreenProps } from '../navigation/types';
import { Text } from 'react-native';

export function HomeScreen({ navigation }: AppScreenProps<'Home'>) {
  const { guardian, logout } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { children: list } = await api.listChildren();
      setChildren(list);
    } catch {
      setError('Não consegui carregar agora. Vamos tentar de novo em instantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const first = guardian?.name?.split(' ')[0] ?? 'por aqui';

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Screen>
        <View style={{ marginTop: spacing.md, marginBottom: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo compact />
          <Pressable onPress={logout} hitSlop={8}>
            <Text style={{ fontFamily: fonts.bodySemibold, color: colors.madeira, fontSize: 13 }}>Sair</Text>
          </Pressable>
        </View>

        <Heading level={1}>Olá, {first}</Heading>
        <View style={{ height: spacing.xs }} />
        <Body muted>Aqui você prepara, com calma, o primeiro encontro. Cada criança tem o seu tempo.</Body>
        <View style={{ height: spacing.lg }} />

        <ErrorNote>{error}</ErrorNote>

        <Label>Crianças</Label>
        <View style={{ height: spacing.sm }} />

        {loading ? (
          <ActivityIndicator color={colors.folha} style={{ marginVertical: spacing.lg }} />
        ) : children.length === 0 ? (
          <Card>
            <Body>Ainda não há nada aqui — e tudo bem.</Body>
            <View style={{ height: spacing.xs }} />
            <Body muted>Comece adicionando a criança que será acompanhada.</Body>
          </Card>
        ) : (
          children.map((child) => (
            <Pressable
              key={child.id}
              onPress={() => navigation.navigate('Anamnese', { childId: child.id, childName: child.name })}
              style={{ marginBottom: spacing.sm }}
            >
              <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Heading level={3}>{child.name}</Heading>
                  <Body muted>Abrir anamnese</Body>
                </View>
                <View style={{ width: 34, height: 34, borderRadius: radius.pill, backgroundColor: colors.broto, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.musgo }}>→</Text>
                </View>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: spacing.md }} />
        <Button title="Adicionar criança" variant="secondary" onPress={() => navigation.navigate('ChildForm')} />

        <Divider />

        <Label>Ferramentas</Label>
        <View style={{ height: spacing.sm }} />
        <Button title="Planejamento de atendimentos" variant="ghost" onPress={() => navigation.navigate('Panel')} />
        <Button title="Privacidade e meus dados" variant="ghost" onPress={() => navigation.navigate('Privacy')} />
      </Screen>
    </SafeAreaView>
  );
}

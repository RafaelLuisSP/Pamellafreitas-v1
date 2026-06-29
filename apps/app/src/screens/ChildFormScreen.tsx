import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, Heading, Body, Field, Button, ErrorNote } from '../components/ui';
import { spacing } from '../theme/tokens';
import { api, ApiError } from '../api/client';
import type { AppScreenProps } from '../navigation/types';

export function ChildFormScreen({ navigation }: AppScreenProps<'ChildForm'>) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validDate(d: string): boolean {
    return d === '' || /^\d{4}-\d{2}-\d{2}$/.test(d);
  }

  async function onSubmit() {
    setError('');
    if (!name.trim()) {
      setError('Conte o nome da criança para começarmos.');
      return;
    }
    if (!validDate(birthdate.trim())) {
      setError('A data de nascimento deve estar no formato AAAA-MM-DD.');
      return;
    }
    setLoading(true);
    try {
      const { child } = await api.createChild({ name: name.trim(), birthdate: birthdate.trim() || null });
      navigation.replace('Anamnese', { childId: child.id, childName: child.name });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Vamos tentar de novo, com calma.');
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Heading level={2}>Sobre a criança</Heading>
      <View style={{ height: spacing.xs }} />
      <Body muted>Só o essencial por aqui. O resto vem com calma, na anamnese.</Body>
      <View style={{ height: spacing.lg }} />

      <ErrorNote>{error}</ErrorNote>
      <Field label="Nome da criança" value={name} onChangeText={setName} placeholder="Nome" autoCapitalize="words" />
      <Field label="Data de nascimento (opcional)" value={birthdate} onChangeText={setBirthdate} placeholder="AAAA-MM-DD" autoCapitalize="none" />
      <Button title="Salvar e abrir anamnese" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}

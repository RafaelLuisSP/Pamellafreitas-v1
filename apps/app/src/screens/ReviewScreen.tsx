import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QUESTIONNAIRE, type AnamneseAnswers } from '@pf/shared';
import { Screen, Heading, Body, Label, Button, Card, ErrorNote, Tag } from '../components/ui';
import { colors, spacing } from '../theme/tokens';
import { api, ApiError } from '../api/client';
import type { AppScreenProps } from '../navigation/types';

export function ReviewScreen({ route, navigation }: AppScreenProps<'Review'>) {
  const { childId, childName } = route.params;
  const [answers, setAnswers] = useState<AnamneseAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getAnamnese(childId);
        setAnswers(data.answers);
        setSubmitted(data.session.status === 'submitted');
        setSubmittedAt(data.session.submittedAt);
      } catch {
        setError('Não consegui carregar a revisão agora.');
      } finally {
        setLoading(false);
      }
    })();
  }, [childId]);

  async function onSubmit() {
    setSending(true);
    setError('');
    try {
      const { session } = await api.submitAnamnese(childId);
      setSubmitted(true);
      setSubmittedAt(session.submittedAt);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não consegui enviar agora. Tente de novo, com calma.');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.folha} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Label>{childName}</Label>
      <View style={{ height: spacing.xs }} />
      <Heading level={2}>Revisão da anamnese</Heading>
      <View style={{ height: spacing.xs }} />
      <Body muted>Veja se está tudo como você quer contar. Você pode voltar e ajustar quando precisar.</Body>

      {submitted ? (
        <View style={{ marginVertical: spacing.md }}>
          <Tag tone="success">
            Enviada{submittedAt ? ` em ${new Date(submittedAt).toLocaleDateString('pt-BR')}` : ''}
          </Tag>
        </View>
      ) : null}

      <View style={{ height: spacing.md }} />
      <ErrorNote>{error}</ErrorNote>

      {QUESTIONNAIRE.map((g) => (
        <Card key={g.group} style={{ marginBottom: spacing.md }}>
          <Heading level={3}>{g.title}</Heading>
          <View style={{ height: spacing.sm }} />
          {g.questions.map((q) => {
            const a = answers[q.id]?.trim();
            return (
              <View key={q.id} style={{ marginBottom: spacing.md }}>
                <Body muted>{q.order}. {q.prompt}</Body>
                <View style={{ height: 2 }} />
                <Body style={{ color: a ? colors.carvao : colors.nevoa }}>{a || '—'}</Body>
              </View>
            );
          })}
        </Card>
      ))}

      <Button title="Voltar e editar" variant="secondary" onPress={() => navigation.navigate('Anamnese', { childId, childName })} />
      <View style={{ height: spacing.sm }} />
      {!submitted ? (
        <Button title="Enviar para a Pâmella" onPress={onSubmit} loading={sending} />
      ) : (
        <Button title="Reenviar (atualizar)" variant="ghost" onPress={onSubmit} loading={sending} />
      )}
    </Screen>
  );
}

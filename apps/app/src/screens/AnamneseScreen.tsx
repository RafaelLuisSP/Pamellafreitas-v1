import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QUESTIONNAIRE, TOTAL_QUESTIONS, type AnamneseAnswers } from '@pf/shared';
import { Screen, Heading, Body, Label, Field, Button, ProgressBar, ErrorNote, Tag } from '../components/ui';
import { colors, spacing } from '../theme/tokens';
import { api, ApiError } from '../api/client';
import type { AppScreenProps } from '../navigation/types';

export function AnamneseScreen({ route, navigation }: AppScreenProps<'Anamnese'>) {
  const { childId, childName } = route.params;
  const [answers, setAnswers] = useState<AnamneseAnswers>({});
  const [group, setGroup] = useState(1);
  const [status, setStatus] = useState<'draft' | 'submitted'>('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getAnamnese(childId);
        setAnswers(data.answers);
        setGroup(Math.min(6, Math.max(1, data.session.currentGroup)));
        setStatus(data.session.status);
      } catch {
        setError('Não consegui abrir a anamnese agora. Vamos tentar de novo em instantes.');
      } finally {
        setLoading(false);
      }
    })();
  }, [childId]);

  const current = QUESTIONNAIRE.find((g) => g.group === group);
  const answeredCount = Object.values(answers).filter((v) => v.trim().length > 0).length;

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function persist(nextGroup: number) {
    setSaving(true);
    setError('');
    try {
      await api.saveAnamnese(childId, { answers, currentGroup: nextGroup });
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não consegui salvar agora. Tente de novo, com calma.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function goNext() {
    const next = Math.min(6, group + 1);
    if (await persist(next)) setGroup(next);
  }
  async function goPrev() {
    const prev = Math.max(1, group - 1);
    if (await persist(prev)) setGroup(prev);
  }
  async function goReview() {
    if (await persist(group)) navigation.navigate('Review', { childId, childName });
  }
  async function saveDraft() {
    if (await persist(group)) navigation.goBack();
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
      <Heading level={2}>{current?.title ?? 'Anamnese'}</Heading>
      <View style={{ height: spacing.xs }} />
      <Body muted>{current?.description ?? ''}</Body>

      <View style={{ height: spacing.md }} />
      <ProgressBar progress={answeredCount / TOTAL_QUESTIONS} caption={`Grupo ${group} de 6 · ${answeredCount}/${TOTAL_QUESTIONS} respondidas`} />

      {status === 'submitted' ? (
        <View style={{ marginVertical: spacing.sm }}>
          <Tag tone="success">Já enviada — você ainda pode complementar</Tag>
        </View>
      ) : null}

      {group === 1 ? (
        <View style={{ marginVertical: spacing.sm }}>
          <Body muted>Responda no seu tempo. Isto prepara o atendimento e não substitui a consulta.</Body>
        </View>
      ) : null}

      <View style={{ height: spacing.md }} />
      <ErrorNote>{error}</ErrorNote>

      {current?.questions.map((q) => (
        <Field
          key={q.id}
          label={`${q.order}. ${q.prompt}`}
          value={answers[q.id] ?? ''}
          onChangeText={(t) => setAnswer(q.id, t)}
          placeholder="Escreva com suas palavras…"
          multiline
        />
      ))}

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        {group > 1 ? (
          <View style={{ flex: 1 }}>
            <Button title="Anterior" variant="secondary" onPress={goPrev} loading={saving} />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          {group < 6 ? (
            <Button title="Próximo" onPress={goNext} loading={saving} />
          ) : (
            <Button title="Revisar respostas" onPress={goReview} loading={saving} />
          )}
        </View>
      </View>

      <View style={{ height: spacing.sm }} />
      <Button title="Salvar e voltar" variant="ghost" onPress={saveDraft} loading={saving} />
    </Screen>
  );
}

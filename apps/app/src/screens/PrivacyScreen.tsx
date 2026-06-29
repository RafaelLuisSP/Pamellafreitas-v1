import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, Heading, Body, Label, Button, Card, Divider, ErrorNote } from '../components/ui';
import { colors, spacing } from '../theme/tokens';
import { api, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const POINTS: { title: string; text: string }[] = [
  { title: 'Consentimento', text: 'Você autorizou o uso dos dados ao criar a conta, e pode retirar esse consentimento excluindo-os.' },
  { title: 'Uso exclusivamente clínico', text: 'As informações servem apenas para preparar e conduzir o atendimento do seu filho.' },
  { title: 'Armazenamento seguro', text: 'Dados guardados em banco com acesso restrito, em uma área protegida por login.' },
  { title: 'Direito de exclusão', text: 'Você pode exportar ou apagar tudo a qualquer momento, sem precisar justificar.' },
  { title: 'Não substitui a consulta', text: 'Este preenchimento prepara o encontro. Em caso de urgência, procure atendimento direto.' },
];

export function PrivacyScreen() {
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  async function onExport() {
    setBusy(true);
    setError('');
    setNote('');
    try {
      const data = await api.exportData();
      const kids = Array.isArray(data.children) ? data.children.length : 0;
      const ans = Array.isArray(data.anamneseAnswers) ? data.anamneseAnswers.length : 0;
      setNote(`Seus dados foram reunidos: ${kids} criança(s) e ${ans} resposta(s). Em breve será possível baixar em arquivo.`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não consegui reunir os dados agora.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    setBusy(true);
    setError('');
    try {
      await api.deleteAccount();
      await logout();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não consegui excluir agora. Tente de novo em instantes.');
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading level={2}>Privacidade e seus dados</Heading>
      <View style={{ height: spacing.xs }} />
      <Body muted>Cuidar do seu filho começa por cuidar das informações dele. Dado de criança é sensível — e tratamos assim.</Body>
      <View style={{ height: spacing.lg }} />

      {POINTS.map((p) => (
        <Card key={p.title} style={{ marginBottom: spacing.sm }}>
          <Label>{p.title}</Label>
          <View style={{ height: 4 }} />
          <Body>{p.text}</Body>
        </Card>
      ))}

      <Divider />

      {note ? (
        <View style={{ backgroundColor: '#E8EFE1', borderRadius: 10, padding: spacing.md, marginBottom: spacing.md }}>
          <Body style={{ color: colors.success }}>{note}</Body>
        </View>
      ) : null}
      <ErrorNote>{error}</ErrorNote>

      <Button title="Exportar meus dados" variant="secondary" onPress={onExport} loading={busy} />
      <View style={{ height: spacing.md }} />

      {!confirming ? (
        <Button title="Excluir minha conta e dados" variant="ghost" onPress={() => setConfirming(true)} />
      ) : (
        <Card style={{ borderWidth: 1, borderColor: colors.error }}>
          <Heading level={3}>Excluir tudo?</Heading>
          <View style={{ height: spacing.xs }} />
          <Body muted>Esta ação apaga sua conta, as crianças e todas as respostas. Não dá para desfazer.</Body>
          <View style={{ height: spacing.md }} />
          <Button title="Sim, excluir definitivamente" onPress={onDelete} loading={busy} />
          <View style={{ height: spacing.sm }} />
          <Button title="Cancelar" variant="ghost" onPress={() => setConfirming(false)} />
        </Card>
      )}
    </Screen>
  );
}

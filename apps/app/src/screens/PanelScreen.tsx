import React, { useMemo, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { PANEL_DEFAULTS, PANEL_FIELDS, calcPanel, formatBRL, type PanelInputs } from '@pf/shared';
import { Screen, Heading, Body, Label, Card } from '../components/ui';
import { colors, spacing, radius, fonts } from '../theme/tokens';

function Stepper({
  label,
  value,
  display,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  display: string;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs }}>
        <StepBtn label="−" onPress={() => onChange(clamp(value - step))} />
        <Text style={{ fontFamily: fonts.displayMedium, fontSize: 22, color: colors.musgo }}>{display}</Text>
        <StepBtn label="+" onPress={() => onChange(clamp(value + step))} />
      </View>
    </View>
  );
}

function StepBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => ({
        width: 46,
        height: 46,
        borderRadius: radius.pill,
        backgroundColor: colors.areia,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 22, color: colors.musgo }}>{label}</Text>
    </Pressable>
  );
}

function Output({ label, value, hero }: { label: string; value: string; hero?: boolean }) {
  return (
    <Card style={{ marginBottom: spacing.sm, backgroundColor: hero ? colors.musgo : colors.white }}>
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: hero ? colors.broto : colors.madeira }}>
        {label}
      </Text>
      <View style={{ height: 4 }} />
      <Text style={{ fontFamily: fonts.displayMedium, fontSize: hero ? 32 : 22, color: hero ? colors.linho : colors.musgo }}>{value}</Text>
    </Card>
  );
}

export function PanelScreen() {
  const [inputs, setInputs] = useState<PanelInputs>(PANEL_DEFAULTS);
  const out = useMemo(() => calcPanel(inputs), [inputs]);

  function display(key: keyof PanelInputs, value: number): string {
    if (key === 'valor') return formatBRL(value);
    if (key === 'duracao') return `${value} min`;
    return String(value);
  }

  return (
    <Screen>
      <Heading level={2}>Planejamento de atendimentos</Heading>
      <View style={{ height: spacing.xs }} />
      <Body muted>Simule sua agenda e veja, em tempo real, o que ela representa. Valores em reais.</Body>
      <View style={{ height: spacing.lg }} />

      <Card>
        {PANEL_FIELDS.map((f) => (
          <Stepper
            key={f.key}
            label={f.label}
            value={inputs[f.key]}
            display={display(f.key, inputs[f.key])}
            onChange={(v) => setInputs((prev) => ({ ...prev, [f.key]: v }))}
            min={f.min}
            max={f.max}
            step={f.step}
          />
        ))}
      </Card>

      <View style={{ height: spacing.lg }} />
      <Label>No período</Label>
      <View style={{ height: spacing.sm }} />
      <Output label="Total ganho no período" value={formatBRL(out.totalGanho)} hero />
      <Output label="Faturamento por dia" value={formatBRL(out.faturamentoDia)} />
      <Output label="Total de atendimentos" value={String(out.totalAtendimentos)} />
      <Output label="Horas por dia" value={`${out.horasPorDia.toFixed(1)} h`} />
      <Output label="Valor por hora" value={formatBRL(out.valorPorHora)} />

      <View style={{ height: spacing.sm }} />
      <Body muted>Próximos passos previstos: projeções por mês/semestre/ano e inclusão de custos (sala, plataforma, impostos) para o lucro líquido.</Body>
    </Screen>
  );
}

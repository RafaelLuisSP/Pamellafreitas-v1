// Painel de planejamento de atendimentos (simulador de faturamento).
// Protótipo validado no RAG. Moeda R$ (atendimento no Brasil).

export interface PanelInputs {
  valor: number;             // valor da consulta (R$)
  duracao: number;           // minutos
  atendimentosPorDia: number;
  diasTrabalhados: number;
}

export interface PanelOutputs {
  totalGanho: number;
  faturamentoDia: number;
  totalAtendimentos: number;
  horasPorDia: number;
  valorPorHora: number;
}

export interface PanelField {
  key: keyof PanelInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
}

export const PANEL_DEFAULTS: PanelInputs = {
  valor: 200,
  duracao: 50,
  atendimentosPorDia: 6,
  diasTrabalhados: 20,
};

export const PANEL_FIELDS: PanelField[] = [
  { key: 'valor', label: 'Valor da consulta', min: 50, max: 600, step: 10, suffix: 'R$' },
  { key: 'duracao', label: 'Duracao', min: 30, max: 120, step: 5, suffix: 'min' },
  { key: 'atendimentosPorDia', label: 'Atendimentos por dia', min: 1, max: 12, step: 1 },
  { key: 'diasTrabalhados', label: 'Dias trabalhados', min: 1, max: 26, step: 1 },
];

export function calcPanel(input: PanelInputs): PanelOutputs {
  const valor = Math.max(0, input.valor);
  const duracao = Math.max(1, input.duracao);
  const porDia = Math.max(0, input.atendimentosPorDia);
  const dias = Math.max(0, input.diasTrabalhados);
  return {
    totalGanho: valor * porDia * dias,
    faturamentoDia: valor * porDia,
    totalAtendimentos: porDia * dias,
    horasPorDia: (duracao * porDia) / 60,
    valorPorHora: valor / (duracao / 60),
  };
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
}

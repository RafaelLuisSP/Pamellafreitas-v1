import React from 'react';
import { View } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, Cluster, Step, FeatureCard, CTAButton, useNav } from '../../components/site';
import { colors, spacing } from '../../theme/tokens';

export function ComoTrabalhoScreen() {
  const go = useNav();
  return (
    <SiteShell active="ComoTrabalho">
      <Section tone="linho">
        <Kicker>Como eu trabalho</Kicker>
        <Title>Um atendimento que começa antes da primeira consulta</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          A anamnese — a história da criança contada pelos pais — é o ponto de partida de toda psicologia infantil cuidadosa. Por isso ela vem
          primeiro: assim chego ao nosso primeiro encontro já com um mapa do caso, e o tempo da consulta é todo dedicado à criança.
        </Lead>
      </Section>

      <Section tone="white">
        <Kicker>O caminho</Kicker>
        <Title>Do primeiro acesso ao primeiro encontro</Title>
        <View style={{ height: spacing.xl }} />
        <View style={{ gap: spacing.xl }}>
          <Step n={1} title="Acesso seguro, sem senha">Você entra na área dos pais com o seu e-mail e recebe um link de acesso. No primeiro acesso, registra o consentimento de uso dos dados (LGPD).</Step>
          <Step n={2} title="Anamnese com calma, em casa">São 30 perguntas em 6 blocos — motivo da procura, desenvolvimento, saúde e sono, comportamento e emoções, escola e família. Você salva o rascunho e continua quando puder.</Step>
          <Step n={3} title="Envio e preparação do caso">Ao enviar, eu recebo a anamnese e preparo o primeiro atendimento de forma personalizada, a partir do que é importante para a sua criança.</Step>
          <Step n={4} title="Agendamento da primeira consulta">Com a anamnese enviada, o agendamento on-line é liberado para você escolher o melhor horário.</Step>
        </View>
      </Section>

      <Section tone="areia">
        <Kicker>Cuidado com seus dados</Kicker>
        <Title>Sigilo e LGPD, do início ao fim</Title>
        <View style={{ height: spacing.xl }} />
        <Cluster>
          <FeatureCard title="Uso exclusivamente clínico" accent={colors.broto}>As informações da anamnese são usadas apenas para o atendimento da sua criança.</FeatureCard>
          <FeatureCard title="Acesso protegido" accent={colors.folha}>Área restrita por link de acesso e armazenamento seguro dos dados.</FeatureCard>
          <FeatureCard title="Você no controle" accent={colors.terracota}>A qualquer momento você pode exportar ou solicitar a exclusão dos dados.</FeatureCard>
        </Cluster>
        <View style={{ height: spacing.xl }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          <CTAButton label="Começar pela anamnese" onPress={() => go('Entrar')} />
          <CTAButton label="Quando buscar ajuda" tone="outline" onPress={() => go('ParaOsPais')} />
        </View>
      </Section>
    </SiteShell>
  );
}

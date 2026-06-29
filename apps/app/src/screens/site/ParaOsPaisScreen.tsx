import React from 'react';
import { View, Text } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, Cluster, FeatureCard, CTAButton, useNav } from '../../components/site';
import { colors, spacing, fonts, radius } from '../../theme/tokens';

const SINAIS = [
  'Mudanças bruscas de humor, sono ou apetite',
  'Medos, ansiedade ou apego excessivo',
  'Birras intensas e frequentes, difíceis de acalmar',
  'Dificuldades na escola, com atenção ou aprendizagem',
  'Retraimento, tristeza ou pouca vontade de brincar',
  'Conflitos constantes em casa ou com outras crianças',
  'Luto, separação, mudança ou outra transição importante',
];

export function ParaOsPaisScreen() {
  const go = useNav();
  return (
    <SiteShell active="ParaOsPais">
      <Section tone="linho">
        <Kicker>Para os pais</Kicker>
        <Title>Buscar ajuda é um gesto de cuidado — não de fracasso</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          Procurar uma psicóloga não significa que algo está “errado” com a sua criança ou com você. Significa que vocês merecem entender melhor o
          que está acontecendo e contar com apoio para atravessar esse momento.
        </Lead>
      </Section>

      <Section tone="white">
        <Kicker>Quando buscar ajuda</Kicker>
        <Title>Sinais que valem uma conversa</Title>
        <View style={{ height: spacing.lg }} />
        <View style={{ gap: spacing.sm }}>
          {SINAIS.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
              <View style={{ width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.broto, marginTop: 8 }} />
              <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 15.5, lineHeight: 25, color: colors.carvao }}>{s}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: spacing.md }} />
        <Para>
          Nenhum sinal isolado é um diagnóstico. Mas, quando algo preocupa ou se repete, conversar cedo costuma tornar o cuidado mais leve e
          eficaz.
        </Para>
      </Section>

      <Section tone="areia">
        <Kicker>O que esperar</Kicker>
        <Title>Como o acompanhamento ajuda</Title>
        <View style={{ height: spacing.xl }} />
        <Cluster>
          <FeatureCard title="Compreensão" accent={colors.broto}>Entender o que está por trás do comportamento, no lugar de apenas tentar controlá-lo.</FeatureCard>
          <FeatureCard title="Orientação" accent={colors.folha}>Estratégias práticas para o dia a dia, pensadas para a realidade da sua família.</FeatureCard>
          <FeatureCard title="Acolhimento" accent={colors.terracota}>Um espaço sem julgamento, onde a criança e os pais podem respirar e ser ouvidos.</FeatureCard>
        </Cluster>
        <View style={{ height: spacing.xl }} />
        <CTAButton label="Começar pela anamnese" onPress={() => go('Entrar')} />
      </Section>
    </SiteShell>
  );
}

import React from 'react';
import { View, Text, Image } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, Cluster, FeatureCard, CTAButton, useNav, useWide } from '../../components/site';
import { colors, spacing, fonts } from '../../theme/tokens';
import { site } from '../../config';

const TREE = require('../../../assets/logo-arvore.png');

export function SobreScreen() {
  const go = useNav();
  const wide = useWide(900);
  return (
    <SiteShell active="Sobre">
      <Section tone="linho">
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: spacing.xl, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Kicker>Sobre</Kicker>
            <Title>Escutar a criança, acolher a família</Title>
            <View style={{ height: spacing.md }} />
            <Lead>
              Sou {site.nome}, psicóloga dedicada ao cuidado da infância. Acredito que comportamento é comunicação: por trás de cada “birra”,
              recusa ou silêncio, existe uma criança tentando dizer algo que ainda não tem palavras para nomear.
            </Lead>
            <Para>
              Meu trabalho começa pela escuta — da criança e de quem cuida dela. A partir daí, construímos juntos um caminho de compreensão que
              respeita o tempo, a história e o jeito único de cada família.
            </Para>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image source={TREE} style={{ width: wide ? 260 : 200, height: wide ? 301 : 232, resizeMode: 'contain' }} accessibilityLabel="Símbolo da árvore" />
          </View>
        </View>
      </Section>

      <Section tone="white">
        <Kicker>No que acredito</Kicker>
        <Title>Valores que guiam o atendimento</Title>
        <View style={{ height: spacing.xl }} />
        <Cluster>
          <FeatureCard title="Compreender antes de corrigir" accent={colors.broto}>O sintoma é um ponto de partida, não um rótulo. Buscamos o sentido antes de querer mudar o comportamento.</FeatureCard>
          <FeatureCard title="Vínculo e sigilo" accent={colors.folha}>Um espaço seguro e confidencial, onde a criança e a família se sentem respeitadas.</FeatureCard>
          <FeatureCard title="Família como parceira" accent={colors.terracota}>Os pais não são espectadores: são parte essencial do cuidado e da mudança.</FeatureCard>
        </Cluster>
      </Section>

      <Section tone="areia">
        <Kicker>Formação e atuação</Kicker>
        <Title>Quem cuida da sua criança</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          {site.especialidade} · {site.crp} · {site.atendimento}.
        </Lead>
        <Para>
          (Espaço reservado para a sua biografia: formação, abordagem terapêutica, especializações e a experiência que você quer compartilhar com
          as famílias. É só me enviar e eu publico aqui.)
        </Para>
        <View style={{ height: spacing.lg }} />
        <CTAButton label="Falar comigo" tone="outline" onPress={() => go('Contato')} />
      </Section>
    </SiteShell>
  );
}

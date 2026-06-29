import React from 'react';
import { View, Text, Image } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, Cluster, FeatureCard, Step, CTAButton, useNav, useWide } from '../../components/site';
import { colors, spacing, fonts } from '../../theme/tokens';
import { site } from '../../config';

const TREE = require('../../../assets/logo-arvore.png');

export function InicioScreen() {
  const go = useNav();
  const wide = useWide(900);
  return (
    <SiteShell active="Inicio">
      {/* HERO */}
      <View style={{ backgroundColor: colors.linho, paddingHorizontal: spacing.lg, paddingTop: 44, paddingBottom: 60 }}>
        <View style={{ width: '100%', maxWidth: 1100, alignSelf: 'center', flexDirection: wide ? 'row' : 'column', alignItems: 'center', gap: spacing.xl }}>
          <View style={{ flex: 1 }}>
            <Kicker>Psicologia Infantil</Kicker>
            <Text style={{ fontFamily: fonts.displayLight, fontSize: wide ? 52 : 38, lineHeight: wide ? 58 : 44, color: colors.musgo }}>Pâmella Freitas</Text>
            <View style={{ height: spacing.md }} />
            <Text style={{ fontFamily: fonts.italic, fontSize: wide ? 22 : 19, lineHeight: wide ? 32 : 27, color: colors.folha }}>“{site.lema}”</Text>
            <View style={{ height: spacing.md }} />
            <Lead>Um espaço de escuta cuidadosa para a sua criança — e um apoio para a sua família. Aqui, compreender vem antes de corrigir.</Lead>
            <View style={{ height: spacing.lg }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              <CTAButton label="Começar pela anamnese" onPress={() => go('Entrar')} />
              <CTAButton label="Como eu trabalho" tone="outline" onPress={() => go('ComoTrabalho')} />
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={TREE} style={{ width: wide ? 340 : 240, height: wide ? 394 : 278, resizeMode: 'contain' }} accessibilityLabel="Símbolo da árvore — Pâmella Freitas" />
          </View>
        </View>
      </View>

      {/* PARA QUEM */}
      <Section tone="white">
        <Kicker>Para quem é</Kicker>
        <Title>Um cuidado pensado para a infância</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          Atendo crianças e oriento as famílias que as acompanham. Quem conversa comigo, preenche a anamnese e organiza a rotina do cuidado são
          sempre os pais e responsáveis — com sigilo e respeito ao tempo de cada criança.
        </Lead>
        <View style={{ height: spacing.xl }} />
        <Cluster>
          <FeatureCard title="Para a criança" accent={colors.broto}>Um ambiente seguro para se expressar, ser ouvida e compreendida no seu próprio ritmo.</FeatureCard>
          <FeatureCard title="Para os pais" accent={colors.folha}>Clareza sobre o que está acontecendo e orientação prática para apoiar em casa.</FeatureCard>
          <FeatureCard title="Para a família" accent={colors.terracota}>Caminhos para reduzir conflitos e fortalecer os vínculos do dia a dia.</FeatureCard>
        </Cluster>
      </Section>

      {/* COMO FUNCIONA */}
      <Section tone="areia">
        <Kicker>Como funciona</Kicker>
        <Title>Três passos, com calma</Title>
        <View style={{ height: spacing.xl }} />
        <Cluster>
          <Step n={1} title="Acesse a área dos pais">Entre com o seu e-mail — sem senha. Você recebe um link seguro de acesso e dá o consentimento (LGPD).</Step>
          <Step n={2} title="Conte a história da criança">Preencha a anamnese com tranquilidade, em casa. São 30 perguntas em 6 blocos, e você pode salvar e continuar depois.</Step>
          <Step n={3} title="Agende a primeira consulta">Ao enviar a anamnese, o agendamento on-line é liberado e chego ao primeiro encontro já conhecendo o caso.</Step>
        </Cluster>
        <View style={{ height: spacing.xl }} />
        <CTAButton label="Acessar a área dos pais" onPress={() => go('Entrar')} />
      </Section>

      {/* MANIFESTO */}
      <Section tone="musgo" maxWidth={820}>
        <Text style={{ fontFamily: fonts.displayLight, fontSize: wide ? 30 : 25, lineHeight: wide ? 42 : 35, color: colors.linho, textAlign: 'center' }}>
          Toda criança já está se comunicando do jeito que consegue. Meu trabalho é ajudar a entender o que ela quer dizer — antes de pedir que
          ela mude.
        </Text>
      </Section>

      {/* CTA FINAL */}
      <Section tone="white">
        <View style={{ alignItems: 'center' }}>
          <Title style={{ textAlign: 'center' }}>Pronto para começar?</Title>
          <View style={{ height: spacing.sm }} />
          <Lead>O primeiro passo é a anamnese. Leva o tempo que precisar — e prepara um atendimento sob medida para a sua criança.</Lead>
          <View style={{ height: spacing.lg }} />
          <CTAButton label="Começar pela anamnese" onPress={() => go('Entrar')} />
        </View>
      </Section>
    </SiteShell>
  );
}

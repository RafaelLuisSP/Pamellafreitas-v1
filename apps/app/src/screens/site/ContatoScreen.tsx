import React from 'react';
import { View, Text } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, Step, CTAButton, openExternal, useNav } from '../../components/site';
import { colors, spacing, fonts } from '../../theme/tokens';
import { site, whatsappLink } from '../../config';

export function ContatoScreen() {
  const go = useNav();
  const wa = whatsappLink('Olá, Pâmella! Tenho uma dúvida sobre o atendimento infantil.');
  return (
    <SiteShell active="Contato">
      <Section tone="linho">
        <Kicker>Contato</Kicker>
        <Title>Vamos começar com calma</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          O caminho do atendimento começa pela anamnese — assim a primeira consulta já é dedicada inteiramente à sua criança. O agendamento
          on-line é liberado logo após o envio.
        </Lead>
        <View style={{ height: spacing.lg }} />
        <CTAButton label="Acessar a área dos pais" onPress={() => go('Entrar')} />
      </Section>

      <Section tone="white">
        <Kicker>O passo a passo</Kicker>
        <Title>Da anamnese ao agendamento</Title>
        <View style={{ height: spacing.xl }} />
        <View style={{ gap: spacing.lg }}>
          <Step n={1} title="Preencha a anamnese">Entre com seu e-mail na área dos pais e conte a história da sua criança, no seu tempo.</Step>
          <Step n={2} title="Envie quando estiver pronta">Ao enviar, eu recebo as informações e preparo o atendimento.</Step>
          <Step n={3} title="Agende a primeira consulta">O agendamento on-line é liberado para você escolher o melhor horário.</Step>
        </View>
      </Section>

      <Section tone="areia">
        <Kicker>Dúvidas antes de começar?</Kicker>
        <Title>Fale comigo</Title>
        <View style={{ height: spacing.md }} />
        <Para>Se preferir conversar antes de preencher a anamnese, estes são os canais de contato:</Para>
        <View style={{ height: spacing.md }} />
        <View style={{ gap: spacing.sm }}>
          {!!site.email && (
            <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 15.5, color: colors.musgo }}>
              E-mail: <Text style={{ fontFamily: fonts.body, color: colors.carvao }}>{site.email}</Text>
            </Text>
          )}
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 15.5, color: colors.musgo }}>
            Atendimento: <Text style={{ fontFamily: fonts.body, color: colors.carvao }}>{site.atendimento}</Text>
          </Text>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 15.5, color: colors.musgo }}>
            Registro: <Text style={{ fontFamily: fonts.body, color: colors.carvao }}>{site.crp}</Text>
          </Text>
        </View>
        {wa && (
          <View style={{ marginTop: spacing.lg, alignSelf: 'flex-start' }}>
            <CTAButton label="Conversar no WhatsApp" onPress={() => openExternal(wa)} />
          </View>
        )}
      </Section>
    </SiteShell>
  );
}

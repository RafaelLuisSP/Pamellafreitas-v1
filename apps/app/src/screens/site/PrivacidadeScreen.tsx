import React from 'react';
import { View } from 'react-native';
import { SiteShell, Section, Kicker, Title, Lead, Para, CTAButton, useNav } from '../../components/site';
import { spacing } from '../../theme/tokens';
import { site } from '../../config';

export function PrivacidadeScreen() {
  const go = useNav();
  return (
    <SiteShell active="Privacidade">
      <Section tone="linho" maxWidth={820}>
        <Kicker>Privacidade e LGPD</Kicker>
        <Title>O cuidado com os dados da sua criança</Title>
        <View style={{ height: spacing.md }} />
        <Lead>
          Os dados da anamnese são informações sensíveis de uma criança. Por isso, são tratados com o mesmo cuidado e sigilo de um atendimento
          clínico — em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </Lead>
      </Section>

      <Section tone="white" maxWidth={820}>
        <Title>Consentimento do responsável</Title>
        <Para>
          O preenchimento é feito pelos pais ou responsáveis legais, que dão consentimento explícito no primeiro acesso. Sem esse consentimento,
          nenhum dado é coletado.
        </Para>
        <View style={{ height: spacing.lg }} />
        <Title>Finalidade exclusivamente clínica</Title>
        <Para>
          As informações são usadas apenas para preparar e conduzir o atendimento da criança. Não são compartilhadas com terceiros nem usadas
          para qualquer outra finalidade.
        </Para>
        <View style={{ height: spacing.lg }} />
        <Title>Armazenamento seguro</Title>
        <Para>
          O acesso é protegido por link de uso único (sem senha) e os dados ficam em ambiente restrito, acessível apenas no contexto do
          atendimento.
        </Para>
        <View style={{ height: spacing.lg }} />
        <Title>Seus direitos</Title>
        <Para>
          A qualquer momento, o responsável pode acessar, exportar ou solicitar a exclusão definitiva dos dados — diretamente na área dos pais, na
          tela de Privacidade.
        </Para>
        <View style={{ height: spacing.lg }} />
        <Title>Importante</Title>
        <Para>
          Este site e a anamnese não substituem uma consulta. Em situações de urgência, procure atendimento imediato. Em caso de dúvidas sobre
          seus dados, fale comigo{site.email ? ` em ${site.email}` : ''}.
        </Para>
        <View style={{ height: spacing.xl }} />
        <CTAButton label="Acessar a área dos pais" onPress={() => go('Entrar')} />
      </Section>
    </SiteShell>
  );
}

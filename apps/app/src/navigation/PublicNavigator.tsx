import React from 'react';
import { NavigationContainer, DefaultTheme, type Theme, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/tokens';
import type { PublicStackParamList } from './types';
import { InicioScreen } from '../screens/site/InicioScreen';
import { SobreScreen } from '../screens/site/SobreScreen';
import { ComoTrabalhoScreen } from '../screens/site/ComoTrabalhoScreen';
import { ParaOsPaisScreen } from '../screens/site/ParaOsPaisScreen';
import { ContatoScreen } from '../screens/site/ContatoScreen';
import { PrivacidadeScreen } from '../screens/site/PrivacidadeScreen';
import { AccessScreen } from '../screens/LoginScreen';

const Stack = createNativeStackNavigator<PublicStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.linho, primary: colors.folha, card: colors.linho, text: colors.musgo, border: colors.areia },
};

// URLs reais por pagina (Cloudflare Pages serve a SPA; ver public/_redirects).
const linking: LinkingOptions<PublicStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Inicio: '',
      Sobre: 'sobre',
      ComoTrabalho: 'como-trabalho',
      ParaOsPais: 'para-os-pais',
      Contato: 'contato',
      Privacidade: 'privacidade',
      Entrar: 'entrar',
    },
  },
};

export function PublicNavigator() {
  return (
    <NavigationContainer
      theme={navTheme}
      linking={linking}
      documentTitle={{ formatter: () => 'Pâmella Freitas · Psicologia Infantil' }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.linho } }}>
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="Sobre" component={SobreScreen} />
        <Stack.Screen name="ComoTrabalho" component={ComoTrabalhoScreen} />
        <Stack.Screen name="ParaOsPais" component={ParaOsPaisScreen} />
        <Stack.Screen name="Contato" component={ContatoScreen} />
        <Stack.Screen name="Privacidade" component={PrivacidadeScreen} />
        <Stack.Screen
          name="Entrar"
          component={AccessScreen}
          options={{
            headerShown: true,
            title: '',
            headerBackTitle: 'Voltar',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.linho },
            headerTintColor: colors.musgo,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

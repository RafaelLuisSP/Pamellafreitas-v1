import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer, type Theme as NavTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import { colors, fonts } from '../theme/tokens';
import type { AppStackParamList } from './types';
import { AccessScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ChildFormScreen } from '../screens/ChildFormScreen';
import { AnamneseScreen } from '../screens/AnamneseScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { PanelScreen } from '../screens/PanelScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();

const navTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.linho,
    primary: colors.folha,
    card: colors.linho,
    text: colors.musgo,
    border: colors.areia,
  },
};

const screenOptions = {
  headerStyle: { backgroundColor: colors.linho },
  headerShadowVisible: false,
  headerTintColor: colors.musgo,
  headerTitleStyle: { fontFamily: fonts.display, color: colors.musgo },
  contentStyle: { backgroundColor: colors.linho },
} as const;

function AppFlow() {
  return (
    <AppStack.Navigator screenOptions={screenOptions}>
      <AppStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="ChildForm" component={ChildFormScreen} options={{ title: 'Nova criança' }} />
      <AppStack.Screen name="Anamnese" component={AnamneseScreen} options={{ title: 'Anamnese' }} />
      <AppStack.Screen name="Review" component={ReviewScreen} options={{ title: 'Revisão' }} />
      <AppStack.Screen name="Panel" component={PanelScreen} options={{ title: 'Planejamento' }} />
      <AppStack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacidade e dados' }} />
    </AppStack.Navigator>
  );
}

function Splash({ label }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.linho }}>
      <ActivityIndicator color={colors.folha} />
      {label ? (
        <Text style={{ marginTop: 12, fontFamily: fonts.body, color: colors.folha }}>{label}</Text>
      ) : null}
    </View>
  );
}

export function RootNavigator() {
  const { guardian, loading, verifying, needsName } = useAuth();

  if (loading || verifying) {
    return <Splash label={verifying ? 'Validando seu acesso…' : undefined} />;
  }
  if (!guardian) return <AccessScreen />;
  if (needsName) return <OnboardingScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      <AppFlow />
    </NavigationContainer>
  );
}

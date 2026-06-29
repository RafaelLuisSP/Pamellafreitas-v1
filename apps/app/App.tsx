import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Spectral_300Light,
  Spectral_400Regular,
  Spectral_500Medium,
  Spectral_400Regular_Italic,
} from '@expo-google-fonts/spectral';
import { Mulish_400Regular, Mulish_600SemiBold, Mulish_700Bold } from '@expo-google-fonts/mulish';
import { AuthProvider } from './src/auth/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors, fonts } from './src/theme/tokens';

export default function App() {
  const [loaded] = useFonts({
    Spectral_300Light,
    Spectral_400Regular,
    Spectral_500Medium,
    Spectral_400Regular_Italic,
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {loaded ? (
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.linho }}>
          <Text style={{ fontFamily: fonts.body, color: colors.folha }}>Vamos com calma…</Text>
        </View>
      )}
    </SafeAreaProvider>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// O fluxo de acesso (magic link) e o onboarding sao telas unicas, renderizadas
// diretamente pelo RootNavigator — nao precisam de stack proprio.

export type AppStackParamList = {
  Home: undefined;
  ChildForm: undefined;
  Anamnese: { childId: string; childName: string };
  Review: { childId: string; childName: string };
  Panel: undefined;
  Privacy: undefined;
};

export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

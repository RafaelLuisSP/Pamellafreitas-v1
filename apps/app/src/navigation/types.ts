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

// Site institucional publico (visitante deslogado). A "Area dos Pais" (Entrar)
// abre o fluxo de magic link; o resto sao paginas institucionais.
export type PublicStackParamList = {
  Inicio: undefined;
  Sobre: undefined;
  ComoTrabalho: undefined;
  ParaOsPais: undefined;
  Contato: undefined;
  Privacidade: undefined;
  Entrar: undefined;
};

export type PublicScreenProps<T extends keyof PublicStackParamList> = NativeStackScreenProps<PublicStackParamList, T>;

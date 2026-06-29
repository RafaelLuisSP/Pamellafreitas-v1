// Design tokens extraidos do Manual da Marca v1.0 (Pamella Freitas).
export const colors = {
  musgo: '#2E3A2C',
  folha: '#5F7B57',
  terracota: '#C0805A',
  madeira: '#7B5E47',
  broto: '#AFC298',
  areia: '#E7DCC6',
  linho: '#F5EFE4',
  nevoa: '#BCB3A2',
  carvao: '#38342B',
  success: '#6E8B5E',
  warning: '#D6A55C',
  error: '#B5654E',
  info: '#6E8597',
  white: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const;
export const radius = { sm: 6, md: 10, lg: 16, pill: 999 } as const;

// Familias do @expo-google-fonts (Spectral = display, Mulish = corpo).
export const fonts = {
  displayLight: 'Spectral_300Light',
  display: 'Spectral_400Regular',
  displayMedium: 'Spectral_500Medium',
  italic: 'Spectral_400Regular_Italic',
  body: 'Mulish_400Regular',
  bodySemibold: 'Mulish_600SemiBold',
  bodyBold: 'Mulish_700Bold',
} as const;

export const shadows = {
  soft: {
    shadowColor: '#2E3A2C',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  card: {
    shadowColor: '#2E3A2C',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

export const theme = { colors, spacing, radius, fonts, shadows } as const;
export type Theme = typeof theme;

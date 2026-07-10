import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

// Maps a fontWeight to the matching Fredoka family (custom fonts don't honor
// fontWeight, so we pick the family explicitly).
const FAMILY = {
  regular: 'Fredoka_400Regular',
  medium: 'Fredoka_500Medium',
  semibold: 'Fredoka_600SemiBold',
  bold: 'Fredoka_700Bold',
} as const;

function familyFor(weight: unknown): string {
  if (weight === '800' || weight === '700' || weight === 'bold') return FAMILY.bold;
  if (weight === '600') return FAMILY.semibold;
  if (weight === '500') return FAMILY.medium;
  return FAMILY.regular;
}

// Drop-in replacement for react-native <Text> that applies the Fredoka font.
export function AppText({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) as { fontWeight?: unknown } | undefined;
  const fontFamily = familyFor(flat?.fontWeight);
  return <RNText {...rest} style={[style, { fontFamily }]} />;
}

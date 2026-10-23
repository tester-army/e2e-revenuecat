import { Pressable, type PressableProps, StyleSheet, Text } from 'react-native';

import { colors, type } from '@/constants/theme';

type LightButtonProps = Omit<PressableProps, 'children' | 'style'> & { label: string };

export function LightButton({ label, disabled, ...props }: LightButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
      {...props}>
      <Text style={[type.buttonS, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: colors.buttonFill },
  pressed: { backgroundColor: colors.textBright },
  disabled: { opacity: 0.4 },
  label: { color: colors.textOnLight },
});

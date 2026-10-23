import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';

interface Props { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger'; icon?: React.ComponentProps<typeof Ionicons>['name']; style?: ViewStyle; }

export default function PrimaryButton({ title, onPress, loading = false, disabled = false, variant = 'primary', icon, style }: Props) {
  const isDisabled = disabled || loading;
  const background = variant === 'primary' ? colors.navy900 : variant === 'danger' ? colors.red600 : colors.surface;
  const textColor = variant === 'secondary' ? colors.textPrimary : colors.white;

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: background }, variant === 'secondary' && styles.secondary, isDisabled && styles.disabled, style]} onPress={onPress} disabled={isDisabled} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color={textColor} /> : (
        <>{icon ? <Ionicons name={icon} size={18} color={textColor} style={styles.icon} /> : null}<Text style={[styles.text, { color: textColor }]}>{title}</Text></>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 50, borderRadius: radius.md, paddingHorizontal: spacing.xl },
  secondary: { borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.5 },
  icon: { marginRight: spacing.sm },
  text: { ...typography.bodyMedium, fontWeight: '700' },
});
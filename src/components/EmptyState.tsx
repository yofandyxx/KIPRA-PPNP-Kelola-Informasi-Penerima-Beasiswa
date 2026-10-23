import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

interface Props { icon?: React.ComponentProps<typeof Ionicons>['name']; title: string; description?: string; actionLabel?: string; onAction?: () => void; }

export default function EmptyState({ icon = 'file-tray-outline', title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}><Ionicons name={icon} size={30} color={colors.blue600} /></View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? <PrimaryButton title={actionLabel} onPress={onAction} variant="secondary" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['4xl'], paddingHorizontal: spacing.xl },
  iconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h3, color: colors.textPrimary, textAlign: 'center' },
  description: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 19, maxWidth: 280 },
  action: { marginTop: spacing.xl, minWidth: 180 },
});
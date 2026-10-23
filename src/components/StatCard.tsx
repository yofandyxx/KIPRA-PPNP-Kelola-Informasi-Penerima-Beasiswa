import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props { label: string; value: string | number; icon: React.ComponentProps<typeof Ionicons>['name']; accent: string; accentSoft: string; helper?: string; }

export default function StatCard({ label, value, icon, accent, accentSoft, helper }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}><Ionicons name={icon} size={20} color={accent} /></View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  value: { ...typography.h1, color: colors.textPrimary, fontSize: 26 },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  helper: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs },
});
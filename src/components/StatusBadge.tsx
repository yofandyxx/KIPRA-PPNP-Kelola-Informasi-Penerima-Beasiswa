import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, statusColors, typography } from '../constants/theme';

type Status = keyof typeof statusColors;

export default function StatusBadge({ status, small = false }: { status: Status; small?: boolean }) {
  const p = statusColors[status] ?? { bg: colors.surfaceMuted, fg: colors.textSecondary, dot: colors.textMuted };
  return (
    <View style={[styles.badge, small && styles.small, { backgroundColor: p.bg }]}>
      <View style={[styles.dot, { backgroundColor: p.dot }]} />
      <Text style={[styles.text, small && styles.smallText, { color: p.fg }]} numberOfLines={1}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.full },
  small: { paddingHorizontal: spacing.sm, paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { ...typography.label, letterSpacing: 0.2 },
  smallText: { fontSize: 10 },
});
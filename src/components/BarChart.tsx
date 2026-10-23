import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface BarItem { label: string; value: number; color?: string; }

/**
 * Grafik batang horizontal sederhana tanpa library chart tambahan.
 * Lebar batang dihitung relatif terhadap nilai maksimum.
 */
export default function BarChart({ data }: { data: BarItem[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(item.value / max) * 100}%`, backgroundColor: item.color ?? colors.blue500 }]} />
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { width: 100, ...typography.tiny, color: colors.textSecondary },
  track: { flex: 1, height: 10, borderRadius: radius.full, backgroundColor: colors.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full },
  value: { width: 28, textAlign: 'right', ...typography.tiny, fontWeight: '700', color: colors.textPrimary },
});
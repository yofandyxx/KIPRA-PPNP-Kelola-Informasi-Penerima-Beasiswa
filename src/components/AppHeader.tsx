import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

interface Props { title: string; subtitle?: string; showBrand?: boolean; }

export default function AppHeader({ title, subtitle, showBrand = false }: Props) {
  return (
    <View style={styles.container}>
      {showBrand && (
        <View style={styles.brandRow}>
          <View style={styles.logoMark}><Ionicons name="school-outline" size={18} color={colors.white} /></View>
          <Text style={styles.brandText}>PPNP Scholarship</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  logoMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.navy900, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  brandText: { ...typography.label, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: 21 },
});
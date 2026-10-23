import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface Props { options: string[]; selected: string; onSelect: (v: string) => void; }

export default function FilterChips({ options, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {options.map((o) => {
        const active = o === selected;
        return (
          <TouchableOpacity key={o} style={[styles.chip, active && styles.chipActive]} onPress={() => onSelect(o)} activeOpacity={0.7}>
            <Text style={[styles.text, active && styles.textActive]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: spacing.md, gap: spacing.sm },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.navy900, borderColor: colors.navy900 },
  text: { ...typography.caption, fontWeight: '600', color: colors.textSecondary },
  textActive: { color: colors.white },
});
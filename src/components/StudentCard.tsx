import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Student } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { formatGpa, initials } from '../utils/formatUtils';

export default function StudentCard({ item, onPress }: { item: Student; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{initials(item.name)}</Text></View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.nim}>{item.nim} · {item.study_program} · {item.study_category}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}><Ionicons name="school-outline" size={12} color={colors.purple600} /><Text style={styles.metaText}>Semester {item.semester}</Text></View>
          <View style={[styles.metaChip, styles.gpaChip]}><Ionicons name="star-outline" size={12} color={colors.amber600} /><Text style={styles.metaText}>IPK {formatGpa(item.gpa)}</Text></View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.divider, gap: spacing.md, ...shadows.card },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.navy800, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.bodyMedium, fontWeight: '700', color: colors.white },
  content: { flex: 1 },
  name: { ...typography.bodyMedium, fontWeight: '700', color: colors.textPrimary },
  nim: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple100, paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.full },
  gpaChip: { backgroundColor: colors.amber100 },
  metaText: { ...typography.tiny, fontSize: 10, fontWeight: '600', color: colors.textSecondary },
});

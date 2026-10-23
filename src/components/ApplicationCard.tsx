import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Application } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import StatusBadge from './StatusBadge';

export default function ApplicationCard({ item, onPress, showStudent = true }: { item: Application; onPress: () => void; showStudent?: boolean }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.scholarship} numberOfLines={1}>{item.scholarship_name ?? 'Program Beasiswa'}</Text>
          {showStudent ? <Text style={styles.student} numberOfLines={1}>{item.student_name ?? '-'} · {item.student_nim ?? ''}</Text> : <Text style={styles.student}>Didaftarkan {item.application_date}</Text>}
        </View>
        <StatusBadge status={item.selection_status} small />
      </View>
      {item.selection_notes ? <Text style={styles.notes} numberOfLines={2}>Catatan: {item.selection_notes}</Text> : null}
      <View style={styles.footer}>
        <Text style={styles.date}>{item.application_date}</Text>
        <View style={styles.detailLink}><Text style={styles.detailText}>Detail</Text><Ionicons name="chevron-forward" size={16} color={colors.blue600} /></View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  titleWrap: { flex: 1 },
  scholarship: { ...typography.bodyMedium, fontWeight: '700', color: colors.textPrimary },
  student: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  notes: { ...typography.tiny, color: colors.textSecondary, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.sm, lineHeight: 17 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider },
  date: { ...typography.tiny, color: colors.textMuted },
  detailLink: { flexDirection: 'row', alignItems: 'center' },
  detailText: { ...typography.tiny, color: colors.blue600, fontWeight: '700' },
});
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Scholarship } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import StatusBadge from './StatusBadge';
import { formatDateRange } from '../utils/dateUtils';

export default function ScholarshipCard({ item, onPress }: { item: Scholarship; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}><Ionicons name="ribbon-outline" size={20} color={colors.blue600} /></View>
        <View style={styles.titleWrap}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.organizer} numberOfLines={1}>{item.organizer} · {item.academic_year}</Text>
        </View>
        <StatusBadge status={item.status} small />
      </View>
      <View style={styles.divider} />
      <View style={styles.metaRow}>
        <View style={styles.metaItem}><Ionicons name="calendar-outline" size={14} color={colors.textMuted} /><Text style={styles.metaText}>{formatDateRange(item.start_date, item.end_date)}</Text></View>
        <View style={styles.metaItem}><Ionicons name="people-outline" size={14} color={colors.textMuted} /><Text style={styles.metaText}>Kuota {item.quota}</Text></View>
      </View>
      <Text style={styles.requirements} numberOfLines={2}>{item.requirements || 'Persyaratan belum diisi.'}</Text>
      <View style={styles.footer}>
        <Text style={styles.code}>{item.code}</Text>
        <View style={styles.detailLink}><Text style={styles.detailText}>Lihat detail</Text><Ionicons name="chevron-forward" size={16} color={colors.blue600} /></View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1 },
  name: { ...typography.h3, color: colors.textPrimary, lineHeight: 22 },
  organizer: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.tiny, color: colors.textSecondary },
  requirements: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider },
  code: { ...typography.tiny, color: colors.textMuted, fontWeight: '600' },
  detailLink: { flexDirection: 'row', alignItems: 'center' },
  detailText: { ...typography.tiny, color: colors.blue600, fontWeight: '700' },
});
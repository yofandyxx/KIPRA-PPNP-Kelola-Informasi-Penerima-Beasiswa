import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import { applicationService } from '../services/applicationService';
import { Application } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDateID } from '../utils/dateUtils';
import { formatGpa } from '../utils/formatUtils';
import type { RootStackParamList } from './DashboardScreen';

type Route = RouteProp<RootStackParamList, 'ApplicationDetail'>;

export default function ApplicationDetailScreen() {
  const route = useRoute<Route>();
  const { id } = route.params;
  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await applicationService.getById(id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  if (loading) return <ScreenContainer><AppHeader title="Detail Pendaftaran" /><LoadingView /></ScreenContainer>;
  if (error || !data) return <ScreenContainer><AppHeader title="Detail Pendaftaran" /><ErrorBanner message={error ?? 'Data tidak ditemukan.'} onRetry={load} /></ScreenContainer>;

  return (
    <ScreenContainer scroll>
      <AppHeader title={data.scholarship_name ?? 'Pendaftaran'} subtitle={data.id} />
      <View style={styles.card}>
        <View style={styles.rowBetween}><Text style={styles.label}>Status Seleksi</Text><StatusBadge status={data.selection_status} /></View>
        <InfoRow label="Mahasiswa" value={`${data.student_name ?? '-'} (${data.student_nim ?? '-'})`} />
        <InfoRow label="Program" value={data.scholarship_name ?? '-'} />
        <InfoRow label="Tanggal Daftar" value={formatDateID(data.application_date)} />
        <InfoRow label="IPK" value={formatGpa(data.student_gpa)} />
        <InfoRow label="Semester" value={data.student_semester !== null && data.student_semester !== undefined ? String(data.student_semester) : '-'} />
        <InfoRow label="Motivasi" value={data.motivation} multiline />
        <InfoRow label="Referensi Berkas" value={data.document_url || '-'} multiline />
        {data.selection_notes ? <InfoRow label="Catatan Seleksi" value={data.selection_notes} multiline /> : null}
        {data.selection_date ? <InfoRow label="Tanggal Seleksi" value={formatDateID(data.selection_date)} /> : null}
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, multiline && styles.multiline]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  infoRow: { marginBottom: spacing.md },
  label: { ...typography.tiny, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  multiline: { lineHeight: 21 },
});
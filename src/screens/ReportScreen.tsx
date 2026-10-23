import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import BarChart from '../components/BarChart';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import { dashboardService } from '../services/dashboardService';
import { scholarshipService } from '../services/scholarshipService';
import { applicationService } from '../services/applicationService';
import { Application, ApplicationStatistic, Scholarship, ScholarshipStatistic } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';

export default function ReportScreen() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState('Semua');
  const [appStats, setAppStats] = useState<ApplicationStatistic[]>([]);
  const [scholarshipStats, setScholarshipStats] = useState<ScholarshipStatistic[]>([]);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [schs, stats, schStats, apps] = await Promise.all([
        scholarshipService.list(),
        dashboardService.getApplicationStats(selectedScholarship === 'Semua' ? undefined : selectedScholarship),
        dashboardService.getScholarshipStats(),
        applicationService.list({ scholarship_id: selectedScholarship === 'Semua' ? undefined : selectedScholarship }),
      ]);
      setScholarships(schs);
      setAppStats(stats);
      setScholarshipStats(schStats);
      setRecent(apps.slice(0, 5));
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [selectedScholarship]);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <ScreenContainer><AppHeader title="Laporan" /><LoadingView /></ScreenContainer>;

  const chartData = appStats.map((s) => ({
    label: s.name.length > 14 ? `${s.name.slice(0, 14)}…` : s.name,
    value: s.total,
    color: colors.blue500,
  }));

  const statusChart = [
    { label: 'Menunggu', value: appStats.reduce((a, b) => a + b.pending, 0), color: colors.amber500 },
    { label: 'Diterima', value: appStats.reduce((a, b) => a + b.accepted, 0), color: colors.green500 },
    { label: 'Ditolak', value: appStats.reduce((a, b) => a + b.rejected, 0), color: colors.red500 },
  ];

  return (
    <ScreenContainer scroll>
      <AppHeader title="Laporan & Statistik" subtitle="Ringkasan pendaftaran dan penerimaan." />
      {error ? <ErrorBanner message={error} onRetry={load} /> : null}

      <Text style={styles.filterLabel}>Filter Program</Text>
      <FilterChips
        options={['Semua', ...scholarships.map((s) => s.name)]}
        selected={selectedScholarship === 'Semua' ? 'Semua' : scholarships.find((s) => s.id === selectedScholarship)?.name ?? 'Semua'}
        onSelect={(v) => setSelectedScholarship(v === 'Semua' ? 'Semua' : scholarships.find((s) => s.name === v)?.id ?? 'Semua')}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Jumlah Pendaftar per Program</Text>
        {chartData.length > 0 ? <BarChart data={chartData} /> : <Text style={styles.emptyText}>Belum ada data pendaftar.</Text>}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribusi Status Seleksi</Text>
        <BarChart data={statusChart} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Ringkasan Kuota</Text>
        {scholarshipStats.map((s) => (
          <View key={s.id} style={styles.quotaRow}>
            <Text style={styles.quotaName} numberOfLines={1}>{s.name}</Text>
            <Text style={styles.quotaValue}>{s.accepted}/{s.quota}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Pendaftar Terbaru</Text>
      {recent.length === 0 ? <Text style={styles.emptyText}>Belum ada pendaftar.</Text> : recent.map((a) => (
        <View key={a.id} style={styles.recentRow}>
          <Text style={styles.recentName}>{a.student_name}</Text>
          <Text style={styles.recentMeta}>{a.scholarship_name} · {a.selection_status}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterLabel: { ...typography.tiny, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: spacing.sm },
  chartCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.divider, ...shadows.card, marginBottom: spacing.lg },
  chartTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  emptyText: { ...typography.caption, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  quotaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  quotaName: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  quotaValue: { ...typography.caption, fontWeight: '700', color: colors.blue600 },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.sm, marginBottom: spacing.md },
  recentRow: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.divider },
  recentName: { ...typography.caption, fontWeight: '700', color: colors.textPrimary },
  recentMeta: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
});
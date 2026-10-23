import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import { selectionService } from '../services/selectionService';
import { scholarshipService } from '../services/scholarshipService';
import { PublicSelectionResult, Scholarship } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDateID } from '../utils/dateUtils';

const STATUS_FILTERS = ['Semua', 'Diterima', 'Ditolak', 'Menunggu Seleksi'];

export default function AnnouncementScreen() {
  const [data, setData] = useState<PublicSelectionResult[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [scholarshipFilter, setScholarshipFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [yearFilter, setYearFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [results, schs] = await Promise.all([
        selectionService.listResults({
          scholarship_id: scholarshipFilter === 'Semua' ? undefined : scholarshipFilter,
          selection_status: statusFilter === 'Semua' ? undefined : statusFilter,
          academic_year: yearFilter === 'Semua' ? undefined : yearFilter,
        }),
        scholarshipService.list(),
      ]);
      setData(results);
      setScholarships(schs);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [scholarshipFilter, statusFilter, yearFilter]);

  useEffect(() => { void load(); }, [load]);

  const years = ['Semua', ...Array.from(new Set(scholarships.map((s) => s.academic_year).filter(Boolean)))];
  const scholarshipOptions = ['Semua', ...scholarships.map((s) => s.id)];
  const filtered = data.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.student_name.toLowerCase().includes(q) || r.student_nim.toLowerCase().includes(q) || r.scholarship_name.toLowerCase().includes(q);
  });

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <AppHeader title="Pengumuman" subtitle="Hasil seleksi beasiswa PPNP. Data pribadi tidak ditampilkan." />
            <SearchBar value={search} onChangeText={setSearch} placeholder="Cari nama atau NIM…" />
            <Text style={styles.filterLabel}>Tahun Akademik</Text>
            <FilterChips options={years} selected={yearFilter} onSelect={setYearFilter} />
            <Text style={styles.filterLabel}>Program</Text>
            <FilterChips options={['Semua', ...scholarships.map((s) => s.name)]} selected={scholarshipFilter === 'Semua' ? 'Semua' : scholarships.find((s) => s.id === scholarshipFilter)?.name ?? 'Semua'} onSelect={(v) => {
              if (v === 'Semua') setScholarshipFilter('Semua');
              else setScholarshipFilter(scholarships.find((s) => s.name === v)?.id ?? 'Semua');
            }} />
            <Text style={styles.filterLabel}>Status</Text>
            <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />
            {error ? <ErrorBanner message={error} onRetry={load} /> : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.student_name}</Text>
              <StatusBadge status={item.selection_status} small />
            </View>
            <Text style={styles.nim}>{item.student_nim}</Text>
            <View style={styles.divider} />
            <Text style={styles.program}>{item.scholarship_name}</Text>
            <Text style={styles.meta}>{item.academic_year} · {item.selection_date ? formatDateID(item.selection_date) : 'Belum diseleksi'}</Text>
            {item.selection_notes ? <Text style={styles.notes}>Catatan: {item.selection_notes}</Text> : null}
          </View>
        )}
        ListEmptyComponent={loading ? <LoadingView message="Memuat pengumuman…" /> : (
          <EmptyState icon="megaphone-outline" title="Belum ada pengumuman" description="Hasil seleksi akan tampil di sini setelah keputusan diberikan." />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] },
  filterLabel: { ...typography.tiny, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  name: { ...typography.bodyMedium, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  nim: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  program: { ...typography.caption, fontWeight: '600', color: colors.blue600 },
  meta: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  notes: { ...typography.tiny, color: colors.textSecondary, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.sm },
});
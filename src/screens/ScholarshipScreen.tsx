import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import ScholarshipCard from '../components/ScholarshipCard';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import PrimaryButton from '../components/PrimaryButton';
import { scholarshipService } from '../services/scholarshipService';
import { Scholarship } from '../types';
import { spacing } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const FILTERS = ['Semua', 'Aktif', 'Ditutup'];

export default function ScholarshipScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await scholarshipService.list({ search, status })); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [search, status]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => {
    const t = setTimeout(() => { void load(); }, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <AppHeader title="Beasiswa" subtitle="Kelola program beasiswa yang tersedia." />
            <SearchBar value={search} onChangeText={setSearch} placeholder="Cari nama, kode, atau penyelenggara…" />
            <FilterChips options={FILTERS} selected={status} onSelect={setStatus} />
            {error ? <ErrorBanner message={error} onRetry={load} /> : null}
          </View>
        }
        renderItem={({ item }) => <ScholarshipCard item={item} onPress={() => navigation.navigate('ScholarshipDetail', { id: item.id })} />}
        ListEmptyComponent={loading ? <LoadingView message="Memuat beasiswa…" /> : (
          <EmptyState
            icon="ribbon-outline"
            title={search || status !== 'Semua' ? 'Tidak ada hasil' : 'Belum ada beasiswa'}
            description={search || status !== 'Semua' ? 'Coba ubah kata kunci atau filter.' : 'Tambahkan program beasiswa pertama.'}
            actionLabel={!search && status === 'Semua' ? 'Tambah Beasiswa' : undefined}
            onAction={!search && status === 'Semua' ? () => navigation.navigate('ScholarshipForm', {}) : undefined}
          />
        )}
      />
      <View style={styles.fab}><PrimaryButton title="Tambah Beasiswa" icon="add" onPress={() => navigation.navigate('ScholarshipForm', {})} /></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 100 },
  fab: { position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: spacing.lg },
});
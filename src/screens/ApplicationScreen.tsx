import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FilterChips from '../components/FilterChips';
import ApplicationCard from '../components/ApplicationCard';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import { applicationService } from '../services/applicationService';
import { Application } from '../types';
import { spacing } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const FILTERS = ['Semua', 'Menunggu Seleksi', 'Diterima', 'Ditolak'];

export default function ApplicationScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Application[]>([]);
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await applicationService.list({ selection_status: filter === 'Semua' ? undefined : filter })); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [filter]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <AppHeader title="Pendaftaran" subtitle="Semua pendaftaran beasiswa." />
            <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
            {error ? <ErrorBanner message={error} onRetry={load} /> : null}
          </View>
        }
        renderItem={({ item }) => <ApplicationCard item={item} onPress={() => navigation.navigate('ApplicationDetail', { id: item.id })} />}
        ListEmptyComponent={loading ? <LoadingView message="Memuat pendaftaran…" /> : (
          <EmptyState icon="document-text-outline" title="Belum ada pendaftaran" description="Pendaftaran yang masuk akan muncul di sini." />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] },
});
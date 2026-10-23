import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import StudentCard from '../components/StudentCard';
import EmptyState from '../components/EmptyState';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import PrimaryButton from '../components/PrimaryButton';
import { studentService } from '../services/studentService';
import { Student } from '../types';
import { spacing } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function StudentScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await studentService.list({ search })); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [search]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => { const t = setTimeout(() => { void load(); }, 300); return () => clearTimeout(t); }, [load]);

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <AppHeader title="Mahasiswa" subtitle="Data mahasiswa calon penerima beasiswa." />
            <SearchBar value={search} onChangeText={setSearch} placeholder="Cari NIM atau nama…" />
            {error ? <ErrorBanner message={error} onRetry={load} /> : null}
          </View>
        }
        renderItem={({ item }) => <StudentCard item={item} onPress={() => navigation.navigate('StudentDetail', { id: item.id })} />}
        ListEmptyComponent={loading ? <LoadingView message="Memuat mahasiswa…" /> : (
          <EmptyState
            icon="people-outline"
            title={search ? 'Mahasiswa tidak ditemukan' : 'Belum ada mahasiswa'}
            description={search ? 'Coba kata kunci lain.' : 'Tambahkan data mahasiswa untuk memulai.'}
            actionLabel={!search ? 'Tambah Mahasiswa' : undefined}
            onAction={!search ? () => navigation.navigate('StudentForm', {}) : undefined}
          />
        )}
      />
      <View style={styles.fab}><PrimaryButton title="Tambah Mahasiswa" icon="person-add" onPress={() => navigation.navigate('StudentForm', {})} /></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 100 },
  fab: { position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: spacing.lg },
});
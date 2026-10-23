import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmDialog from '../components/ConfirmDialog';
import { studentService } from '../services/studentService';
import { Student } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { formatGpa } from '../utils/formatUtils';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'StudentDetail'>;

export default function StudentDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { id } = route.params;
  const [data, setData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await studentService.getById(id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const onDelete = async () => {
    setDeleting(true);
    try { await studentService.remove(id); setConfirmVisible(false); navigation.goBack(); }
    catch (err) { setError(getErrorMessage(err)); setConfirmVisible(false); }
    finally { setDeleting(false); }
  };

  if (loading) return <ScreenContainer><AppHeader title="Detail Mahasiswa" /><LoadingView /></ScreenContainer>;
  if (error || !data) return <ScreenContainer><AppHeader title="Detail Mahasiswa" /><ErrorBanner message={error ?? 'Data tidak ditemukan.'} onRetry={load} /></ScreenContainer>;

  return (
    <ScreenContainer scroll>
      <AppHeader title={data.name} subtitle={data.nim} />
      <View style={styles.card}>
        <InfoRow label="Program Studi" value={data.study_program} />
        <InfoRow label="Kategori Program Studi" value={data.study_category} />
        <InfoRow label="Semester" value={String(data.semester)} />
        <InfoRow label="IPK" value={formatGpa(data.gpa)} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Nomor Telepon" value={data.phone || '-'} />
      </View>
      <PrimaryButton title="Edit Mahasiswa" icon="create-outline" onPress={() => navigation.navigate('StudentForm', { id: data.id })} style={styles.action} />
      <PrimaryButton title="Hapus Mahasiswa" icon="trash-outline" variant="danger" onPress={() => setConfirmVisible(true)} style={styles.action} />
      <ConfirmDialog
        visible={confirmVisible}
        title="Hapus Mahasiswa?"
        message="Mahasiswa dengan riwayat pendaftaran tidak dapat dihapus."
        confirmLabel={deleting ? 'Menghapus…' : 'Hapus'}
        destructive
        onConfirm={onDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.divider, ...shadows.card, marginBottom: spacing.xl },
  infoRow: { marginBottom: spacing.md },
  label: { ...typography.tiny, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  action: { marginBottom: spacing.md },
});

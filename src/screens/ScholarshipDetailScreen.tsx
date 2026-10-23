import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import StatusBadge from '../components/StatusBadge';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmDialog from '../components/ConfirmDialog';
import { scholarshipService } from '../services/scholarshipService';
import { Scholarship } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDateID } from '../utils/dateUtils';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ScholarshipDetail'>;

export default function ScholarshipDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { id } = route.params;
  const [data, setData] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await scholarshipService.getById(id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const onDelete = async () => {
    setDeleting(true);
    try {
      await scholarshipService.remove(id);
      setConfirmVisible(false);
      navigation.goBack();
    } catch (err) { setError(getErrorMessage(err)); setConfirmVisible(false); }
    finally { setDeleting(false); }
  };

  if (loading) return <ScreenContainer><AppHeader title="Detail Beasiswa" /><LoadingView /></ScreenContainer>;
  if (error || !data) return <ScreenContainer><AppHeader title="Detail Beasiswa" /><ErrorBanner message={error ?? 'Data tidak ditemukan.'} onRetry={load} /></ScreenContainer>;

  return (
    <ScreenContainer scroll>
      <AppHeader title={data.name} subtitle={data.code} />
      <View style={styles.card}>
        <View style={styles.rowBetween}><Text style={styles.label}>Status</Text><StatusBadge status={data.status} /></View>
        <InfoRow label="Penyelenggara" value={data.organizer} />
        <InfoRow label="Tahun Akademik" value={data.academic_year} />
        <InfoRow label="Periode" value={`${formatDateID(data.start_date)} – ${formatDateID(data.end_date)}`} />
        <InfoRow label="Kuota" value={`${data.quota} penerima`} />
        <InfoRow label="Persyaratan" value={data.requirements || '-'} multiline />
        <InfoRow label="Deskripsi" value={data.description || '-'} multiline />
      </View>
      <PrimaryButton title="Edit Beasiswa" icon="create-outline" onPress={() => navigation.navigate('ScholarshipForm', { id: data.id })} style={styles.action} />
      <PrimaryButton title="Hapus Beasiswa" icon="trash-outline" variant="danger" onPress={() => setConfirmVisible(true)} style={styles.action} />
      <ConfirmDialog
        visible={confirmVisible}
        title="Hapus Beasiswa?"
        message="Data yang sudah memiliki pendaftar tidak dapat dihapus. Tindakan ini tidak dapat dibatalkan."
        confirmLabel={deleting ? 'Menghapus…' : 'Hapus'}
        destructive
        onConfirm={onDelete}
        onCancel={() => setConfirmVisible(false)}
      />
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
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.divider, ...shadows.card, marginBottom: spacing.xl },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  infoRow: { marginBottom: spacing.md },
  label: { ...typography.tiny, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  multiline: { lineHeight: 21 },
  action: { marginBottom: spacing.md },
});
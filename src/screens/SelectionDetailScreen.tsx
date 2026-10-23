import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import StatusBadge from '../components/StatusBadge';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmDialog from '../components/ConfirmDialog';
import { applicationService } from '../services/applicationService';
import { selectionService } from '../services/selectionService';
import { Application, QuotaSummary } from '../types';
import { getErrorMessage } from '../utils/errorHandler';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'SelectionDetail'>;

export default function SelectionDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { id } = route.params;
  const [data, setData] = useState<Application | null>(null);
  const [quota, setQuota] = useState<QuotaSummary | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ visible: boolean; status: 'Diterima' | 'Ditolak' | null }>({ visible: false, status: null });

  const load = useCallback(async () => {
    setError(null);
    try {
      const app = await applicationService.getById(id);
      setData(app);
      setNotes(app.selection_notes);
      const q = await selectionService.getQuotaSummary(app.scholarship_id);
      setQuota(q);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const submitDecision = async () => {
    if (!confirm.status) return;
    setSaving(true);
    try {
      await selectionService.select(id, { selection_status: confirm.status, selection_notes: notes });
      setConfirm({ visible: false, status: null });
      navigation.goBack();
    } catch (err) { setError(getErrorMessage(err)); setConfirm({ visible: false, status: null }); }
    finally { setSaving(false); }
  };

  if (loading) return <ScreenContainer><AppHeader title="Detail Seleksi" /><LoadingView /></ScreenContainer>;
  if (error || !data) return <ScreenContainer><AppHeader title="Detail Seleksi" /><ErrorBanner message={error ?? 'Data tidak ditemukan.'} onRetry={load} /></ScreenContainer>;

  const isFinal = data.selection_status !== 'Menunggu Seleksi';
  const quotaFull = quota ? quota.remaining <= 0 : false;

  return (
    <ScreenContainer scroll>
      <AppHeader title="Detail Seleksi" subtitle={data.scholarship_name ?? ''} />
      <View style={styles.card}>
        <View style={styles.rowBetween}><Text style={styles.label}>Status</Text><StatusBadge status={data.selection_status} /></View>
        <InfoRow label="Mahasiswa" value={`${data.student_name ?? '-'} (${data.student_nim ?? '-'})`} />
        <InfoRow label="IPK" value={data.student_gpa !== null && data.student_gpa !== undefined ? String(data.student_gpa).replace('.', ',') : '-'} />
        <InfoRow label="Semester" value={data.student_semester !== null && data.student_semester !== undefined ? String(data.student_semester) : '-'} />
        <InfoRow label="Motivasi" value={data.motivation} multiline />
        <InfoRow label="Referensi Berkas" value={data.document_url || '-'} multiline />
      </View>

      {quota ? (
        <View style={styles.quotaCard}>
          <Text style={styles.quotaTitle}>Kuota Program</Text>
          <Text style={styles.quotaText}>{quota.accepted} diterima dari {quota.quota} kuota</Text>
          <Text style={[styles.quotaRemaining, quotaFull && styles.quotaFull]}>
            {quotaFull ? 'Kuota penuh' : `Sisa ${quota.remaining} kuota`}
          </Text>
        </View>
      ) : null}

      {!isFinal ? (
        <>
          <FormField label="Catatan Seleksi" value={notes} onChangeText={setNotes} placeholder="Catatan untuk mahasiswa (opsional)." multiline numberOfLines={3} />
          <View style={styles.actions}>
            <View style={styles.actionCol}>
              <PrimaryButton title="Terima" icon="checkmark" variant="primary" onPress={() => setConfirm({ visible: true, status: 'Diterima' })} disabled={saving || quotaFull} style={styles.acceptButton} />
            </View>
            <View style={styles.actionCol}>
              <PrimaryButton title="Tolak" icon="close" variant="danger" onPress={() => setConfirm({ visible: true, status: 'Ditolak' })} disabled={saving} />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.finalNotice}>
          <Text style={styles.finalText}>Keputusan sudah final dan tidak dapat diubah.</Text>
        </View>
      )}

      <ConfirmDialog
        visible={confirm.visible}
        title={confirm.status === 'Diterima' ? 'Terima Pendaftar?' : 'Tolak Pendaftar?'}
        message={confirm.status === 'Diterima' ? 'Pendaftar akan ditetapkan sebagai penerima beasiswa. Keputusan final.' : 'Pendaftar akan ditolak. Keputusan final.'}
        confirmLabel={saving ? 'Memproses…' : confirm.status ?? 'Ya'}
        destructive={confirm.status === 'Ditolak'}
        onConfirm={submitDecision}
        onCancel={() => setConfirm({ visible: false, status: null })}
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
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.divider, ...shadows.card, marginBottom: spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  infoRow: { marginBottom: spacing.md },
  label: { ...typography.tiny, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  multiline: { lineHeight: 21 },
  quotaCard: { backgroundColor: colors.blue50, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.blue100, marginBottom: spacing.lg },
  quotaTitle: { ...typography.caption, fontWeight: '700', color: colors.blue600 },
  quotaText: { ...typography.body, color: colors.textPrimary, marginTop: 2 },
  quotaRemaining: { ...typography.tiny, color: colors.green600, fontWeight: '700', marginTop: 4 },
  quotaFull: { color: colors.red600 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  actionCol: { flex: 1 },
  acceptButton: { backgroundColor: colors.green600 },
  finalNotice: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center' },
  finalText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import ErrorBanner from '../components/ErrorBanner';
import { scholarshipService } from '../services/scholarshipService';
import { ScholarshipInput, ScholarshipStatus } from '../types';
import { scholarshipSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorHandler';
import { colors, radius, spacing, typography } from '../constants/theme';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ScholarshipForm'>;

const initial: ScholarshipInput = {
  code:'', name:'', organizer:'', academic_year:'', start_date:'', end_date:'',
  requirements:'', description:'', quota:0, status:'Aktif',
};

export default function ScholarshipFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const editId = route.params?.id;
  const [form, setForm] = useState<ScholarshipInput>(initial);
  const [quotaText, setQuotaText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const item = await scholarshipService.getById(editId);
        setForm({ code:item.code, name:item.name, organizer:item.organizer, academic_year:item.academic_year, start_date:item.start_date, end_date:item.end_date, requirements:item.requirements, description:item.description, quota:item.quota, status:item.status });
        setQuotaText(String(item.quota));
      } catch (err) { setApiError(getErrorMessage(err)); }
    })();
  }, [editId]);

  const setField = <K extends keyof ScholarshipInput>(k: K, v: ScholarshipInput[K]) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    const candidate = { ...form, quota: Number(quotaText) };
    const check = scholarshipSchema.safeParse(candidate);
    if (!check.success) {
      const map: Record<string, string> = {};
      check.error.issues.forEach((i) => { map[String(i.path[0])] = i.message; });
      setErrors(map); return;
    }
    setErrors({}); setApiError(null); setSaving(true);
    try {
      if (editId) await scholarshipService.update(editId, candidate);
      else await scholarshipService.create(candidate);
      navigation.goBack();
    } catch (err) { setApiError(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  return (
    <ScreenContainer scroll>
      <AppHeader title={editId ? 'Edit Beasiswa' : 'Beasiswa Baru'} subtitle="Lengkapi data program beasiswa." />
      {apiError ? <ErrorBanner message={apiError} onRetry={onSubmit} /> : null}
      <FormField label="Kode Beasiswa" required value={form.code} onChangeText={(v) => setField('code', v)} placeholder="Contoh: B-PRESTASI" autoCapitalize="characters" error={errors.code} />
      <FormField label="Nama Program" required value={form.name} onChangeText={(v) => setField('name', v)} placeholder="Contoh: Beasiswa Prestasi" error={errors.name} />
      <FormField label="Penyelenggara" value={form.organizer} onChangeText={(v) => setField('organizer', v)} placeholder="Contoh: PPNP" />
      <FormField label="Tahun Akademik" value={form.academic_year} onChangeText={(v) => setField('academic_year', v)} placeholder="2025/2026" />
      <View style={styles.row}>
        <View style={styles.col}><FormField label="Tanggal Mulai" required value={form.start_date} onChangeText={(v) => setField('start_date', v)} placeholder="DD/MM/YY" error={errors.start_date} /></View>
        <View style={styles.col}><FormField label="Tanggal Akhir" required value={form.end_date} onChangeText={(v) => setField('end_date', v)} placeholder="DD/MM/YY" error={errors.end_date} /></View>
      </View>
      <FormField label="Kuota Penerima" required value={quotaText} onChangeText={setQuotaText} placeholder="10" keyboardType="number-pad" error={errors.quota} />
      <FormField label="Persyaratan" value={form.requirements} onChangeText={(v) => setField('requirements', v)} placeholder="Pisahkan dengan titik koma." multiline numberOfLines={3} />
      <FormField label="Deskripsi" value={form.description} onChangeText={(v) => setField('description', v)} multiline numberOfLines={3} />
      <Text style={styles.label}>Status Program</Text>
      <View style={styles.statusRow}>
        {(['Aktif', 'Ditutup'] as ScholarshipStatus[]).map((s) => (
          <Text key={s} onPress={() => setField('status', s)} style={[styles.statusChip, form.status === s && styles.statusChipActive]}>{s}</Text>
        ))}
      </View>
      <PrimaryButton title={editId ? 'Simpan Perubahan' : 'Simpan Beasiswa'} onPress={onSubmit} loading={saving} disabled={saving} style={styles.submit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  label: { ...typography.caption, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  statusRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statusChip: { flex: 1, textAlign: 'center', paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, ...typography.caption, fontWeight: '600', color: colors.textSecondary, overflow: 'hidden' },
  statusChipActive: { backgroundColor: colors.navy900, borderColor: colors.navy900, color: colors.white },
  submit: { marginTop: spacing.sm },
});

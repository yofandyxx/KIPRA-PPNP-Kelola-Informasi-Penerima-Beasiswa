import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import ErrorBanner from '../components/ErrorBanner';
import { studentService } from '../services/studentService';
import { StudentInput, StudyProgramCategory } from '../types';
import { studentSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorHandler';
import { spacing } from '../constants/theme';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'StudentForm'>;

const initial: StudentInput = { nim:'', name:'', study_program:'Teknologi Rekayasa Komputer', study_category:'Teknik/Komputer', semester:1, gpa:0, email:'', phone:'' };
const categories: StudyProgramCategory[] = ['Teknik/Komputer', 'Ekonomi', 'Kesehatan', 'Pendidikan', 'Sosial', 'Lainnya'];

export default function StudentFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const editId = route.params?.id;
  const [form, setForm] = useState<StudentInput>(initial);
  const [semesterText, setSemesterText] = useState('1');
  const [gpaText, setGpaText] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const item = await studentService.getById(editId);
        setForm(item);
        setSemesterText(String(item.semester));
        setGpaText(String(item.gpa).replace('.', ','));
      } catch (err) { setApiError(getErrorMessage(err)); }
    })();
  }, [editId]);

  const onSubmit = async () => {
    const candidate: StudentInput = { ...form, semester: Number(semesterText), gpa: Number(gpaText.replace(',', '.')) };
    const check = studentSchema.safeParse(candidate);
    if (!check.success) {
      const map: Record<string, string> = {};
      check.error.issues.forEach((i) => { map[String(i.path[0])] = i.message; });
      setErrors(map); return;
    }
    setErrors({}); setApiError(null); setSaving(true);
    try {
      if (editId) await studentService.update(editId, candidate);
      else await studentService.create(candidate);
      navigation.goBack();
    } catch (err) { setApiError(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  return (
    <ScreenContainer scroll>
      <AppHeader title={editId ? 'Edit Mahasiswa' : 'Mahasiswa Baru'} subtitle="Data ini digunakan untuk pendaftaran beasiswa." />
      {apiError ? <ErrorBanner message={apiError} onRetry={onSubmit} /> : null}
      <FormField label="NIM" required value={form.nim} onChangeText={(v) => setForm((p) => ({ ...p, nim: v }))} placeholder="2301001" keyboardType="number-pad" error={errors.nim} />
      <FormField label="Nama Lengkap" required value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Nama sesuai KTM" error={errors.name} />
      <FormField label="Program Studi" value={form.study_program} onChangeText={(v) => setForm((p) => ({ ...p, study_program: v }))} />
      <Text style={styles.categoryLabel}>Kategori Program Studi</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={[styles.categoryChip, form.study_category === category && styles.categoryChipActive]} onPress={() => setForm((p) => ({ ...p, study_category: category }))}>
            <Text style={[styles.categoryText, form.study_category === category && styles.categoryTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <View style={styles.col}><FormField label="Semester" required value={semesterText} onChangeText={setSemesterText} keyboardType="number-pad" error={errors.semester} /></View>
        <View style={styles.col}><FormField label="IPK" required value={gpaText} onChangeText={setGpaText} keyboardType="decimal-pad" placeholder="3,75" error={errors.gpa} /></View>
      </View>
      <FormField label="Email" required value={form.email} onChangeText={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="nama@ppnp.ac.id" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      <FormField label="Nomor Telepon" value={form.phone} onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" />
      <PrimaryButton title={editId ? 'Simpan Perubahan' : 'Simpan Mahasiswa'} onPress={onSubmit} loading={saving} disabled={saving} style={styles.submit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  submit: { marginTop: spacing.sm },
  categoryLabel: { marginTop: spacing.md, marginBottom: spacing.sm, fontSize: 13, fontWeight: '600', color: '#0B1D33' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  categoryChipActive: { backgroundColor: '#1A5FB4', borderColor: '#1A5FB4' },
  categoryText: { fontSize: 12, color: '#4A5A6E' },
  categoryTextActive: { color: '#FFFFFF', fontWeight: '700' },
});

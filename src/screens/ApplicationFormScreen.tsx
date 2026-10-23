import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import ErrorBanner from '../components/ErrorBanner';
import LoadingView from '../components/LoadingView';
import { scholarshipService } from '../services/scholarshipService';
import { studentService } from '../services/studentService';
import { applicationService } from '../services/applicationService';
import { Scholarship, Student } from '../types';
import { applicationSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorHandler';
import { colors, radius, spacing, typography } from '../constants/theme';
import type { RootStackParamList } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ApplicationFormScreen() {
  const navigation = useNavigation<Nav>();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scholarshipId, setScholarshipId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [motivation, setMotivation] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [s, m] = await Promise.all([scholarshipService.list({ status: 'Aktif' }), studentService.list()]);
        // The API remains the source of truth for the registration period.
        // Keep all active programs visible so a date-format mismatch in the
        // spreadsheet cannot make the selector appear empty.
        setScholarships(s);
        setStudents(m);
      } catch (err) { setApiError(getErrorMessage(err)); }
      finally { setLoading(false); }
    })();
  }, []);

  const onSubmit = async () => {
    const candidate = { scholarship_id: scholarshipId, student_id: studentId, motivation, document_url: documentUrl, declaration };
    const check = applicationSchema.safeParse(candidate);
    if (!check.success) {
      const map: Record<string, string> = {};
      check.error.issues.forEach((i) => { map[String(i.path[0])] = i.message; });
      setErrors(map); return;
    }
    setErrors({}); setApiError(null); setSaving(true);
    try { await applicationService.create(candidate); navigation.goBack(); }
    catch (err) { setApiError(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  if (loading) return <ScreenContainer><AppHeader title="Pendaftaran" /><LoadingView message="Menyiapkan formulir…" /></ScreenContainer>;

  return (
    <ScreenContainer scroll>
      <AppHeader title="Pendaftaran Beasiswa" subtitle="Status awal adalah Menunggu Seleksi." />
      {apiError ? <ErrorBanner message={apiError} onRetry={onSubmit} /> : null}
      <Text style={styles.sectionLabel}>Pilih Program Beasiswa *</Text>
      {errors.scholarship_id ? <Text style={styles.errorText}>{errors.scholarship_id}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
        {scholarships.map((s) => {
          const active = scholarshipId === s.id;
          return (
            <TouchableOpacity key={s.id} style={[styles.pickerCard, active && styles.pickerCardActive]} onPress={() => setScholarshipId(s.id)} activeOpacity={0.8}>
              <Ionicons name="ribbon-outline" size={20} color={active ? colors.white : colors.blue600} />
              <Text style={[styles.pickerTitle, active && styles.pickerTitleActive]} numberOfLines={2}>{s.name}</Text>
              <Text style={[styles.pickerMeta, active && styles.pickerMetaActive]}>Kuota {s.quota}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.sectionLabel}>Pilih Mahasiswa *</Text>
      {errors.student_id ? <Text style={styles.errorText}>{errors.student_id}</Text> : null}
      <View style={styles.studentList}>
        {students.map((m) => {
          const active = studentId === m.id;
          return (
            <TouchableOpacity key={m.id} style={[styles.studentRow, active && styles.studentRowActive]} onPress={() => setStudentId(m.id)} activeOpacity={0.8}>
              <View style={styles.radio}>{active ? <View style={styles.radioDot} /> : null}</View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{m.name}</Text>
                <Text style={styles.studentMeta}>{m.nim} · Semester {m.semester} · IPK {String(m.gpa).replace('.', ',')}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <FormField label="Motivasi Pendaftaran" required value={motivation} onChangeText={setMotivation} placeholder="Tuliskan alasan dan tujuan Anda." multiline numberOfLines={4} error={errors.motivation} style={styles.textarea} />
      <FormField label="Referensi Berkas" value={documentUrl} onChangeText={setDocumentUrl} placeholder="https://drive.google.com/…" keyboardType="url" autoCapitalize="none" helper="Tempelkan tautan dokumen." />
      <TouchableOpacity style={styles.declarationRow} onPress={() => setDeclaration((v) => !v)} activeOpacity={0.8}>
        <View style={[styles.checkbox, declaration && styles.checkboxActive]}>{declaration ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}</View>
        <Text style={styles.declarationText}>Saya menyatakan bahwa seluruh data yang saya isi adalah benar.</Text>
      </TouchableOpacity>
      {errors.declaration ? <Text style={styles.errorText}>{errors.declaration}</Text> : null}
      <PrimaryButton title="Kirim Pendaftaran" icon="send" onPress={onSubmit} loading={saving} disabled={saving} style={styles.submit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...typography.caption, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.sm },
  pickerScroll: { marginBottom: spacing.lg },
  pickerCard: { width: 160, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginRight: spacing.sm },
  pickerCardActive: { backgroundColor: colors.navy900, borderColor: colors.navy900 },
  pickerTitle: { ...typography.caption, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm },
  pickerTitleActive: { color: colors.white },
  pickerMeta: { ...typography.tiny, color: colors.textSecondary, marginTop: 4 },
  pickerMetaActive: { color: colors.textOnDarkMuted },
  studentList: { gap: spacing.sm, marginBottom: spacing.lg },
  studentRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: spacing.md },
  studentRowActive: { borderColor: colors.blue600, backgroundColor: colors.blue50 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue600 },
  studentInfo: { flex: 1 },
  studentName: { ...typography.caption, fontWeight: '700', color: colors.textPrimary },
  studentMeta: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  textarea: { minHeight: 100 },
  declarationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: colors.blue600, borderColor: colors.blue600 },
  declarationText: { flex: 1, ...typography.caption, color: colors.textSecondary, lineHeight: 19 },
  errorText: { ...typography.tiny, color: colors.red600, marginBottom: spacing.sm },
  submit: { marginTop: spacing.sm },
});

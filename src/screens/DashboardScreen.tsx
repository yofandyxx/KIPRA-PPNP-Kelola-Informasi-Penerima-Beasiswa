import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import StatCard from '../components/StatCard';
import SectionTitle from '../components/SectionTitle';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import { dashboardService } from '../services/dashboardService';
import { DashboardSummary } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { formatPercent } from '../utils/formatUtils';

export type RootStackParamList = {
    MainTabs: undefined;
    ScholarshipForm: { id?: string };
    ScholarshipDetail: { id: string };
    StudentForm: { id?: string };
    StudentDetail: { id: string };
    ApplicationForm: undefined;
    ApplicationDetail: { id: string };
    SelectionDetail: { id: string };
    Announcement: undefined;
    Report: undefined;
    Profile: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
    const navigation = useNavigation<Nav>();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setError(null);
        try { setSummary(await dashboardService.getSummary()); }
        catch (err) { setError(getErrorMessage(err)); }
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { void load(); }, [load]);
    const onRefresh = useCallback(() => { setRefreshing(true); void load(); }, [load]);

    if (loading && !summary) return <ScreenContainer><AppHeader title="Dashboard" showBrand /><LoadingView message="Menghubungkan ke server…" /></ScreenContainer>;
    if (error && !summary) return (
        <ScreenContainer>
            <AppHeader title="Dashboard" showBrand />
            <ErrorBanner message={error} onRetry={load} />
            <EmptyState icon="cloud-offline-outline" title="Tidak dapat memuat data" description="Periksa koneksi internet dan URL API." actionLabel="Muat ulang" onAction={load} />
        </ScreenContainer>
    );

    const s = summary!;
    const cards = [
        { label: 'Total Mahasiswa', value: s.total_students, icon: 'people-outline' as const, accent: colors.blue600, accentSoft: colors.blue100 },
        { label: 'Program Beasiswa', value: s.total_scholarships, icon: 'ribbon-outline' as const, accent: colors.purple600, accentSoft: colors.purple100 },
        { label: 'Total Pendaftar', value: s.total_applications, icon: 'document-text-outline' as const, accent: colors.blue600, accentSoft: colors.blue100 },
        { label: 'Menunggu Seleksi', value: s.total_pending, icon: 'time-outline' as const, accent: colors.amber600, accentSoft: colors.amber100 },
        { label: 'Diterima', value: s.total_accepted, icon: 'checkmark-circle-outline' as const, accent: colors.green600, accentSoft: colors.green100 },
        { label: 'Ditolak', value: s.total_rejected, icon: 'close-circle-outline' as const, accent: colors.red600, accentSoft: colors.red100 },
    ];

    return (
        <ScreenContainer scroll padded={false}>
            <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
                <AppHeader title="Dashboard" subtitle="Ringkasan pengelolaan beasiswa PPNP." showBrand />
                {error ? <ErrorBanner message={error} onRetry={load} /> : null}
                <View style={styles.grid}>
                    {cards.map((c) => <View key={c.label} style={styles.gridItem}><StatCard {...c} /></View>)}
                </View>
                <View style={styles.rateCard}>
                    <View style={styles.rateLeft}>
                        <Text style={styles.rateLabel}>Tingkat Penerimaan</Text>
                        <Text style={styles.rateValue}>{formatPercent(s.acceptance_rate)}</Text>
                        <Text style={styles.rateHelper}>{s.total_accepted} dari {s.total_applications} pendaftar diterima</Text>
                    </View>
                    <View style={styles.rateIcon}><Ionicons name="trending-up-outline" size={26} color={colors.green600} /></View>
                </View>
                <SectionTitle title="Aksi Cepat" />
                <View style={styles.quickGrid}>
                    <QuickAction icon="add-circle-outline" label="Tambah Beasiswa" color={colors.blue600} bg={colors.blue100} onPress={() => navigation.navigate('ScholarshipForm', {})} />
                    <QuickAction icon="person-add-outline" label="Tambah Mahasiswa" color={colors.purple600} bg={colors.purple100} onPress={() => navigation.navigate('StudentForm', {})} />
                    <QuickAction icon="create-outline" label="Daftar Beasiswa" color={colors.green600} bg={colors.green100} onPress={() => navigation.navigate('ApplicationForm')} />
                    <QuickAction icon="checkmark-done-outline" label="Proses Seleksi" color={colors.amber600} bg={colors.amber100} onPress={() => navigation.navigate('MainTabs')} />
                </View>
                <Text style={styles.footnote}>Data ditarik langsung dari Google Sheets melalui Apps Script API.</Text>
            </ScrollView>
        </ScreenContainer>
    );
}

function QuickAction({ icon, label, color, bg, onPress }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; color: string; bg: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.quickItem} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.quickIcon, { backgroundColor: bg }]}><Ionicons name={icon} size={22} color={color} /></View>
            <Text style={styles.quickLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
    gridItem: { width: '48%' },
    rateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.divider, ...shadows.card },
    rateLeft: { flex: 1 },
    rateLabel: { ...typography.caption, fontWeight: '600', color: colors.textSecondary },
    rateValue: { ...typography.display, fontSize: 32, color: colors.green600, marginTop: 2 },
    rateHelper: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
    rateIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.green100, alignItems: 'center', justifyContent: 'center' },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    quickItem: { width: '48%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.divider },
    quickIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
    quickLabel: { ...typography.caption, fontWeight: '600', color: colors.textPrimary },
    footnote: { ...typography.tiny, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

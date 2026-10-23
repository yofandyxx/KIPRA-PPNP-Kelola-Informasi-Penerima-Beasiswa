import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

type Mode = 'Admin' | 'Mahasiswa' | 'Publik';

const MODES: { key: Mode; icon: React.ComponentProps<typeof Ionicons>['name']; desc: string }[] = [
  { key: 'Admin', icon: 'shield-checkmark-outline', desc: 'Kelola beasiswa, mahasiswa, dan seleksi.' },
  { key: 'Mahasiswa', icon: 'person-outline', desc: 'Lihat program dan daftar beasiswa.' },
  { key: 'Publik', icon: 'globe-outline', desc: 'Lihat program dan pengumuman publik.' },
];

/**
 * Mode tampilan demo. BUKAN autentikasi/otorisasi aman.
 * Untuk produksi, gunakan verifikasi server.
 */
export default function ProfileScreen() {
  const [mode, setMode] = useState<Mode>('Admin');

  return (
    <ScreenContainer scroll>
      <AppHeader title="Profil & Mode" subtitle="Pilih mode tampilan untuk demo praktikum." />
      <View style={styles.warning}>
        <Ionicons name="information-circle-outline" size={18} color={colors.amber600} />
        <Text style={styles.warningText}>Mode ini hanya untuk demo dan bukan autentikasi aman. Jangan gunakan untuk data nyata tanpa kontrol akses server.</Text>
      </View>
      {MODES.map((m) => {
        const active = mode === m.key;
        return (
          <TouchableOpacity key={m.key} style={[styles.card, active && styles.cardActive]} onPress={() => setMode(m.key)} activeOpacity={0.8}>
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Ionicons name={m.icon} size={22} color={active ? colors.white : colors.blue600} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{m.key}</Text>
              <Text style={styles.desc}>{m.desc}</Text>
            </View>
            {active ? <Ionicons name="checkmark-circle" size={22} color={colors.green600} /> : null}
          </TouchableOpacity>
        );
      })}
      <Text style={styles.footnote}>Aplikasi ini menggunakan Google Sheets melalui Apps Script. Jangan menanam secret atau token di source code.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  warning: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.amber100, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xl },
  warningText: { flex: 1, ...typography.tiny, color: colors.amber600, lineHeight: 17 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.divider, gap: spacing.md, ...shadows.card },
  cardActive: { borderColor: colors.blue600 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: colors.blue600 },
  content: { flex: 1 },
  title: { ...typography.bodyMedium, fontWeight: '700', color: colors.textPrimary },
  desc: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  footnote: { ...typography.tiny, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, lineHeight: 17 },
});
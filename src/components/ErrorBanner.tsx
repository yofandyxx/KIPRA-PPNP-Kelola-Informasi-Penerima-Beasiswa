import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={20} color={colors.red600} />
      <Text style={styles.text}>{message}</Text>
      {onRetry ? <TouchableOpacity onPress={onRetry}><Text style={styles.retryText}>Coba lagi</Text></TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.red100, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm },
  text: { flex: 1, ...typography.caption, color: colors.red600, lineHeight: 19 },
  retryText: { ...typography.tiny, color: colors.red600, fontWeight: '700' },
});